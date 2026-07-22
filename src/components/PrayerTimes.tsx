/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
  CITIES_LIST, 
  CityLocation, 
  getFullPrayerList, 
  PrayerTimeData, 
  playPrayerChime 
} from '../lib/prayerTimes';
import { 
  Clock, 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Calendar, 
  Compass, 
  BookOpen, 
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PrayerTimesProps {
  lang: Language;
  onOpenDonate?: () => void;
}

export default function PrayerTimes({ lang, onOpenDonate }: PrayerTimesProps) {
  const isUrdu = lang === 'ur';

  // Selected city state (Default: Karachi Jamia Masjid Abdul Qadir Jilani)
  const [selectedCity, setSelectedCity] = useState<CityLocation>(CITIES_LIST[0]);
  const [now, setNow] = useState<Date>(new Date());
  
  // Sound and Browser/In-App notification toggles
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState<boolean>(true);
  const [selectedPrayerDetail, setSelectedPrayerDetail] = useState<PrayerTimeData | null>(null);
  const [lastNotifiedPrayer, setLastNotifiedPrayer] = useState<string>('');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  
  // Space-saving toggle for general Quranic Verses & Hadith Warnings block
  const [showGeneralVerses, setShowGeneralVerses] = useState<boolean>(false);

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate prayer times data in selected city's timezone
  const { prayers, currentActivePrayerId, nextPrayer, timeRemainingStr } = getFullPrayerList(selectedCity, now);

  const activePrayerData = prayers.find(p => p.id === currentActivePrayerId) || prayers[0];

  // Auto-notify when current active prayer changes
  useEffect(() => {
    if (currentActivePrayerId && currentActivePrayerId !== lastNotifiedPrayer) {
      setLastNotifiedPrayer(currentActivePrayerId);
      
      const pObj = prayers.find(p => p.id === currentActivePrayerId);

      // Play soft chime if audio enabled
      if (isAudioEnabled) {
        playPrayerChime();
      }

      // Show in-app banner toast
      if (isNotificationEnabled && pObj) {
        const msg = isUrdu 
          ? `🕌 نمازِ ${pObj.nameUr} کا وقت ہو گیا ہے! جماعت: ${pObj.jamaatTimeFormatted}`
          : `🕌 It is time for ${pObj.nameEn} Salah! Jama'at: ${pObj.jamaatTimeFormatted}`;
        setNotificationToast(msg);
        setTimeout(() => setNotificationToast(null), 8000);

        // Attempt desktop notification if browser allows
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(
              isUrdu ? `🕌 نمازِ ${pObj.nameUr} کا وقت ہو گیا ہے` : `🕌 It is time for ${pObj.nameEn} Prayer`,
              {
                body: isUrdu 
                  ? `جامع مسجد عبدالقادر جیلانی: ${pObj.nameUr} کا وقت جاری ہے۔ جماعت ${pObj.jamaatOffsetMinutes} منٹ بعد: ${pObj.jamaatTimeFormatted}`
                  : `Hanafi Salah Time: ${pObj.nameEn} active now. Jama'at at ${pObj.jamaatTimeFormatted} (${pObj.jamaatOffsetMinutes} mins after Adhan)`,
                icon: '/favicon.ico'
              }
            );
          } catch (e) {
            console.log('Desktop notification restricted');
          }
        }
      }
    }
  }, [currentActivePrayerId, lastNotifiedPrayer, isAudioEnabled, isNotificationEnabled, prayers, isUrdu]);

  // Request browser & in-app notifications
  const toggleNotifications = async () => {
    const nextState = !isNotificationEnabled;
    setIsNotificationEnabled(nextState);

    if (nextState) {
      if (isAudioEnabled) playPrayerChime();
      setNotificationToast(isUrdu ? 'نماز کی الرٹس اور نوٹیفکیشن آن کر دیے گئے ہیں!' : 'Prayer time alerts & notifications activated!');
      setTimeout(() => setNotificationToast(null), 4000);

      // Attempt browser notification permission safely
      if ('Notification' in window) {
        try {
          if (Notification.permission === 'default') {
            await Notification.requestPermission();
          }
        } catch (err) {
          console.log('Browser notification request skipped');
        }
      }
    } else {
      setNotificationToast(isUrdu ? 'الرٹس اور نوٹیفکیشنز بند کر دیے گئے ہیں' : 'Notifications muted');
      setTimeout(() => setNotificationToast(null), 3000);
    }
  };

  // Format current live city date and clock in city timezone
  const cityTimeMs = now.getTime() + selectedCity.timezone * 3600 * 1000;
  const cityDateObj = new Date(cityTimeMs);

  const formattedGregorianDate = cityDateObj.toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedLiveClock = cityDateObj.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <section id="prayer-times-section" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      
      {/* Background Islamic Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating In-App Toast Notification */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs sm:text-sm shadow-2xl border border-emerald-400 flex items-center gap-3"
          >
            <Bell className="w-5 h-5 text-amber-300 animate-bounce shrink-0" />
            <span>{notificationToast}</span>
            <button 
              onClick={() => setNotificationToast(null)}
              className="ml-2 hover:opacity-80 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* HEADER BLOCK: Title, City Selector, Clock & Sound Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          
          {/* Title & Subtitle */}
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-400 text-xs font-mono font-bold mb-3 ${isUrdu ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{isUrdu ? 'فقہ حنفی بریلوی - جامع مسجد عبدالقادر جیلانی' : 'Hanafi Barelvi Fiqh • Jamia Masjid Abdul Qadir Jilani'}</span>
            </div>
            
            <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight text-white ${isUrdu ? 'font-urdu text-right leading-relaxed' : 'font-sans'}`}>
              {isUrdu ? 'اوقاتِ نماز و باجماعت شیڈول' : 'Daily Salah Prayer Timings & Jama\'at Schedule'}
            </h2>
            
            <p className={`text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl ${isUrdu ? 'font-urdu text-right leading-loose' : 'font-sans'}`}>
              {isUrdu 
                ? 'فجر، ظہر، عصر (حنفی)، مغرب اور عشاء کی درست ترین فلکیاتی اوقات۔ جیسے ہی نماز کا وقت ہوگا، متعلقہ بٹن کا رنگ خودکار تبدیل ہو جائے گا۔'
                : 'Accurate astronomical prayer times calculated strictly according to Hanafi jurisprudence. The active prayer button dynamically highlights when prayer time arrives.'}
            </p>
          </div>

          {/* Right Controls: City Picker & Notification Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            {/* City Picker Dropdown */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-200">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={selectedCity.nameEn}
                onChange={(e) => {
                  const city = CITIES_LIST.find(c => c.nameEn === e.target.value);
                  if (city) setSelectedCity(city);
                }}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                {CITIES_LIST.map((city) => (
                  <option key={city.nameEn} value={city.nameEn} className="bg-slate-900 text-white">
                    {isUrdu ? city.nameUr : city.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Audio Toggle Button */}
            <button
              onClick={() => {
                const nextState = !isAudioEnabled;
                setIsAudioEnabled(nextState);
                if (nextState) playPrayerChime();
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                isAudioEnabled 
                  ? 'bg-emerald-900/60 border-emerald-600/80 text-emerald-300 hover:bg-emerald-800/60' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isUrdu ? 'اذان ساؤنڈ الرٹ' : 'Toggle Azan Sound Chime'}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isUrdu ? (isAudioEnabled ? 'آواز آن' : 'آواز بند') : (isAudioEnabled ? 'Sound On' : 'Muted')}</span>
            </button>

            {/* Notification Toggle Button */}
            <button
              onClick={toggleNotifications}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                isNotificationEnabled 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isUrdu ? 'نماز الرٹ و نوٹیفکیشن' : 'Toggle Prayer Alerts'}
            >
              {isNotificationEnabled ? <Bell className="w-4 h-4 text-slate-950 animate-bounce" /> : <BellOff className="w-4 h-4" />}
              <span>{isUrdu ? (isNotificationEnabled ? 'نوٹیفکیشن فعال ✓' : 'الرٹ آن کریں') : (isNotificationEnabled ? 'Alerts Active ✓' : 'Enable Alerts')}</span>
            </button>

          </div>

        </div>

        {/* LIVE ACTIVE PRAYER NOTIFICATION BANNER */}
        <div className="mt-6 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-500/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className={`flex items-center gap-3.5 ${isUrdu ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-ping" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-extrabold uppercase bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700">
                    {isUrdu ? 'جاری نماز کا وقت' : 'ACTIVE PRAYER NOW'}
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    {formattedLiveClock} ({selectedCity.nameEn.split(' ')[0]})
                  </span>
                </div>

                <h3 className={`text-base sm:text-lg font-black text-white mt-0.5 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? `اب نمازِ ${activePrayerData.nameUr} کا وقت ہو چکا ہے۔` : `It is currently time for ${activePrayerData.nameEn} Salah.`}
                </h3>

                <p className={`text-xs text-slate-300 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu 
                    ? `اذان: ${activePrayerData.azanTimeFormatted} | باجماعت نماز (${activePrayerData.jamaatOffsetMinutes} منٹ بعد): ${activePrayerData.jamaatTimeFormatted}`
                    : `Azan: ${activePrayerData.azanTimeFormatted} | Jama'at Congregation (${activePrayerData.jamaatOffsetMinutes}m after Adhan): ${activePrayerData.jamaatTimeFormatted}`}
                </p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-center min-w-[200px] w-full md:w-auto">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                {isUrdu ? `اگلی نماز (${nextPrayer.nameUr}) میں باقی وقت:` : `Next Prayer (${nextPrayer.nameEn}) in:`}
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-amber-400 tracking-wider">
                {timeRemainingStr}
              </span>
            </div>

          </div>
        </div>

        {/* 5 PRAYER BUTTONS GRID (Fajr, Dhuhr, Asr, Maghrib, Isha) */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className={`text-sm font-extrabold uppercase tracking-wider text-slate-300 ${isUrdu ? 'font-urdu text-right' : 'font-sans'}`}>
                {isUrdu ? 'پنجگانہ نماز کے اوقا ت' : '5 Daily Prayer Timings'}
              </h3>
              <p className={`text-xs text-amber-300 font-bold mt-0.5 flex items-center gap-1 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                <span>✨ {isUrdu ? 'کسی بھی نماز پر کلک کریں: متعلقہ قرآنی آیات، احادیث، اور رکعات کی تفصیلات دیکھنے کے لیے 👆' : 'Tap any prayer card below to view Quranic Verses, Ahadith & Rakats 👆'}</span>
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedGregorianDate}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {prayers.map((prayer) => {
              const isActive = prayer.id === currentActivePrayerId;

              return (
                <motion.button
                  key={prayer.id}
                  onClick={() => setSelectedPrayerDetail(prayer)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between min-h-[170px] ${
                    isActive
                      ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white border-emerald-400/80 shadow-2xl shadow-emerald-950/80 ring-4 ring-emerald-500/40 z-10'
                      : 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:border-emerald-600/60 hover:bg-slate-800'
                  }`}
                  id={`prayer-btn-${prayer.id}`}
                >
                  {/* Decorative background glow for active prayer button */}
                  {isActive && (
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
                  )}

                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    {/* Active Badge or Regular ID */}
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                        <span>{isUrdu ? 'جاری نماز' : 'ACTIVE NOW'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        {prayer.arabicName}
                      </span>
                    )}

                    {/* Sunset/Sun icon */}
                    {prayer.id === 'fajr' || prayer.id === 'isha' ? (
                      <Moon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    ) : (
                      <Sun className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    )}
                  </div>

                  {/* Prayer Title */}
                  <div className="my-1.5">
                    <div className="flex items-baseline justify-between">
                      <h4 className={`text-lg sm:text-xl font-black tracking-tight ${isActive ? 'text-white' : 'text-white'} ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? prayer.nameUr : prayer.nameEn}
                      </h4>
                      <span className={`text-xs font-serif ${isActive ? 'text-amber-200' : 'text-slate-400'}`}>
                        {prayer.arabicName}
                      </span>
                    </div>

                    {/* Fiqh Hanafi Badge on Asr */}
                    {prayer.id === 'asr' && (
                      <span className={`text-[9px] font-mono font-bold block mt-0.5 ${isActive ? 'text-emerald-200' : 'text-emerald-400'}`}>
                        {isUrdu ? 'فقہ حنفی (مثلِ ثانی)' : 'Hanafi Jurisprudence'}
                      </span>
                    )}
                  </div>

                  {/* Timings Block */}
                  <div className={`p-2.5 rounded-xl border ${
                    isActive 
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-white' 
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                  }`}>
                    <div className="flex justify-between items-center text-xs font-mono font-extrabold">
                      <span className={isActive ? 'text-emerald-200' : 'text-slate-400'}>{isUrdu ? 'اذان:' : 'Azan:'}</span>
                      <span className={isActive ? 'text-amber-300 text-sm' : 'text-white'}>{prayer.azanTimeFormatted}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono font-extrabold mt-1 pt-1 border-t border-white/10">
                      <span className={isActive ? 'text-emerald-200' : 'text-emerald-400'}>{isUrdu ? `جماعت (${prayer.jamaatOffsetMinutes}m):` : `Jama'at (${prayer.jamaatOffsetMinutes}m):`}</span>
                      <span className={isActive ? 'text-white font-bold' : 'text-emerald-400'}>{prayer.jamaatTimeFormatted}</span>
                    </div>
                  </div>

                  {/* Tap prompt footer */}
                  <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center justify-between border-t border-slate-700/40 pt-1.5">
                    <span className="truncate">{isUrdu ? 'تفصیلات و آیات 📖' : 'View Quran & Hadith 📖'}</span>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                  </div>

                </motion.button>
              );
            })}
          </div>
        </div>

        {/* SPACE-SAVING COLLAPSIBLE QURANIC VERSES & HADITH SECTION */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <button
            onClick={() => setShowGeneralVerses(!showGeneralVerses)}
            className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-between gap-4 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-700/80 text-amber-400 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm sm:text-base font-extrabold text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'قرآن و سنت کی روشنی میں تمام احکام اور وعیدیں کا مطالعہ کریں' : 'Quran & Sunnah: Full General Commandments & Warnings on Prayer'}
                </h3>
                <p className={`text-xs text-slate-400 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'صفحہ مختصر رکھنے اور آسانی کے لیے (کلک کر کے کھولیں / بند کریں)' : 'Space-saving collapsible section (Tap to expand or collapse)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold shrink-0">
              <span className="hidden sm:inline">{showGeneralVerses ? (isUrdu ? 'چھپائیں' : 'Hide') : (isUrdu ? 'پڑھیں' : 'Expand')}</span>
              {showGeneralVerses ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 animate-bounce" />}
            </div>
          </button>

          <AnimatePresence>
            {showGeneralVerses && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* COLUMN 1: QURANIC VERSES ON OBLIGATION OF SALAH */}
                  <div className="bg-slate-800/60 border border-emerald-900/60 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-700/80">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-700/80 text-emerald-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`text-base font-bold text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                              {isUrdu ? 'فرضیتِ نماز کے قرآنی احکام' : 'Quranic Decrees on Prayer Obligation'}
                            </h4>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                              {isUrdu ? 'آیاتِ مبارکہ' : 'Ayat-uk-Karima'}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-serif text-amber-400 font-bold">القرآن الكريم</span>
                      </div>

                      <div className="space-y-4">
                        {/* Verse 1 */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                              سورة النساء - آية 103
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Surah An-Nisa (4:103)</span>
                          </div>
                          <p className="text-right text-lg sm:text-xl font-serif text-emerald-300 leading-loose mb-2 tracking-wide" dir="rtl">
                            "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا"
                          </p>
                          <p className={`text-xs sm:text-sm text-slate-200 ${isUrdu ? 'font-urdu text-right leading-relaxed' : 'font-sans'}`}>
                            {isUrdu 
                              ? 'ترجمہ: "بے شک نماز مسلمانوں پر مقررہ وقت کے اندر فرض کی گئی ہے۔"'
                              : 'Translation: "Indeed, prayer has been decreed upon the believers a decree of specified times."'
                            }
                          </p>
                        </div>

                        {/* Verse 2 */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                              سورة البقرة - آية 43
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Surah Al-Baqarah (2:43)</span>
                          </div>
                          <p className="text-right text-lg sm:text-xl font-serif text-emerald-300 leading-loose mb-2 tracking-wide" dir="rtl">
                            "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ"
                          </p>
                          <p className={`text-xs sm:text-sm text-slate-200 ${isUrdu ? 'font-urdu text-right leading-relaxed' : 'font-sans'}`}>
                            {isUrdu 
                              ? 'ترجمہ: "اور نماز قائم رکھو اور زکوٰۃ ادا کرو اور رکوع کرنے والوں کے ساتھ رکوع کرو۔"'
                              : 'Translation: "And establish prayer and give zakah and bow with those who bow [in worship]."'
                            }
                          </p>
                        </div>

                        {/* Verse 3 */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                              سورة العنكبوت - آية 45
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Surah Al-Ankabut (29:45)</span>
                          </div>
                          <p className="text-right text-lg sm:text-xl font-serif text-emerald-300 leading-loose mb-2 tracking-wide" dir="rtl">
                            "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ"
                          </p>
                          <p className={`text-xs sm:text-sm text-slate-200 ${isUrdu ? 'font-urdu text-right leading-relaxed' : 'font-sans'}`}>
                            {isUrdu 
                              ? 'ترجمہ: "بے شک نماز (انسان کو) بے حیائی اور برائی کی باتوں سے روکتی ہے۔"'
                              : 'Translation: "Indeed, prayer prohibits immorality and wrongdoing."'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2: HADITH WARNINGS FOR ABANDONING PRAYER */}
                  <div className="bg-slate-800/60 border border-rose-900/60 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-700/80">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-rose-950 border border-rose-800/80 text-rose-400">
                            <Info className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`text-base font-bold text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                              {isUrdu ? 'تارکینِ نماز (بے نمازی) کے لیے وعیدیں' : 'Warnings for Neglecting & Abandoning Prayer'}
                            </h4>
                            <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                              {isUrdu ? 'احادیثِ نبویہ ﷺ' : 'Ahadith Nabawiyyah'}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-serif text-rose-300 font-bold">الحديث الشريف</span>
                      </div>

                      <div className="space-y-4">
                        {/* Hadith 1 */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                              صحيح مسلم - 147
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Sahih Muslim (147)</span>
                          </div>
                          <p className="text-right text-lg sm:text-xl font-serif text-rose-200 leading-loose mb-2 tracking-wide" dir="rtl">
                            "بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلَاةِ"
                          </p>
                          <p className={`text-xs sm:text-sm text-slate-200 ${isUrdu ? 'font-urdu text-right leading-relaxed' : 'font-sans'}`}>
                            {isUrdu 
                              ? 'مفہوم: "بندے کے درمیان اور کفر و شرک کے درمیان (فاصلہ مٹانے والا عنصر) نماز کا چھوڑنا ہے۔"'
                              : 'Translation: "Between a person and polytheism and disbelief is the abandonment of prayer."'
                            }
                          </p>
                        </div>

                        {/* Hadith 2 */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                              جامع الترمذي - 2621
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Jami` at-Tirmidhi (2621)</span>
                          </div>
                          <p className="text-right text-lg sm:text-xl font-serif text-rose-200 leading-loose mb-2 tracking-wide" dir="rtl">
                            "الْعَهْدُ الَّذِي بَيْنَنَا وَبَيْنَهُمُ الصَّلَاةُ فَمَنْ تَرَكَهَا فَقَدْ كَفَرَ"
                          </p>
                          <p className={`text-xs sm:text-sm text-slate-200 ${isUrdu ? 'font-urdu text-right leading-relaxed' : 'font-sans'}`}>
                            {isUrdu 
                              ? 'مفہوم: "ہمارے اور ان (منافقین/غیر مسلموں) کے درمیان جو بنیادی عہدوپیمان ہے وہ نماز ہے، پس جس نے اسے چھوڑ دیا اس نے کفر کا کام کیا۔"'
                              : 'Translation: "The covenant that stands between us and them is prayer; whoever abandons it has committed an act of disbelief."'
                            }
                          </p>
                        </div>

                        {/* Hadith 3 */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                              مسند أحمد - 6576
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Musnad Ahmad (6576)</span>
                          </div>
                          <p className="text-right text-base sm:text-lg font-serif text-rose-200 leading-loose mb-2 tracking-wide" dir="rtl">
                            "مَنْ حَافَظَ عَلَيْهَا كَانَتْ لَهُ نُورًا وَبُرْهَانًا وَنَجَاةً يَوْمَ الْقِيَامَةِ، وَمَنْ لَمْ يُحَافِظْ عَلَيْهَا لَمْ يَكُنْ لَهُ نُورٌ وَلَا بُرْهَانٌ وَلَا نَجَاةٌ"
                          </p>
                          <p className={`text-xs sm:text-sm text-slate-200 ${isUrdu ? 'font-urdu text-right leading-relaxed' : 'font-sans'}`}>
                            {isUrdu 
                              ? 'مفہوم: "جس نے نماز کی پابندی کی وہ قیامت کے دن اس کے لیے نور، دلیل اور نجات کا ذریعہ ہوگی، اور جس نے نماز ضائع کر دی اس کے لیے نہ کوئی نور ہوگا اور نہ ہی نجات۔"'
                              : 'Translation: "Whoever preserves prayer, it will be light, proof, and salvation for him on Resurrection Day; whoever neglects it will have no light, proof, or salvation."'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PRAYER VIRTUE, QURANIC VERSE & HADITH DETAILS MODAL */}
        <AnimatePresence>
          {selectedPrayerDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
              onClick={() => setSelectedPrayerDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 text-white shadow-2xl relative"
              >
                {/* MODAL HEADER */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-700/80 text-emerald-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-lg sm:text-xl font-black text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? `نمازِ ${selectedPrayerDetail.nameUr} - قرآنی آیات و احادیث` : `${selectedPrayerDetail.nameEn} Prayer - Quran, Hadith & Details`}
                      </h3>
                      <span className="text-xs text-amber-400 font-serif font-bold">
                        {selectedPrayerDetail.arabicName} • Jamia Masjid Abdul Qadir Jilani
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPrayerDetail(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="py-4 space-y-4">

                  {/* TIMINGS & RAKATS SUMMARY */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] font-mono text-slate-400 block">{isUrdu ? 'وقتِ اذان' : 'Azan Time'}</span>
                      <span className="text-base font-mono font-black text-amber-400">{selectedPrayerDetail.azanTimeFormatted}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-center">
                      <span className="text-[10px] font-mono text-emerald-300 block">{isUrdu ? `باجماعت نماز (${selectedPrayerDetail.jamaatOffsetMinutes}m)` : `Jama'at (${selectedPrayerDetail.jamaatOffsetMinutes}m)`}</span>
                      <span className="text-base font-mono font-black text-emerald-400">{selectedPrayerDetail.jamaatTimeFormatted}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center col-span-1 sm:col-span-1">
                      <span className="text-[10px] font-mono text-slate-400 block">{isUrdu ? 'کل رکعات' : 'Rakats'}</span>
                      <span className="text-xs font-bold text-amber-300">{isUrdu ? selectedPrayerDetail.rakatsInfoUr : selectedPrayerDetail.rakatsInfoEn}</span>
                    </div>
                  </div>

                  {/* SPECIFIC QURANIC VERSE FOR THIS PRAYER */}
                  {selectedPrayerDetail.quranArabic && (
                    <div className="p-4 rounded-2xl bg-slate-800/90 border border-emerald-600/40 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{isUrdu ? 'متعلقہ قرآنی آیت' : 'Quranic Verse'}</span>
                        </span>
                        <span className="text-[11px] font-mono text-amber-300 font-bold">
                          {selectedPrayerDetail.quranRef}
                        </span>
                      </div>
                      <p className="text-right text-lg sm:text-xl font-serif text-emerald-200 leading-loose mb-2 tracking-wide font-bold" dir="rtl">
                        "{selectedPrayerDetail.quranArabic}"
                      </p>
                      <p className={`text-xs sm:text-sm text-slate-200 leading-relaxed ${isUrdu ? 'font-urdu text-right' : 'font-sans'}`}>
                        {isUrdu ? selectedPrayerDetail.quranUr : selectedPrayerDetail.quranEn}
                      </p>
                    </div>
                  )}

                  {/* SPECIFIC HADITH FOR THIS PRAYER */}
                  {selectedPrayerDetail.hadithArabic && (
                    <div className="p-4 rounded-2xl bg-slate-800/90 border border-amber-600/40 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{isUrdu ? 'حدیثِ نبوی ﷺ و فضیلت' : 'Hadith & Virtue'}</span>
                        </span>
                        <span className="text-[11px] font-mono text-amber-300 font-bold">
                          {selectedPrayerDetail.hadithRef}
                        </span>
                      </div>
                      <p className="text-right text-base sm:text-lg font-serif text-amber-200 leading-loose mb-2 tracking-wide font-bold" dir="rtl">
                        "{selectedPrayerDetail.hadithArabic}"
                      </p>
                      <p className={`text-xs sm:text-sm text-slate-200 leading-relaxed ${isUrdu ? 'font-urdu text-right' : 'font-sans'}`}>
                        {isUrdu ? selectedPrayerDetail.hadithUr : selectedPrayerDetail.hadithEn}
                      </p>
                    </div>
                  )}

                  {/* GENERAL VIRTUE SUMMARY */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-extrabold block mb-1">
                      {isUrdu ? 'اہمیت و فضیلت' : 'Significance'}
                    </span>
                    <p className={`text-xs sm:text-sm text-slate-200 ${isUrdu ? 'font-urdu text-right leading-relaxed' : 'font-sans'}`}>
                      {isUrdu ? selectedPrayerDetail.virtueUr : selectedPrayerDetail.virtueEn}
                    </p>
                  </div>

                  {/* FIQHI GUIDANCE NOTE */}
                  <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className={isUrdu ? 'font-urdu text-right' : 'font-sans'}>
                      {isUrdu 
                        ? 'جامع مسجد عبدالقادر جیلانی سرجانی ٹاؤن کراچی میں تمام اوقات فقہ حنفی بریلوی مسلک کے مطابق ہیں۔ مغرب کی باجماعت نماز اذان کے 2 منٹ بعد اور باقی تمام نمازیں اذان کے 30 منٹ بعد قائم کی جاتی ہیں۔'
                        : 'Jamia Masjid Abdul Qadir Jilani, Karachi: Calculated under Hanafi Barelvi Fiqh. Maghrib Jama\'at is offered 2m after Adhan, others 30m after Adhan.'}
                    </p>
                  </div>

                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedPrayerDetail(null)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    {isUrdu ? 'ٹھیک ہے (بند کریں)' : 'Close'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM MOSQUE COMMUNITY SUPPORT BAR */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className={`flex items-center gap-3 ${isUrdu ? 'flex-row-reverse text-right' : 'flex-row'}`}>
            <Compass className="w-5 h-5 text-amber-400 shrink-0" />
            <p className={`text-xs text-slate-400 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
              {isUrdu 
                ? 'جامع مسجد عبدالقادر جیلانی میں پنکھے، آبپاشی و سولر پاور سسٹم کے تعاون کے لیے عطیات جمع کروائیں۔'
                : 'Support solar power, water filtration & mosque expansion at Jamia Masjid Abdul Qadir Jilani.'}
            </p>
          </div>

          {onOpenDonate && (
            <button
              onClick={onOpenDonate}
              className={`px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${isUrdu ? 'font-urdu' : 'font-sans'}`}
            >
              <span>{isUrdu ? 'مسجد فنڈ میں عطیہ دیں' : 'Donate to Mosque Fund'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
