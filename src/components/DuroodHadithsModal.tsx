import React, { useState } from 'react';
import { 
  X, BookOpen, Heart, Sparkles, Copy, Check, Search, Share2, 
  Volume2, VolumeX, Plus, RefreshCw, Bookmark, Award, ArrowRight
} from 'lucide-react';
import { Language } from '../types';

interface DuroodHadithsModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onQuickSubmitDurood?: (duroodType: string, count: number) => void;
}

export interface HadithItem {
  id: number;
  topicUrdu: string;
  topicEn: string;
  arabic: string;
  urdu: string;
  english: string;
  reference: string;
}

export interface DuroodReaderItem {
  id: string;
  titleUrdu: string;
  titleEnglish: string;
  arabic: string;
  urdu: string;
  english: string;
  virtueUrdu: string;
  virtueEnglish: string;
  category: string;
}

export const HADITH_COLLECTION: HadithItem[] = [
  {
    id: 1,
    topicUrdu: "دس رحمتیں اور درجات کی بلندی",
    topicEn: "Ten Blessings and Elevation of Ranks",
    arabic: "مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا",
    urdu: "جس شخص نے مجھ پر ایک مرتبہ درود بھیجا، اللہ تعالیٰ اس پر دس رحمتیں نازل فرماتا ہے۔",
    english: "Whosoever sends one blessing upon me, Allah sends ten blessings upon him.",
    reference: "صحیح مسلم: 408 (Sahih Muslim)"
  },
  {
    id: 2,
    topicUrdu: "بروزِ قیامت قربِ مصطفیٰ ﷺ",
    topicEn: "Proximity to the Prophet on Resurrection Day",
    arabic: "أَوْلَى النَّاسِ بِي يَوْمَ الْقِيَامَةِ أَكْثَرُهُمْ عَلَيَّ صَلاَةً",
    urdu: "قیامت کے دن لوگوں میں سے میرے سب سے زیادہ قریب وہ شخص ہوگا جو مجھ پر سب سے زیادہ درود بھیجتا ہو گا۔",
    english: "The closest of people to me on the Day of Resurrection will be those who send the most blessings upon me.",
    reference: "جامع ترمذی: 484 (Jami At-Tirmidhi)"
  },
  {
    id: 3,
    topicUrdu: "بخیل کی تعریف اور درود سے محرومی",
    topicEn: "Definition of the Miser",
    arabic: "الْبَخِيلُ الَّذِي مَنْ ذُكِرْتُ عِنْدَهُ فَلَمْ يُصَلَّ عَلَيَّ",
    urdu: "حقیقی بخیل وہ شخص ہے جس کے سامنے میرا ذکر کیا جائے اور وہ مجھ پر درود نہ بھیجے۔",
    english: "The true miser is the one in whose presence I am mentioned and he does not send blessings upon me.",
    reference: "جامع ترمذی: 3546 (Jami At-Tirmidhi)"
  },
  {
    id: 4,
    topicUrdu: "غموں سے نجات اور گناہوں کی معافی",
    topicEn: "Relief from Sorrows and Forgiveness of Sins",
    arabic: "إِذًا تُكْفَى هَمَّكَ وَيُغْفَرُ لَكَ ذَنْبُكَ",
    urdu: "(کثرت سے درود پڑھنے سے) تمہاری تمام فکریں اور غم دور کر دیے جائیں گے اور تمہارے گناہ معاف کر دیے جائیں گے۔",
    english: "(By abundant Durood) Your worries will be completely relieved and your sins will be forgiven.",
    reference: "جامع ترمذی: 2457 (Jami At-Tirmidhi)"
  },
  {
    id: 5,
    topicUrdu: "فرشتوں کے ذریعے سلام کی پیشی",
    topicEn: "Angels Conveying Greetings of Peace",
    arabic: "إِنَّ لِلَّهِ مَلاَئِكَةً سَيَّاحِينَ فِي الأَرْضِ يُبَلِّغُونِي مِنْ أُمَّتِي السَّلاَمَ",
    urdu: "بے شک اللہ تعالیٰ کے کچھ فرشتے زمین میں سیاحت کرتے ہیں جو میری امت کا سلام مجھ تک پہنچاتے ہیں۔",
    english: "Verily, Allah has angels who travel through the earth to convey to me the greetings of peace from my Ummah.",
    reference: "سنن نسائی: 1282 (Sunan An-Nasa'i)"
  },
  {
    id: 6,
    topicUrdu: "سلام کا براہِ راست جواب",
    topicEn: "Direct Response to Greetings",
    arabic: "مَا مِنْ أَحَدٍ يُسَلِّمُ عَلَيَّ إِلاَّ رَدَّ اللَّهُ عَلَيَّ رُوحِي حَتَّى أَرُدَّ عَلَيْهِ السَّلاَمَ",
    urdu: "جب بھی کوئی شخص مجھ پر سلام بھیجتا ہے، اللہ تعالیٰ میری روح مبارک لوٹا دیتا ہے تاکہ میں اس کے سلام کا جواب دوں۔",
    english: "Whenever anyone sends greetings of peace upon me, Allah restores my soul so that I may return his greeting.",
    reference: "سنن ابوداؤد: 2041 (Sunan Abi Dawud)"
  },
  {
    id: 7,
    topicUrdu: "درود شریف پاکیزگی و برکت کا ذریعہ",
    topicEn: "Durood as a Source of Purification",
    arabic: "صَلُّوا عَلَيَّ فَإِنَّ صَلاَتَكُمْ زَكَاةٌ لَكُمْ",
    urdu: "مجھ پر درود بھیجا کرو، کیونکہ تمہارا درود پڑھنا تمہارے لیے پاکیزگی و برکت کا باعث ہے۔",
    english: "Send blessings upon me, for your blessings are a source of purification and grace for you.",
    reference: "مسند احمد: 8780 (Musnad Ahmad)"
  },
  {
    id: 8,
    topicUrdu: "صبح و شام کی شفاعت کا مژدہ",
    topicEn: "Intercession in the Morning and Evening",
    arabic: "مَنْ صَلَّى عَلَيَّ حِينَ يُصْبِحُ عَشْرًا وَحِينَ يُمْسِي عَشْرًا أَدْرَكَتْهُ شَفَاعَتِي يَوْمَ الْقِيَامَةِ",
    urdu: "جس نے صبح کے وقت ۱۰ بار اور شام کے وقت ۱۰ بار مجھ پر درود بھیجا، اسے قیامت کے دن میری شفاعت حاصل ہو گی۔",
    english: "Whoever sends blessings upon me ten times in the morning and ten times in the evening will attain my intercession on Resurrection Day.",
    reference: "الطبرانی فی الکبیر: 1259 (Al-Tabarani)"
  },
  {
    id: 9,
    topicUrdu: "۱۰ نیکیوں، ۱۰ گناہوں اور ۱۰ درجات کا اضافہ",
    topicEn: "Ten Virtues, Sins Forgiven, and Degrees Raised",
    arabic: "مَنْ صَلَّى عَلَيَّ صَلاَةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا وَحَطَّ عَنْهُ عَشْرَ خَطِيئَاتٍ وَرَفَعَ لَهُ عَشْرَ دَرَجَاتٍ",
    urdu: "جو شخص مجھ پر ایک بار درود بھیجتا ہے، اللہ اس پر ۱۰ رحمتیں نازل فرماتا ہے، اس کی ۱۰ خطائیں معاف کرتا ہے اور ۱۰ درجات بلند کرتا ہے۔",
    english: "Whoever sends one blessing upon me, Allah writes for him ten virtues, erases ten sins, and raises him ten degrees.",
    reference: "سنن نسائی: 1297 (Sunan An-Nasa'i)"
  },
  {
    id: 10,
    topicUrdu: "جمعہ المبارک کے دن درود کی فضیلت",
    topicEn: "Virtue of Durood on Blessed Friday",
    arabic: "أَكْثِرُوا الصَّلاَةَ عَلَيَّ يَوْمَ الْجُمُعَةِ وَلَيْلَةَ الْجُمُعَةِ",
    urdu: "جمعہ کے دن اور جمعہ کی رات مجھ پر کثرت سے درود بھیجا کرو، کیونکہ تمہارا درود مجھ پر پیش کیا جاتا ہے۔",
    english: "Increase your recitation of blessings upon me on Friday and Friday night, for your blessings are presented to me.",
    reference: "سنن بیہقی: 5994 (Sunan Al-Bayhaqi)"
  },
  {
    id: 11,
    topicUrdu: "دعا کی قبولیت کا دارومدار",
    topicEn: "Condition for Acceptance of Supplication",
    arabic: "الدُّعَاءُ مَوْقُوفٌ بَيْنَ السَّمَاءِ وَالأَرْضِ لاَ يَصْعَدُ مِنْهُ شَيْءٌ حَتَّى تُصَلِّيَ عَلَى نَبِيِّكَ",
    urdu: "دعا آسمان اور زمین کے درمیان معلق رہتی ہے، اس میں سے کچھ بھی اوپر نہیں جاتا جب تک تم اپنے نبیؐ پر درود نہ بھیج لو۔",
    english: "Dua remains suspended between heaven and earth and none of it ascends until you send blessings upon your Prophet.",
    reference: "جامع ترمذی: 486 (Jami At-Tirmidhi)"
  },
  {
    id: 12,
    topicUrdu: "تحریر میں درود شریف لکھنے کا ثواب",
    topicEn: "Reward of Writing Durood in Documents",
    arabic: "مَنْ صَلَّى عَلَيَّ فِي كِتَابٍ لَمْ تَزَلِ الْمَلاَئِكَةُ تَسْتَغْفِرُ لَهُ مَا دَامَ اسْمِي فِي ذَلِكَ الْكِتَابِ",
    urdu: "جس نے کسی کتاب یا تحریر میں مجھ پر درود لکھا، فرشتے اس کے لیے اس وقت تک استغفار کرتے رہتے ہیں جب تک میرا نام اس میں موجود رہے۔",
    english: "Whoever writes blessings upon me in a document, the angels do not cease seeking forgiveness for him as long as my name remains in it.",
    reference: "المعجم الاوسط للطبرانی: 1835 (Al-Tabarani)"
  },
  {
    id: 13,
    topicUrdu: "درود نہ پڑھنے والے پر وعید",
    topicEn: "Warning for Neglecting Durood",
    arabic: "رَغِمَ أَنْفُ رَجُلٍ ذُكِرْتُ عِنْدَهُ فَلَمْ يُصَلَّ عَلَيَّ",
    urdu: "وہ شخص ذلیل و رسوا ہو جائے جس کے سامنے میرا ذکر مبارک ہو اور وہ مجھ پر درود نہ بھیجے۔",
    english: "May his nose be rubbed in the dust who hears me mentioned and does not send blessings upon me.",
    reference: "جامع ترمذی: 3545 (Jami At-Tirmidhi)"
  },
  {
    id: 14,
    topicUrdu: "جنت کا راستہ اور درود سے غفلت",
    topicEn: "The Path to Paradise",
    arabic: "مَنْ نَسِيَ الصَّلاَةَ عَلَيَّ خَطِئَ طَرِيقَ الْجَنَّةِ",
    urdu: "جو شخص مجھ پر درود پڑھنا بھول گیا، وہ جنت کے راستے سے بھٹک گیا۔",
    english: "Whoever forgets to send blessings upon me has strayed from the path to Paradise.",
    reference: "سنن ابن ماجہ: 908 (Sunan Ibn Majah)"
  },
  {
    id: 15,
    topicUrdu: "جبرائیل امینؑ کی آمد اور مژدہ",
    topicEn: "Angel Jibreel's Good News",
    arabic: "جَاءَنِي جِبْرِيلُ فَقَالَ: مَنْ صَلَّى عَلَيْكَ صَلَّى اللَّهُ عَلَيْهِ وَمَنْ سَلَّمَ عَلَيْكَ سَلَّمَ اللَّهُ عَلَيْهِ",
    urdu: "میرے پاس حضرت جبرائیل علیہ السلام آئے اور کہا: جو آپؐ پر درود بھیجے اللہ اس پر رحمت بھیجتا ہے اور جو آپؐ پر سلام بھیجے اللہ اس پر سلامتی نازل کرتا ہے۔",
    english: "Jibreel came to me and said: Whoever sends blessings upon you, Allah blesses him; and whoever greets you, Allah grants him peace.",
    reference: "مسند احمد: 1662 (Musnad Ahmad)"
  },
  {
    id: 16,
    topicUrdu: "میدانِ محشر میں سب سے زیادہ مستحق",
    topicEn: "Most Deserving of Companionship in Hereafter",
    arabic: "إِنَّ أَوْلَى النَّاسِ بِي يَوْمَ الْقِيَامَةِ أَنَّهُمْ يُكْثِرُونَ الصَّلاَةَ عَلَيَّ",
    urdu: "بروزِ قیامت تمام انسانوں میں سے میرے سب سے زیادہ مستحق وہ لوگ ہوں گے جو مجھ پر بکثرت درود و سلام بھیجتے ہیں۔",
    english: "The most deserving of my companionship on Resurrection Day are those who send blessings upon me most frequently.",
    reference: "شعب الایمان للبیہقی: 1412 (Shu'ab Al-Iman)"
  },
  {
    id: 17,
    topicUrdu: "جمعہ کے دن ۸۰ بار درود اور ۸۰ سال کے گناہ",
    topicEn: "80 Times Durood on Friday for 80 Years Sins Forgiven",
    arabic: "مَنْ صَلَّى عَلَيَّ يَوْمَ الْجُمُعَةِ ثَمَانِينَ مَرَّةً غَفَرَ اللَّهُ لَهُ ذُنُوبَ ثَمَانِينَ سَنَةً",
    urdu: "جس نے جمعہ کے دن مجھ پر ۸۰ مرتبہ درود پڑھا، اللہ تعالیٰ اس کے ۸۰ سال کے گناہ معاف فرما دیتا ہے۔",
    english: "Whoever sends blessings upon me 80 times on Friday, Allah forgives 80 years of his sins.",
    reference: "الجامع الصغیر للسیوطی: 8811 (Al-Jami Al-Saghir)"
  },
  {
    id: 18,
    topicUrdu: "مجالس کی زینت اور پل صراط کا نور",
    topicEn: "Ornament of Gatherings & Light on Sirat",
    arabic: "زيِّنُوا مَجَالِسَكُمْ بِالصَّلَاةِ عَلَيَّ فَإِنَّ صَلَاتَكُمْ عَلَيَّ نُورٌ لَكُمْ يَوْمَ الْقِيَامَةِ",
    urdu: "اپنی مجلسوں کو مجھ پر درود پڑھ کر آراستہ کرو، کیونکہ تمہارا مجھ پر درود پڑھنا قیامت کے دن تمہارے لیے کامل نور ہوگا۔",
    english: "Adorn your gatherings by sending blessings upon me, for your blessings upon me will be light for you on Resurrection Day.",
    reference: "مسند الفردوس للدیلمی: 3221 (Al-Daylami)"
  },
  {
    id: 19,
    topicUrdu: "فرشتوں کا مسلسل استغفار",
    topicEn: "Continuous Supplication of Angels",
    arabic: "مَنْ صَلَّى عَلَيَّ صَلاَةً لَمْ تَزَلِ الْمَلاَئِكَةُ تُصَلِّي عَلَيْهِ مَا صَلَّى عَلَيَّ فَلْيُقِلَّ عَبْدٌ مِنْ ذَلِك أَوْ لِيُكْثِرْ",
    urdu: "جب تک بندہ مجھ پر درود بھیجتا رہتا ہے، فرشتے اس پر رحمت کی دعا کرتے رہتے ہیں، اب بندے کی مرضی ہے کم پڑھے یا زیادہ۔",
    english: "As long as a servant sends blessings upon me, the angels continue to pray for blessings upon him. Let the servant recite less or more as he wishes.",
    reference: "مسند احمد: 15680 (Musnad Ahmad)"
  },
  {
    id: 20,
    topicUrdu: "روزانہ ایک ہزار بار درود شریف کی بشارت",
    topicEn: "Glads Tidings of 1000 Daily Recitations",
    arabic: "مَنْ صَلَّى عَلَيَّ فِي يَوْمٍ أَلْفَ مَرَّةٍ لَمْ يَمُتْ حَتَّى يَرَى مَقْعَدَهُ مِنَ الْجَنَّةِ",
    urdu: "جس نے ایک دن میں مجھ پر ایک ہزار بار درود بھیجا، وہ اس وقت تک نہیں مرے گا جب تک کہ وہ جنت میں اپنا مقام نہ دیکھ لے۔",
    english: "Whoever sends blessings upon me 1,000 times in a day will not pass away until he beholds his abode in Paradise.",
    reference: "الترغیب والترہیب: 2614 (At-Targhib wa At-Tarhib)"
  },
  {
    id: 21,
    topicUrdu: "پل صراط پر کامل روشنی",
    topicEn: "Radiant Light on the Sirat Bridge",
    arabic: "الصَّلاَةُ عَلَيَّ نُورٌ عَلَى الصِّرَاطِ",
    urdu: "مجھ پر درود بھیجنا تاریک پل صراط پر درخشندہ اور کامل نور ہے۔",
    english: "Sending blessings upon me is a radiant light upon the Sirat bridge.",
    reference: "مسند الفردوس للدیلمی: 3810 (Al-Daylami)"
  },
  {
    id: 22,
    topicUrdu: "کوہِ احد کے برابر ثوابِ قیراط",
    topicEn: "Reward of a Qirat Equal to Mount Uhud",
    arabic: "مَنْ صَلَّى عَلَيَّ صَلاَةً كَتَبَ اللَّهُ لَهُ قِيرَاطًا وَالْقِيرَاطُ مِثْلُ أُحُدٍ",
    urdu: "جس نے مجھ پر ایک بار درود بھیجا، اللہ اس کے لیے ایک قیراط ثواب لکھتا ہے، اور ایک قیراط احد پہاڑ کے برابر ہے۔",
    english: "Whoever sends one blessing upon me, Allah records for him a Qirat of reward, and a Qirat is equivalent to Mount Uhud.",
    reference: "المعجم الکبیر للطبرانی: 14290 (Al-Tabarani)"
  },
  {
    id: 23,
    topicUrdu: "مشکلات اور سخت حاجتوں کا حل",
    topicEn: "Solution for Severe Hardships and Needs",
    arabic: "مَنْ عَسُرَتْ عَلَيْهِ حَاجَتُهُ فَلْيُكْثِرْ مِنَ الصَّلاَةِ عَلَيَّ فَإِنَّهَا تَكْشِفُ الْهُمُومَ وَالْغُمُومَ وَالْكُرُوبَ",
    urdu: "جس کی حاجت سخت و دشوار ہو جائے، اسے چاہیے کہ مجھ پر کثرت سے درود شریف پڑھے، کیونکہ یہ تمام غموں، پریشانیوں اور مصائب کو دور کر دیتا ہے۔",
    english: "Whosoever finds his need or hardship difficult, let him send abundant blessings upon me, for it removes grief, sorrow, and distress.",
    reference: "القول البدیع للسخاوی: 225 (Al-Qawl Al-Badi)"
  },
  {
    id: 24,
    topicUrdu: "درود پڑھنے والے کے لیے فرشتہ کی تخلیق",
    topicEn: "Creation of an Angel Seeking Forgiveness",
    arabic: "مَنْ صَلَّى عَلَيَّ مَرَّةً خَلَقَ اللَّهُ تَعَالَى مِنْ كَلاَمِهِ مَلَكًا يَبْسُطُ جَنَاحَيْهِ فِي الْمَشْرِقِ وَالْمَغْرِبِ يَسْتَغْفِرُ لَهُ",
    urdu: "جو شخص ایک بار درود پڑھتا ہے، اللہ تعالیٰ اس کے الفاظ سے ایک فرشتہ پیدا فرماتا ہے جو مشرق و مغرب میں پر پھیلا کر اس کے لیے استغفار کرتا ہے۔",
    english: "Whoever recites Durood once, Allah creates an angel from his words who spreads its wings across East and West, seeking forgiveness for him.",
    reference: "نزہۃ المجالس: ج1 ص210 (Nuzhat Al-Majalis)"
  },
  {
    id: 25,
    topicUrdu: "اعمال کی پاکیزگی اور کفارۂ سیئات",
    topicEn: "Purification of Deeds and Expiation of Sins",
    arabic: "أَكْثِرُوا مِنَ الصَّلاَةِ عَلَيَّ فَإِنَّ الصَّلاَةَ عَلَيَّ كَفَّارَةٌ لِّذُنُوبِكُمْ وَزَكَاةٌ لِّأَعْمَالِكُمْ",
    urdu: "مجھ پر کثرت سے درود پڑھا کرو، کیونکہ مجھ پر درود پڑھنا تمہارے گناہوں کا کفارہ اور تمہارے اعمال کی پاکیزگی و ترقی کا سبب ہے۔",
    english: "Send abundant blessings upon me, for sending blessings upon me is an expiation for your sins and a purification for your deeds.",
    reference: "جامع الاحادیث للسیوطی: 3812 (Jami Al-Ahadith)"
  }
];

