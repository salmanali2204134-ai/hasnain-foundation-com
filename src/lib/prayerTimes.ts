/**
 * Pure TypeScript Hanafi Barelvi Prayer Times Calculation Engine
 * Tailored for Jamia Masjid Abdul Qadir Jilani, Surjani Town, Karachi & Global Cities.
 * Hanafi Jurisprudence (Asr factor = 2, Fajr = 18°, Isha = 18°).
 */

export interface PrayerTimeData {
  id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameEn: string;
  nameUr: string;
  arabicName: string;
  azanTime: Date;
  jamaatTime: Date;
  jamaatOffsetMinutes: number;
  azanTimeFormatted: string;
  jamaatTimeFormatted: string;
  virtueUr: string;
  virtueEn: string;
  quranArabic: string;
  quranRef: string;
  quranUr: string;
  quranEn: string;
  hadithArabic: string;
  hadithRef: string;
  hadithUr: string;
  hadithEn: string;
  rakatsInfoUr: string;
  rakatsInfoEn: string;
}

export interface CityLocation {
  nameEn: string;
  nameUr: string;
  lat: number;
  lng: number;
  timezone: number; // UTC offset in hours (e.g. 5 for PKT)
  jamaatOffsetMinutes?: number; // Minutes after Azan for Jama'at (Default: 30)
}

export const CITIES_LIST: CityLocation[] = [
  {
    nameEn: 'Karachi (Jamia Masjid Abdul Qadir Jilani)',
    nameUr: 'کراچی (جامع مسجد عبدالقادر جیلانی، سرجانی)',
    lat: 24.8607,
    lng: 67.0011,
    timezone: 5,
    jamaatOffsetMinutes: 30
  },
  {
    nameEn: 'Lahore (Data Darbar)',
    nameUr: 'لاہور (داتا دربار)',
    lat: 31.5204,
    lng: 74.3587,
    timezone: 5,
    jamaatOffsetMinutes: 30
  },
  {
    nameEn: 'Islamabad / Rawalpindi',
    nameUr: 'اسلام آباد / راولپنڈی',
    lat: 33.6844,
    lng: 73.0479,
    timezone: 5,
    jamaatOffsetMinutes: 30
  },
  {
    nameEn: 'Faisalabad',
    nameUr: 'فیصل آباد',
    lat: 31.4504,
    lng: 73.1350,
    timezone: 5,
    jamaatOffsetMinutes: 30
  },
  {
    nameEn: 'Multan',
    nameUr: 'ملتان شریف',
    lat: 30.1575,
    lng: 71.5249,
    timezone: 5,
    jamaatOffsetMinutes: 30
  },
  {
    nameEn: 'Peshawar',
    nameUr: 'پشاور',
    lat: 34.0151,
    lng: 71.5249,
    timezone: 5,
    jamaatOffsetMinutes: 30
  },
  {
    nameEn: 'Quetta',
    nameUr: 'کوئٹہ',
    lat: 30.1798,
    lng: 66.9750,
    timezone: 5,
    jamaatOffsetMinutes: 30
  },
  {
    nameEn: 'London, UK',
    nameUr: 'لندن (برطانیہ)',
    lat: 51.5074,
    lng: -0.1278,
    timezone: 1,
    jamaatOffsetMinutes: 30
  },
  {
    nameEn: 'Dubai, UAE',
    nameUr: 'دبئی (متحدہ عرب امارات)',
    lat: 25.2048,
    lng: 55.2708,
    timezone: 4,
    jamaatOffsetMinutes: 30
  }
];

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (rad: number) => (rad * 180) / Math.PI;

function fixAngle(angle: number): number {
  return angle - 360.0 * Math.floor(angle / 360.0);
}

function fixHour(hour: number): number {
  return hour - 24.0 * Math.floor(hour / 24.0);
}

/**
 * Format Date to 12-hour string (e.g. "8:30 PM") in target city timezone
 */