export const SPECIAL_READABLE_DUROODS: DuroodReaderItem[] = [
  {
    id: 'durood_mohabat',
    titleUrdu: 'درودِ محبت (Durood-e-Mohabbat)',
    titleEnglish: 'Durood-e-Mohabbat (Blessing of Divine Love)',
    category: 'عشق و محبتِ مصطفیٰ ﷺ',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ حَبِيبِ اللَّهِ وَحَبِيبِ الْقُلُوبِ وَمُنَوِّرِ الصُّدُورِ وَعَافِيَةِ الأَبْدَانِ وَشِفَائِهَا',
    urdu: 'اے اللہ! ہمارے آقا حضرت محمد صلی اللہ علیہ وسلم اور ان کی آلِ پاک پر رحمت نازل فرما، جو اللہ کے محبوب، دلوں کی قرار و محبت، سینوں کو منور کرنے والے اور بدن کی کامل عافیت و شفاء ہیں۔',
    english: 'O Allah! Send blessings upon our Master Muhammad and his noble family, the beloved of Allah, the solace of hearts, the illuminator of chests, and the health and healing of bodies.',
    virtueUrdu: 'دل میں عشقِ رسول ﷺ، روحانی نورانیت، قلبی سکون اور باطنی و ظاہری بیماریوں سے شفاء کے لیے کثرت سے پڑھا جاتا ہے۔',
    virtueEnglish: 'Recited for cultivating deep love for Prophet Muhammad (ﷺ), spiritual illumination, and bodily healing.'
  },
  {
    id: 'durood_karam',
    titleUrdu: 'درودِ کرم (Durood-e-Karam)',
    titleEnglish: 'Durood-e-Karam (Blessing of Divine Grace & Bounties)',
    category: 'فضل و کرم اور برکت',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ جُودِكَ وَكَرَمِكَ وَمَعْدِنِ الْفَضْلِ وَالإِحْسَانِ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ',
    urdu: 'اے اللہ! ہمارے آقا حضرت محمد صلی اللہ علیہ وسلم پر جن کی ذات تیرے جود و کرم اور فضل و احسان کی کان ہے، اور ان کی آل و صحابہ پر درود، سلام اور برکتیں نازل فرما۔',
    english: 'O Allah! Send blessings, peace, and abundance upon our Master Muhammad, the essence of Your generosity, grace, and benevolence, and upon his family and companions.',
    virtueUrdu: 'رزق میں برکت، رب کے کرم و فضل کے حصول، اور کاروبار و گھر میں خوشحالی کے لیے مجرب ہے۔',
    virtueEnglish: 'Renowned for invoking divine grace, abundance in sustenance, and blessings in family and livelihood.'
  },
  {
    id: 'durood_nariyah',
    titleUrdu: 'درودِ ناریہ (Durood-e-Naariyah / صلوۃ التافریجیۃ)',
    titleEnglish: 'Durood-e-Naariyah (Salat al-Tafrijiyyah - Relief from Hardships)',
    category: 'قضاءِ حوائج و حلِ مشکلات',
    arabic: 'اللَّهُمَّ صَلِّ صَلاَةً كَامِلَةً وَسَلِّمْ سَلاَمًا تَامًّا عَلَى سَيِّدِنَا مُحَمَّدٍ الَّذِي تَنْحَلُّ بِهِ الْعُقَدُ وَتَنْفَرِجُ بِهِ الْكُرَبُ وَتُقْضَى بِهِ الْحَوَائِجُ وَتُنَالُ بِهِ الرَّغَائِبُ وَحُسْنُ الْخَوَاتِيمِ وَيُسْتَسْقَى الْغَمَامُ بِوَجْهِهِ الْكَرِيمِ وَعَلَى آلِهِ وَصَحْبِهِ فِي كُلِّ لَمْحَةٍ وَنَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ',
    urdu: 'اے اللہ! ہمارے آقا حضرت محمد صلی اللہ علیہ وسلم پر کامل درود اور مکمل سلام نازل فرما، جن کے وسیلے سے مشکل گرہیں کھلتی ہیں، مصائب و تکالیف دور ہوتی ہیں، تمام حاجتیں پوری ہوتی ہیں، دلی تمنائیاں اور حسنِ خاتمہ حاصل ہوتا ہے اور ان کے رخِ انور کے طفیل رحمت کے بادلوں سے بارش طلب کی جاتی ہے۔',
    english: 'O Allah! Send complete blessings and perfect peace upon our Master Muhammad, through whom knots are untied, distresses are relieved, needs are fulfilled, desires and noble endings are attained, and rain is sought by his radiant face.',
    virtueUrdu: 'بڑی سے بڑی مشکل، مصیبت کی گھڑی، بیماری اور ناگہانی آفت کے فوراً ٹلنے اور غائب سے مدد ملنے کے لیے انتہائی طاقتور درود شریف ہے۔',
    virtueEnglish: 'Highly powerful recitation for immediate relief from severe trials, fulfillment of noble wishes, and spiritual breakthroughs.'
  },
  {
    id: 'durood_ibrahimi',
    titleUrdu: 'درودِ ابراہیمی (Durood-e-Ibrahimi)',
    titleEnglish: 'Durood-e-Ibrahimi (The Prayer Recited in Salah)',
    category: 'افضل ترین مسنون درود',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    urdu: 'اے اللہ! رحمت نازل فرما حضرت محمد صلی اللہ علیہ وسلم اور ان کی آل پر جیسے تو نے رحمت نازل فرمائی حضرت ابراہیم علیہ السلام اور ان کی آل پر، بے شک تو تعریف کیا ہوا بزرگ ہے۔ اے اللہ! برکت نازل فرما حضرت محمد صلی اللہ علیہ وسلم اور ان کی آل پر جیسے تو نے برکت نازل فرمائی حضرت ابراہیم علیہ السلام اور ان کی آل پر، بے شک تو تعریف کیا ہوا بزرگ ہے۔',
    english: 'O Allah, send peace upon Muhammad and the family of Muhammad, as You sent peace upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.',
    virtueUrdu: 'تمام درودوں کا سردار اور نماز میں پڑھا جانے والا سب سے افضل و مسنون درود شریف۔',
    virtueEnglish: 'The king of all salutations, recited in daily obligatory prayers with supreme reward.'
  },
  {
    id: 'durood_taj',
    titleUrdu: 'درودِ تاج (Durood-e-Taj)',
    titleEnglish: 'Durood-e-Taj (Crown of Blessings)',
    category: 'دفعِ بلیات و دائرۂ تحفظ',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا وَمَوْلاَنَا مُحَمَّدٍ صَاحِبِ التَّاجِ وَالْمِعْرَاجِ وَالْبُرَاقِ وَالْعَلَمِ ، دَافِعِ الْبَلاَءِ وَالْوَبَاءِ وَالْقَحْطِ وَالْمَرَضِ وَالأَلَمِ',
    urdu: 'اے اللہ! ہمارے آقا و مولا حضرت محمد صلی اللہ علیہ وسلم پر درود بھیج جو تاج، معراج، براق اور علم کے صاحب ہیں، اور جو بلاؤں، وبائی امراض، قحط، بیماریوں اور دکھ درد کو دور فرمانے والے ہیں۔',
    english: 'O Allah! Send blessings upon our Master Muhammad, owner of the Crown, the Ascension, the Buraq, and the Banner, who removes tribulations, epidemics, drought, sickness, and pain.',
    virtueUrdu: 'شیطانی وسوسوں، وبائی بیماریوں، دشمنوں کے شر سے حفاظت اور خواب میں زیارتِ نبوی ﷺ کے لیے کثرت سے پڑھا جاتا ہے۔',
    virtueEnglish: 'Recited for protection against evil, diseases, tribulations, and attaining the blessed vision of the Holy Prophet (ﷺ).'
  },
  {
    id: 'durood_tunajjina',
    titleUrdu: 'درودِ تنجینا (Durood-e-Tunajjina)',
    titleEnglish: 'Durood-e-Tunajjina (Prayer of Salvation)',
    category: 'نجات و سلامتی',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلاَةً تُنَجِّينَا بِهَا مِنْ جَمِيعِ الأَهْوَالِ وَالآفَاتِ وَتَقْضِي لَنَا بِهَا جَمِيعَ الْحَاجَاتِ وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ',
    urdu: 'اے اللہ! ہمارے آقا حضرت محمد صلی اللہ علیہ وسلم پر ایسا درود نازل فرما جس کے ذریعے تو ہمیں تمام ہولناکیوں اور آفتوں سے نجات عطا فرما، ہماری تمام حاجتیں پوری فرما اور ہمیں تمام برائیوں سے پاک صاف فرما۔',
    english: 'O Allah! Send blessings upon our Master Muhammad, such blessings through which You deliver us from all terrors and calamities, fulfill all our needs, and cleanse us from all evil.',
    virtueUrdu: 'طوفان، حادثات، خوف و ہراس اور اچانک آفتوں سے فوری نجات و امن کا مجرب درود شریف۔',
    virtueEnglish: 'Famous for emergency relief from storms, dangers, panic, and securing divine protection.'
  },
  {
    id: 'durood_shifa',
    titleUrdu: 'درودِ شفاء (Durood-e-Shifa - الطب القلوب)',
    titleEnglish: 'Durood-e-Shifa (Blessing of Heart & Physical Healing)',
    category: 'شفائے امراض و صحت',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوبِ وَدَوَائِهَا وَعَافِيَةِ الأَبْدَانِ وَشِفَائِهَا وَنُورِ الأَبْصَارِ وَضِيَائِهَا وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ',
    urdu: 'اے اللہ! ہمارے آقا حضرت محمد صلی اللہ علیہ وسلم پر درود نازل فرما جو دلوں کے طبیب اور ان کی دوا ہیں، جسموں کی عافیت اور ان کی شفاء ہیں، اور آنکھوں کا نور اور ان کی روشنی ہیں، اور ان کی آل اور صحابہ پر بھی سلام نازل فرما۔',
    english: 'O Allah! Send blessings upon our Master Muhammad, the medicine of hearts and their cure, the health of bodies and their healing, and the light of eyes and their brightness.',
    virtueUrdu: 'جسمانی، قلبی اور بصری امراض کی شفایابی کے لیے پانی پر دم کر کے پینا اور پڑھنا بے حد مفید ہے۔',
    virtueEnglish: 'Highly effective for physical, cardiac, and spiritual ailments and restoring vitality.'
  }
];