export function formatTime12h(
  date: Date,
  lang: 'en' | 'ur' = 'en',
  timezoneOffsetHours: number = 5
): string {
  const cityTimeMs = date.getTime() + timezoneOffsetHours * 3600 * 1000;
  const d = new Date(cityTimeMs);
  let hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const ampm = hours >= 12 ? (lang === 'ur' ? 'شام' : 'PM') : (lang === 'ur' ? 'صبح' : 'AM');
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minsStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minsStr} ${ampm}`;
}

/**
 * High precision Hanafi Astronomical Prayer Calculator
 * Correctly handles timezone offsets independent of browser local timezone.
 */
export function calculateHanafiPrayerTimes(
  now: Date = new Date(),
  lat: number = 24.8607,
  lng: number = 67.0011,
  timezoneOffsetHours: number = 5
): {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  zawal: Date;
} {
  // Convert current UTC time to city local calendar date (year, month, day)
  const cityTimeMs = now.getTime() + timezoneOffsetHours * 3600 * 1000;
  const cityDate = new Date(cityTimeMs);
  const year = cityDate.getUTCFullYear();
  const month = cityDate.getUTCMonth() + 1;
  const day = cityDate.getUTCDate();

  // Julian Date calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 - 0.5;

  const d = jd - 2451545.0;

  // Mean anomaly of the Sun
  const M = fixAngle(357.529 + 0.98560028 * d);

  // Mean longitude of the Sun
  const L = fixAngle(280.459 + 0.98564736 * d);

  // Center equation
  const C = 1.915 * Math.sin(rad(M)) + 0.020 * Math.sin(rad(2 * M));

  // True longitude of the Sun
  const lambda = fixAngle(L + C);

  // Obliquity of the ecliptic
  const epsilon = 23.439 - 0.00000036 * d;

  // Sun Declination
  const sinDec = Math.sin(rad(epsilon)) * Math.sin(rad(lambda));
  const dec = deg(Math.asin(sinDec));

  // Right Ascension
  let RA = deg(Math.atan2(Math.cos(rad(epsilon)) * Math.sin(rad(lambda)), Math.cos(rad(lambda))));
  RA = fixAngle(RA) / 15.0; // in hours

  // Equation of Time in minutes
  const EqT = (fixAngle(L) / 15.0 - RA) * 60.0;

  // Midday / Solar Noon (Dhuhr)
  const noonHour = 12.0 + timezoneOffsetHours - lng / 15.0 - EqT / 60.0;
  const dhuhrTime = fixHour(noonHour + 2 / 60); // 2 mins buffer after zenith

  // Zawal start (12 mins before Dhuhr)
  const zawalTime = fixHour(dhuhrTime - 12 / 60);

  // Helper for Sun Angle
  const getSunHourAngle = (angle: number): number => {
    const cosH = (Math.sin(rad(angle)) - Math.sin(rad(lat)) * Math.sin(rad(dec))) / (Math.cos(rad(lat)) * Math.cos(rad(dec)));
    if (cosH > 1 || cosH < -1) return 0;
    return deg(Math.acos(cosH)) / 15.0;
  };

  // Fajr: Angle -18° (Hanafi / Karachi)
  const hFajr = getSunHourAngle(-18.0);
  const fajrTime = fixHour(noonHour - hFajr);

  // Sunrise: Angle -0.833°
  const hSunrise = getSunHourAngle(-0.8333);
  const sunriseTime = fixHour(noonHour - hSunrise);

  // Asr (Hanafi - Shadow Factor = 2)
  const tanLatDec = Math.tan(rad(Math.abs(lat - dec)));
  const asrAltitude = deg(Math.atan(1.0 / (2.0 + tanLatDec)));
  const hAsr = getSunHourAngle(asrAltitude);
  const asrTime = fixHour(noonHour + hAsr);

  // Maghrib: Sunrise angle on setting side + 3 mins safety
  const maghribTime = fixHour(noonHour + hSunrise + 3 / 60);

  // Isha: Angle -18° (Hanafi / Karachi)
  const hIsha = getSunHourAngle(-18.0);
  const ishaTime = fixHour(noonHour + hIsha);

  // City midnight timestamp in UTC
  const cityStartUtcMs = Date.UTC(year, month - 1, day) - timezoneOffsetHours * 3600 * 1000;

  const makeDate = (hoursFloat: number): Date => {
    return new Date(cityStartUtcMs + Math.round(hoursFloat * 3600 * 1000));
  };

  return {
    fajr: makeDate(fajrTime),
    sunrise: makeDate(sunriseTime),
    dhuhr: makeDate(dhuhrTime),
    asr: makeDate(asrTime),
    maghrib: makeDate(maghribTime),
    isha: makeDate(ishaTime),
    zawal: makeDate(zawalTime)
  };
}

export function getFullPrayerList(
  city: CityLocation = CITIES_LIST[0],
  now: Date = new Date()
): {
  prayers: PrayerTimeData[];
  currentActivePrayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nextPrayer: PrayerTimeData;
  timeRemainingStr: string;
} {
  const times = calculateHanafiPrayerTimes(now, city.lat, city.lng, city.timezone);
  const defaultJamaatOffsetMinutes = city.jamaatOffsetMinutes || 30;

  const prayersRaw = [
    {
      id: 'fajr' as const,
      nameEn: 'Fajr',
      nameUr: 'فجر',
      arabicName: 'الفجر',
      azan: times.fajr,
      jamaatOffset: defaultJamaatOffsetMinutes,
      virtueUr: 'نمازِ فجر ادا کرنے والا اللہ تعالیٰ کی حفاظت و ذمے داری میں آ جاتا ہے۔ (صحیح مسلم)',
      virtueEn: 'Whoever offers the Fajr prayer comes under the direct protection and custody of Allah Almighty.',
      quranArabic: 'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا',
      quranRef: 'سورة الإسراء - 17:78',
      quranUr: 'ترجمہ: "نماز قائم کیجیے زوالِ آفتاب سے رات کی تاریکی تک اور فجر کا قرآن (نمازِ فجر)، یقیناً فجر کے قرآن پر فرشتے حاضر ہوتے ہیں۔"',
      quranEn: 'Translation: "Establish prayer at the decline of the sun until the darkness of the night and [also] the Quran of dawn. Indeed, the recitation of dawn is ever witnessed."',
      hadithArabic: 'مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
      hadithRef: 'صحيح مسلم - 148',
      hadithUr: 'رسول اللہ ﷺ نے فرمایا: "جس نے فجر کی نماز ادا کی وہ اللہ تعالیٰ کی امان اور ذمے داری میں آ گیا۔"',
      hadithEn: 'The Messenger of Allah (PBUH) said: "He who offers the dawn prayer (Fajr) comes under the protection of Allah."',
      rakatsInfoUr: '۲ سنتِ مؤکدہ + ۲ فرض (باجماعت)',
      rakatsInfoEn: '2 Sunnah Mu\'akkadah + 2 Fard (Congregational)'
    },
    {
      id: 'dhuhr' as const,
      nameEn: 'Dhuhr',
      nameUr: 'ظہر',
      arabicName: 'الظهر',
      azan: times.dhuhr,
      jamaatOffset: defaultJamaatOffsetMinutes,
      virtueUr: 'یہ وہ وقت ہے جب آسمانوں کے دروازے کھولے جاتے ہیں اور نیک اعمال قبول ہوتے ہیں۔',
      virtueEn: 'This is an hour when the gates of the heavens are opened and righteous deeds ascend.',
      quranArabic: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
      quranRef: 'سورة النساء - 4:103',
      quranUr: 'ترجمہ: "بے شک نماز مسلمانوں پر اپنے مقررہ وقتوں کے اندر ادا کرنا فرض ہے۔"',
      quranEn: 'Translation: "Indeed, prayer has been decreed upon the believers a decree of specified times."',
      hadithArabic: 'تِلْكَ سَاعَةٌ تُفْتَحُ فِيهَا أَبْوَابُ السَّمَاءِ، فَأُحِبُّ أَنْ يَصْعَدَ لِي فِيهَا عَمَلٌ صَالِحٌ',
      hadithRef: 'جامع الترمذي - 478',
      hadithUr: 'رسول اللہ ﷺ نے فرمایا: "یہ وہ مبارک وقت ہے جس میں آسمان کے دروازے کھول دیے جاتے ہیں، اور میں پسند کرتا ہوں کہ اس وقت میرا کوئی نیک عمل اوپر اٹھایا جائے۔"',
      hadithEn: 'The Prophet (PBUH) said: "It is an hour in which the gates of the heavens are opened, and I love that a righteous deed of mine should ascend during it."',
      rakatsInfoUr: '۴ سنتِ مؤکدہ + ۴ فرض + ۲ سنتِ مؤکدہ + ۲ نفل',
      rakatsInfoEn: '4 Sunnah Mu\'akkadah + 4 Fard + 2 Sunnah Mu\'akkadah + 2 Nafl'
    },
    {
      id: 'asr' as const,
      nameEn: 'Asr (Hanafi)',
      nameUr: 'عصر (فقہ حنفی)',
      arabicName: 'العصر',
      azan: times.asr,
      jamaatOffset: defaultJamaatOffsetMinutes,
      virtueUr: 'جس نے ٹھنڈے اوقات (فجر و عصر) کی نماز کی پابندی کی وہ جنت میں داخل ہوگا۔ (متفق علیہ)',
      virtueEn: 'Whoever observes the two cool prayers (Fajr and Asr) diligently shall enter Paradise.',
      quranArabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
      quranRef: 'سورة البقرة - 2:238',
      quranUr: 'ترجمہ: "تمام نمازوں کی حفاظت کرو بالخصوص درمیانی نماز (عصر) کی، اور اللہ کے حضور ادب و خشوع سے کھڑے ہو۔"',
      quranEn: 'Translation: "Maintain with care the obligatory prayers and [in particular] the middle prayer (Asr) and stand before Allah, devoutly obedient."',
      hadithArabic: 'مَنْ تَرَكَ صَلَاةَ الْعَصْرِ حَبِطَ عَمَلُهُ',
      hadithRef: 'صحيح البخاري - 553',
      hadithUr: 'نبی کریم ﷺ نے فرمایا: "جس نے عصر کی نماز (قصداً) چھوڑ دی اس کے تمام (نیک) اعمال ضائع ہو گئے۔"',
      hadithEn: 'The Prophet (PBUH) said: "Whoever misses the Asr prayer, his good deeds are rendered null and void."',
      rakatsInfoUr: '۴ سنتِ غیر مؤکدہ + ۴ فرض (باجماعت)',
      rakatsInfoEn: '4 Sunnah Ghair Mu\'akkadah + 4 Fard (Congregational)'
    },
    {
      id: 'maghrib' as const,
      nameEn: 'Maghrib',
      nameUr: 'مغرب',
      arabicName: 'المغرب',
      azan: times.maghrib,
      jamaatOffset: 2, // Maghrib prayer is offered 2 minutes after the adhan
      virtueUr: 'مغرب کی نماز کے فوراً بعد دعا قبول ہوتی ہے اور فرشتوں کی حاضری کا وقت ہوتا ہے۔',
      virtueEn: 'Maghrib marks the completion of the fasting day and an accepted hour for supplications.',
      quranArabic: 'فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ',
      quranRef: 'سورة الروم - 30:17',
      quranUr: 'ترجمہ: "پس اللہ کی پاکی بیان کرو جب تم شام کرتے ہو (مغرب و عشاء) اور جب تم صبح کرتے ہو (فجر)۔"',
      quranEn: 'Translation: "So exalted is Allah when you reach the evening and when you reach the morning."',
      hadithArabic: 'لَا تَزَالُ أُمَّتِي بِخَيْرٍ مَا لَمْ يُؤَخِّرُوا الْمَغْرِبَ حَتَّى تَشْتَبِكَ النُّجُومُ',
      hadithRef: 'سنن أبي داود - 418',
      hadithUr: 'رسول اللہ ﷺ نے فرمایا: "میری امت اس وقت تک خیر و بھلائی پر رہے گی جب تک وہ مغرب کی نماز میں اتنی تاخیر نہ کرے کہ ستارے خوب ظاہر ہو جائیں۔"',
      hadithEn: 'The Prophet (PBUH) said: "My Ummah will continue to be upon good as long as they do not delay Maghrib until the stars intertwine."',
      rakatsInfoUr: '۳ فرض + ۲ سنتِ مؤکدہ + ۲ نفل (اوابین)',
      rakatsInfoEn: '3 Fard + 2 Sunnah Mu\'akkadah + 2 Nafl (Awwabin)'
    },
    {
      id: 'isha' as const,
      nameEn: 'Isha',
      nameUr: 'عشاء',
      arabicName: 'العشاء',
      azan: times.isha,
      jamaatOffset: defaultJamaatOffsetMinutes,
      virtueUr: 'جس نے باجماعت عشاء پڑھی گویا اس نے آدھی رات قیام کیا، اور فجر باجماعت پڑھی گویا پوری رات قیام کیا۔',
      virtueEn: 'Offering Isha in congregation is equivalent to spending half the night in worship.',
      quranArabic: 'وَمِنَ اللَّيْلِ فَاسْجُدْ لَهُ وَسَبِّحْهُ لَيْلًا طَوِيلًا',
      quranRef: 'سورة الإنسان - 76:26',
      quranUr: 'ترجمہ: "اور رات کے کچھ حصے میں اس کے آگے سجدہ ریز ہو اور رات کے لمبے حصے میں اس کی تسبیح بیان کر۔"',
      quranEn: 'Translation: "And during the night prostrate to Him and exalt Him a long part of the night."',
      hadithArabic: 'مَنْ صَلَّى الْعِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ',
      hadithRef: 'صحيح مسلم - 656',
      hadithUr: 'رسول اللہ ﷺ نے فرمایا: "جس نے عشاء کی نماز باجماعت ادا کی گویا اس نے آدھی رات قیام کیا، اور جس نے فجر بھی باجماعت پڑھی گویا اس نے پوری رات عبادت کی۔"',
      hadithEn: 'The Prophet (PBUH) said: "He who observes the Isha prayer in congregation, it is as if he prayed up to midnight; and he who observes the Fajr prayer in congregation, it is as if he prayed the whole night."',
      rakatsInfoUr: '۴ سنت + ۴ فرض + ۲ سنت + ۲ نفل + ۳ وتر واجب + ۲ نفل',
      rakatsInfoEn: '4 Sunnah + 4 Fard + 2 Sunnah + 2 Nafl + 3 Witr Wajib + 2 Nafl'
    }
  ];

  const prayers: PrayerTimeData[] = prayersRaw.map((p) => {
    // Jama'at time calculation
    const jamaat = new Date(p.azan.getTime() + p.jamaatOffset * 60000);
    return {
      id: p.id,
      nameEn: p.nameEn,
      nameUr: p.nameUr,
      arabicName: p.arabicName,
      azanTime: p.azan,
      jamaatTime: jamaat,
      jamaatOffsetMinutes: p.jamaatOffset,
      azanTimeFormatted: formatTime12h(p.azan, 'en', city.timezone),
      jamaatTimeFormatted: formatTime12h(jamaat, 'en', city.timezone),
      virtueUr: p.virtueUr,
      virtueEn: p.virtueEn,
      quranArabic: p.quranArabic,
      quranRef: p.quranRef,
      quranUr: p.quranUr,
      quranEn: p.quranEn,
      hadithArabic: p.hadithArabic,
      hadithRef: p.hadithRef,
      hadithUr: p.hadithUr,
      hadithEn: p.hadithEn,
      rakatsInfoUr: p.rakatsInfoUr,
      rakatsInfoEn: p.rakatsInfoEn
    };
  });

  // Determine active prayer based on absolute timestamp
  const nowMs = now.getTime();
  let currentActivePrayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' = 'isha';
  let nextPrayer: PrayerTimeData = prayers[0]; // default fajr

  if (nowMs >= times.fajr.getTime() && nowMs < times.dhuhr.getTime()) {
    currentActivePrayerId = 'fajr';
    nextPrayer = prayers[1]; // Dhuhr
  } else if (nowMs >= times.dhuhr.getTime() && nowMs < times.asr.getTime()) {
    currentActivePrayerId = 'dhuhr';
    nextPrayer = prayers[2]; // Asr
  } else if (nowMs >= times.asr.getTime() && nowMs < times.maghrib.getTime()) {
    currentActivePrayerId = 'asr';
    nextPrayer = prayers[3]; // Maghrib
  } else if (nowMs >= times.maghrib.getTime() && nowMs < times.isha.getTime()) {
    currentActivePrayerId = 'maghrib';
    nextPrayer = prayers[4]; // Isha
  } else {
    currentActivePrayerId = 'isha';
    // Next prayer is Fajr tomorrow
    nextPrayer = prayers[0];
  }

  // Calculate time remaining until next prayer
  let nextTimeMs = nextPrayer.azanTime.getTime();
  if (nextTimeMs <= nowMs) {
    // Tomorrow's next prayer (+ 24 hours)
    nextTimeMs += 24 * 3600 * 1000;
  }

  const diffMs = Math.max(0, nextTimeMs - nowMs);
  const diffHours = Math.floor(diffMs / (3600 * 1000));
  const diffMins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
  const diffSecs = Math.floor((diffMs % (60 * 1000)) / 1000);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const timeRemainingStr = `${pad(diffHours)}h ${pad(diffMins)}m ${pad(diffSecs)}s`;

  return {
    prayers,
    currentActivePrayerId,
    nextPrayer,
    timeRemainingStr
  };
}

/**
 * Web Audio Synthesizer for soft Azan chime alert
 */
export function playPrayerChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Play a gentle 4-tone oriental chime
    const tones = [523.25, 659.25, 783.99, 1046.50];
    tones.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.25);
      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.25);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.25 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.25 + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.25);
      osc.stop(ctx.currentTime + index * 0.25 + 1.3);
    });
  } catch (err) {
    console.log('Audio playback prevented or unsupported');
  }
}