export default function DuroodHadithsModal({
  lang,
  isOpen,
  onClose,
  onQuickSubmitDurood
}: DuroodHadithsModalProps) {
  const isUrdu = lang === 'ur';

  // Active Tab inside modal: 'hadiths' vs 'reader'
  const [modalTab, setModalTab] = useState<'hadiths' | 'reader'>('hadiths');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Tasbeeh Counter inside Reader
  const [counters, setCounters] = useState<{ [key: string]: number }>({});
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  if (!isOpen) return null;

  // Filter Hadiths
  const filteredHadiths = HADITH_COLLECTION.filter((h) => {
    const q = searchQuery.toLowerCase();
    return (
      h.topicUrdu.toLowerCase().includes(q) ||
      h.topicEn.toLowerCase().includes(q) ||
      h.urdu.toLowerCase().includes(q) ||
      h.english.toLowerCase().includes(q) ||
      h.arabic.includes(q) ||
      h.reference.toLowerCase().includes(q)
    );
  });

  // Increment Local Counter
  const handleIncrement = (duroodId: string) => {
    setCounters((prev) => ({
      ...prev,
      [duroodId]: (prev[duroodId] || 0) + 1
    }));
  };

  // Reset Local Counter
  const handleResetCounter = (duroodId: string) => {
    setCounters((prev) => ({
      ...prev,
      [duroodId]: 0
    }));
  };

  // Copy text to clipboard
  const handleCopy = (text: string, id: string | number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* TOP HEADER BANNER */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-5 sm:p-6 relative">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase block font-mono">
                  {isUrdu ? 'حسنی درود لائیو ریڈر و فضائل' : 'HASNAIN FOUNDATION DUROOD READER'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-urdu">
                  {isUrdu ? 'فضائلِ درود شریف و ۲۵ مستند احادیثِ مبارکہ' : 'Virtues of Durood & 25 Authentic Hadiths'}
                </h2>
                <p className="text-xs text-emerald-200 mt-1 font-urdu">
                  {isUrdu 
                    ? 'عربی، اردو اور انگریزی ترجمہ مع مبارک درود پاک تلاوت کاؤنٹر' 
                    : 'Arabic, Urdu & English text with live Durood recitation counters'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* INNER NAVIGATION TOGGLE BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-emerald-700/60">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalTab('hadiths')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'hadiths'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                    : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-700/60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isUrdu ? '۲۵ احادیثِ مبارکہ (فضائل درود)' : '25 Hadiths on Virtues'}</span>
              </button>

              <button
                onClick={() => setModalTab('reader')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'reader'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                    : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-700/60'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{isUrdu ? 'مبارک درود پاک پڑھیں (درودِ محبت، کرم، ناریہ)' : 'Read Special Duroods'}</span>
              </button>
            </div>

            {/* Quick Search */}
            {modalTab === 'hadiths' && (
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isUrdu ? 'حدیث یا موضوع تلاش کریں...' : 'Search Hadith or topic...'}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-white placeholder-emerald-400/70 text-xs focus:outline-none focus:border-amber-400"
                />
                <Search className="w-4 h-4 text-emerald-400 absolute left-2.5 top-2" />
              </div>
            )}
          </div>
        </div>

        {/* BODY CONTENT AREA */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          
          {/* TAB 1: 25 HADITHS COLLECTION */}
          {modalTab === 'hadiths' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                <span className="text-xs font-bold text-emerald-900 font-urdu">
                  {isUrdu 
                    ? `کل احادیثِ مبارکہ: ۲۵ | نمائش: ${filteredHadiths.length}`
                    : `Total Hadiths: 25 | Displaying: ${filteredHadiths.length}`}
                </span>
                <span className="text-[11px] text-emerald-700 font-mono">
                  {isUrdu ? 'مستند کتبِ احادیث (صحاحِ ستہ)' : 'Authentic Sources'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHadiths.map((h) => (
                  <div
                    key={h.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between relative group"
                  >
                    <div>
                      {/* Top Header Row */}
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black font-urdu">
                          {isUrdu ? h.topicUrdu : h.topicEn}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                          #{h.id}
                        </span>
                      </div>

                      {/* Arabic Hadith */}
                      <div className="my-3 text-right">
                        <p className="text-lg sm:text-xl font-bold text-emerald-950 font-serif leading-loose tracking-wide dir-rtl bg-amber-50/40 p-3 rounded-xl border border-amber-200/50">
                          «{h.arabic}»
                        </p>
                      </div>

                      {/* Urdu Translation */}
                      <p className="text-sm font-semibold text-slate-800 font-urdu leading-relaxed text-right dir-rtl mb-2">
                        {h.urdu}
                      </p>

                      {/* English Translation */}
                      <p className="text-xs text-slate-600 font-sans leading-normal mb-3">
                        {h.english}
                      </p>
                    </div>

                    {/* Footer Reference & Actions */}
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-800 font-mono text-[11px]">
                        📖 {h.reference}
                      </span>

                      <button
                        onClick={() =>
                          handleCopy(
                            `«${h.arabic}»\n\nاردو: ${h.urdu}\nEnglish: ${h.english}\n[${h.reference}] - Hasnain Foundation Durood Bank`,
                            h.id
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-bold transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                      >
                        {copiedId === h.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{isUrdu ? 'کاپی ہو گیا' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isUrdu ? 'حدیث کاپی کریں' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {filteredHadiths.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 font-urdu bg-white rounded-2xl border border-slate-200">
                    کوئی حدیثِ مبارکہ نہیں ملی۔ براہ کرم تلاش کے الفاظ تبدیل کریں۔
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SPECIAL READABLE DUROODS (Durood-e-Mohabbat, Durood-e-Karam, Durood-e-Naariyah, etc.) */}
          {modalTab === 'reader' && (
            <div className="space-y-6">
              
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold shrink-0">
                  📿
                </div>
                <div>
                  <h4 className="font-black text-amber-950 text-sm font-urdu">
                    {isUrdu ? 'درود پاک پڑھیں اور براہِ راست کاؤنٹر میں شامل کریں' : 'Read Durood & Add to Durood Bank Counter'}
                  </h4>
                  <p className="text-xs text-amber-800 font-urdu mt-0.5">
                    ذیل میں درودِ محبت، درودِ کرم، درودِ ناریہ اور دیگر مبارک درود پاک بمع ترجمہ و فضائل موجود ہیں۔ آپ یہاں پڑھ کر فوری جمع کر سکتے ہیں۔
                  </p>
                </div>
              </div>

              {/* READABLE CARDS LOOP */}
              <div className="space-y-6">
                {SPECIAL_READABLE_DUROODS.map((d) => {
                  const currentCount = counters[d.id] || 0;

                  return (
                    <div
                      key={d.id}
                      className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm hover:border-emerald-600 transition-all relative overflow-hidden"
                    >
                      {/* Top Label Banner */}
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 font-urdu">
                            {isUrdu ? d.titleUrdu : d.titleEnglish}
                          </h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black font-urdu">
                          {d.category}
                        </span>
                      </div>

                      {/* Large Arabic Box */}
                      <div className="bg-gradient-to-br from-amber-50/60 via-emerald-50/30 to-amber-50/40 border border-amber-300/80 rounded-2xl p-5 sm:p-7 text-center my-4 shadow-inner">
                        <p className="text-2xl sm:text-3xl font-bold text-emerald-950 font-serif leading-loose tracking-wide dir-rtl">
                          «{d.arabic}»
                        </p>
                      </div>

                      {/* Urdu Translation */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 my-3">
                        <span className="block text-[11px] font-black text-emerald-800 font-urdu uppercase tracking-wider mb-1">
                          {isUrdu ? 'اردو ترجمہ:' : 'Urdu Translation:'}
                        </span>
                        <p className="text-sm font-bold text-slate-800 font-urdu leading-relaxed dir-rtl text-right">
                          {d.urdu}
                        </p>
                      </div>

                      {/* English Translation */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 my-3">
                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                          English Translation:
                        </span>
                        <p className="text-xs text-slate-700 leading-normal">
                          {d.english}
                        </p>
                      </div>

                      {/* Virtue & Significance */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 my-4 flex items-start gap-2.5">
                        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-xs font-black font-urdu">
                            {isUrdu ? 'فضیلت و روحانی برکات:' : 'Virtue & Spiritual Significance:'}
                          </strong>
                          <p className="text-xs font-urdu text-emerald-900 mt-0.5 leading-relaxed">
                            {isUrdu ? d.virtueUrdu : d.virtueEnglish}
                          </p>
                        </div>
                      </div>

                      {/* INTERACTIVE RECITATION TASBEEH COUNTER BAR */}
                      <div className="bg-slate-900 text-white p-4 rounded-2xl mt-4 flex flex-wrap items-center justify-between gap-4">
                        
                        {/* Live Counter Display */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-amber-400 font-urdu uppercase">
                            {isUrdu ? 'آپ کی موجودہ تلاوت:' : 'Recited Count:'}
                          </span>
                          <span className="text-3xl font-black font-mono text-emerald-400 bg-slate-950 px-4 py-1 rounded-xl border border-slate-800">
                            {currentCount}
                          </span>
                          {currentCount > 0 && (
                            <button
                              onClick={() => handleResetCounter(d.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Reset counter"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Increment Buttons & Quick Submit */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleIncrement(d.id)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{isUrdu ? 'پڑھ لیا (+1)' : 'Recited (+1)'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setCounters((prev) => ({
                                ...prev,
                                [d.id]: (prev[d.id] || 0) + 10
                              }));
                            }}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
                          >
                            +10
                          </button>

                          {/* Submit to Durood Bank */}
                          {onQuickSubmitDurood && currentCount > 0 && (
                            <button
                              onClick={() => {
                                onQuickSubmitDurood(d.titleUrdu.split('(')[0].trim(), currentCount);
                                handleResetCounter(d.id);
                                onClose();
                              }}
                              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg animate-bounce"
                            >
                              <Award className="w-4 h-4 text-emerald-950" />
                              <span>{isUrdu ? 'بینک میں جمع کریں' : 'Submit to Durood Bank'}</span>
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* FOOTER BAR */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-urdu">
            {isUrdu 
              ? 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ - حسنین فاؤنڈیشن درود بینک' 
              : 'Hasnain Foundation - Official Durood Bank Collection'}
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer transition-colors"
          >
            {isUrdu ? 'بند کریں' : 'Close Modal'}
          </button>
        </div>

      </div>
    </div>
  );
}
