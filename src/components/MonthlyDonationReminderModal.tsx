/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { X, Calendar, Bell, Check, Send, Sparkles, Heart, Clock, AlertCircle, ExternalLink, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MonthlyDonationReminderModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  defaultDonorName?: string;
  defaultMobile?: string;
  defaultEmail?: string;
  defaultAmount?: string;
  defaultPurpose?: string;
}

export default function MonthlyDonationReminderModal({
  lang,
  isOpen,
  onClose,
  defaultDonorName = '',
  defaultMobile = '',
  defaultEmail = '',
  defaultAmount = '1000',
  defaultPurpose = 'general'
}: MonthlyDonationReminderModalProps) {
  const isUrdu = lang === 'ur';

  const [donorName, setDonorName] = useState(defaultDonorName);
  const [mobile, setMobile] = useState(defaultMobile);
  const [email, setEmail] = useState(defaultEmail);
  const [amount, setAmount] = useState(defaultAmount || '1000');
  const [purpose, setPurpose] = useState(defaultPurpose || 'general');
  const [category, setCategory] = useState<'zakat' | 'fitrat' | 'sadaqat' | 'general'>('zakat');
  const [reminderChannel, setReminderChannel] = useState<'whatsapp' | 'email' | 'calendar'>('whatsapp');
  
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickAmounts = ['500', '1000', '2500', '5000', '10000'];

  const getPurposeLabel = (pur: string) => {
    switch (pur) {
      case 'general': return isUrdu ? 'عمومی عطیہ (جنرل فنڈ)' : 'General Donation / Zakat';
      case 'masjid': return isUrdu ? 'جامع مسجد تعمیراتی فنڈ' : 'Jamia Masjid Construction';
      case 'food': return isUrdu ? 'راشن و کھانا فنڈ' : 'Food Security Drive';
      case 'education': return isUrdu ? 'یتیم بچوں کا تعلیمی فنڈ' : 'Orphan Education';
      case 'water': return isUrdu ? 'آر او پلانٹ / صاف پانی فنڈ' : 'RO Water Plant';
      default: return pur;
    }
  };

  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !mobile) {
      setError(isUrdu ? 'براہ کرم اپنا نام اور موبائل نمبر درج کریں۔' : 'Please provide your name and mobile number.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/donations/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donorName,
          mobile,
          email,
          amount: Number(amount) || 1000,
          purpose,
          category,
          monthlyReminder: true
        })
      });

      const data = await res.json();
      if (data.success) {
        // Save locally for client memory
        const reminders = JSON.parse(localStorage.getItem('hf_monthly_reminders') || '[]');
        reminders.push({
          donorName,
          mobile,
          amount,
          purpose,
          createdAt: new Date().toISOString(),
          nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
        localStorage.setItem('hf_monthly_reminders', JSON.stringify(reminders));
        
        setSaved(true);
      } else {
        setError(data.error || (isUrdu ? 'یاد دہانی محفوظ کرنے میں ناکامی ہوئی۔' : 'Failed to save reminder preference.'));
      }
    } catch (err: any) {
      setError(isUrdu ? 'نیٹ ورک کا مسئلہ ہے۔ دوبارہ کوشش کریں۔' : 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate Google Calendar Link for 1-month reminder
  const getGoogleCalendarUrl = () => {
    const today = new Date();
    const nextMonth = new Date(today.setDate(today.getDate() + 30));
    const startTime = nextMonth.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const title = encodeURIComponent(`Hasnain Foundation - Monthly Donation Reminder (PKR ${amount})`);
    const details = encodeURIComponent(
      `Assalam-o-Alaikum ${donorName},\n\nThis is your 1-month reminder to renew your monthly donation of PKR ${amount} for ${getPurposeLabel(purpose)} with the Hasnain Foundation Trust.\n\nDonate online or verify details: https://hasnain-foundation.com\nContact: +92 318 0202424 / +92 315 2204134`
    );
    const location = encodeURIComponent(`Hasnain Foundation, Karachi, Pakistan`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${startTime}&details=${details}&location=${location}&recur=RRULE:FREQ=MONTHLY`;
  };

  // Download .ics Calendar File
  const downloadIcsFile = () => {
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const dateStr = nextMonth.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15) + "Z";

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hasnain Foundation//Monthly Donation Reminder//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:hf-rem-${Date.now()}@hasnainfoundation.org`,
      `DTSTAMP:${dateStr}`,
      `DTSTART:${dateStr}`,
      `DTEND:${dateStr}`,
      `SUMMARY:Hasnain Foundation - Monthly Donation Due (PKR ${amount})`,
      `DESCRIPTION:Monthly Sadaqah / Donation reminder for ${donorName || 'Donor'} - PKR ${amount} for ${getPurposeLabel(purpose)}. May Allah reward you!`,
      "LOCATION:Hasnain Foundation Trust, Karachi",
      "RRULE:FREQ=MONTHLY;INTERVAL=1",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Hasnain_Foundation_Monthly_Donation_Reminder.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger Direct WhatsApp Registration
  const triggerWhatsAppSubscription = () => {
    const msg = isUrdu
      ? `السلام علیکم حسنین فاؤنڈیشن!\nمیں نے ماہانہ عطیہ کی یاد دہانی فعال کی ہے۔\n*نام:* ${donorName || 'عطیہ دہندہ'}\n*موبائل:* ${mobile || '03xx-xxxxxxx'}\n*ماہانہ رقم:* PKR ${amount}\n*مخصوص فنڈ:* ${getPurposeLabel(purpose)}\nبرائے مہربانی مجھے ہر ماہ واٹس ایپ پر یاد دہانی بھیج دیا کریں۔ جزاک اللہ!`
      : `Assalam-o-Alaikum Hasnain Foundation!\nI would like to register for a monthly donation reminder.\n*Name:* ${donorName || 'Donor'}\n*Mobile:* ${mobile || '03xx-xxxxxxx'}\n*Monthly Amount:* PKR ${amount}\n*Cause:* ${getPurposeLabel(purpose)}\nPlease send me a friendly WhatsApp reminder every month when my donation is due. JazakAllah!`;

    window.open(`https://wa.me/923180202424?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-bold shadow-md">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 font-mono">
                  {isUrdu ? 'ماہانہ باقاعدہ عطیہ سروس' : 'MONTHLY DONATION REMINDER'}
                </span>
                <h3 className={`text-xl sm:text-2xl font-black text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'ماہانہ عطیہ کی یاد دہانی' : 'Set Monthly Donation Reminder'}
                </h3>
              </div>
            </div>

            <p className={`text-xs text-emerald-100 mt-2 leading-relaxed ${isUrdu ? 'font-urdu leading-loose text-sm' : 'font-sans'}`}>
              {isUrdu
                ? 'عطیہ کرنے کے ۱ ماہ بعد آپ کو اور حسنین فاؤنڈیشن کو یاد دہانی موصول ہو گی تاکہ صدقہ و زکوۃ کا یہ نیک سلسلہ باقاعدگی سے جاری رہے۔'
                : 'Receive a polite reminder 1 month after your donation. This way, your continuous charity (Sadaqah Jariyah) stays active, and we also remember you in our prayers.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {!saved ? (
              <form onSubmit={handleSaveReminder} className="space-y-4">
                {error && (
                  <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                    <span className={isUrdu ? 'font-urdu text-right block' : ''}>{error}</span>
                  </div>
                )}

                {/* Donor Name */}
                <div className="space-y-1">
                  <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                    {isUrdu ? 'عطیہ دہندہ کا نام *' : 'Donor Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder={isUrdu ? "مثال: علی حسن" : "e.g. Ali Hassan"}
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs sm:text-sm transition-colors ${
                      isUrdu ? 'text-right font-urdu' : ''
                    }`}
                  />
                </div>

                {/* Mobile & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                      {isUrdu ? 'موبائل / واٹس ایپ نمبر *' : 'Mobile / WhatsApp Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. 03152204134"
                      className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs sm:text-sm font-mono transition-colors ${
                        isUrdu ? 'text-right' : ''
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                      {isUrdu ? 'ای میل ایڈریس (اختیاری)' : 'Email Address (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="donor@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs sm:text-sm font-mono transition-colors ${
                        isUrdu ? 'text-right' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Monthly Amount Selector */}
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                    {isUrdu ? 'ماہانہ عطیہ کی رقم (PKR) *' : 'Preferred Monthly Amount (PKR) *'}
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {quickAmounts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setAmount(q)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all cursor-pointer ${
                          amount === q
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        ₨ {Number(q).toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    required
                    min="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom monthly amount"
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs sm:text-sm font-mono transition-colors ${
                      isUrdu ? 'text-right' : ''
                    }`}
                  />
                </div>

                {/* Category Selector */}
                <div className="space-y-1">
                  <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                    {isUrdu ? 'عطیہ کی شرعی قسم / فنڈ کھاتہ *' : 'Sharia Fund Account *'}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCategory('zakat')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                        category === 'zakat'
                          ? 'bg-amber-100 text-amber-950 border-amber-400 font-black'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>🕋 {isUrdu ? 'زکوۃ (فرض)' : 'Zakat'}</span>
                      {category === 'zakat' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory('fitrat')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                        category === 'fitrat'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>🌙 {isUrdu ? 'فطرانہ' : 'Fitrat'}</span>
                      {category === 'fitrat' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory('sadaqat')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                        category === 'sadaqat'
                          ? 'bg-sky-100 text-sky-950 border-sky-400 font-black'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>📿 {isUrdu ? 'صدقات' : 'Sadaqat'}</span>
                      {category === 'sadaqat' && <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory('general')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                        category === 'general'
                          ? 'bg-slate-200 text-slate-950 border-slate-400 font-black'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>🏛️ {isUrdu ? 'عمومی فنڈ' : 'General'}</span>
                      {category === 'general' && <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>}
                    </button>
                  </div>
                </div>

                {/* Purpose Selector */}
                <div className="space-y-1">
                  <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                    {isUrdu ? 'مخصوص فنڈ / شعبہ *' : 'Donation Cause *'}
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs sm:text-sm cursor-pointer transition-colors ${
                      isUrdu ? 'font-urdu text-right' : ''
                    }`}
                  >
                    <option value="general">{isUrdu ? "عمومی عطیہ (جنرل فنڈ)" : "General Sadaqah / Zakat"}</option>
                    <option value="masjid">{isUrdu ? "جامع مسجد تعمیراتی فنڈ" : "Jamia Masjid Construction"}</option>
                    <option value="food">{isUrdu ? "راشن اور کھانا فنڈ" : "Food Security Drive"}</option>
                    <option value="education">{isUrdu ? "یتیم بچوں کا تعلیمی فنڈ" : "Orphan Education Support"}</option>
                    <option value="water">{isUrdu ? "صاف پانی / آر او پلانٹ فنڈ" : "Community RO Water Plant"}</option>
                  </select>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:bg-amber-200 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                      isUrdu ? 'font-urdu' : ''
                    }`}
                  >
                    {submitting ? (
                      <Clock className="w-5 h-5 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5 text-emerald-950" />
                    )}
                    <span>
                      {submitting
                        ? (isUrdu ? 'یاد دہانی پروسیس ہو رہی ہے...' : 'Saving Reminder...')
                        : (isUrdu ? 'ماہانہ یاد دہانی فعال کریں' : 'Activate Monthly Reminder')}
                    </span>
                  </button>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={triggerWhatsAppSubscription}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4 rotate-45" />
                      <span>{isUrdu ? 'واٹس ایپ نوٹیفکیشن' : 'WhatsApp Subscription'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={downloadIcsFile}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{isUrdu ? 'کیلنڈر الرٹ (.ics)' : 'Add Phone Calendar'}</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* SAVED SUCCESS STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-9 h-9 text-emerald-700" />
                </div>

                <div className="space-y-2">
                  <h4 className={`text-xl font-black text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {isUrdu ? 'الحمدللہ! ماہانہ یاد دہانی فعال ہو گئی ہے' : 'Monthly Reminder Activated Successfully!'}
                  </h4>
                  <p className={`text-xs text-slate-600 max-w-md mx-auto leading-relaxed ${isUrdu ? 'font-urdu leading-loose text-sm' : 'font-sans'}`}>
                    {isUrdu
                      ? `محترم/محترمہ ${donorName}! آپ کے عطیہ کی اگلی یاد دہانی درست ۱ ماہ بعد موصول ہو گی۔ اللہ تعالیٰ آپ کا یہ جزبہ قبول فرما کر آپ کے مال و جان میں برکت عطا فرمائے۔ آمین۔`
                      : `Dear ${donorName}, your monthly donation reminder for PKR ${Number(amount).toLocaleString()} (${getPurposeLabel(purpose)}) is scheduled for 1 month from today. You and Hasnain Foundation will both be remembered.`}
                  </p>
                </div>

                {/* Instant Calendar Links */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center font-mono">
                    {isUrdu ? 'کیلنڈر اور نوٹیفکیشن آپشنز' : 'Sync to Personal Devices'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={getGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-700" />
                      <span>{isUrdu ? 'گوگل کیلنڈر میں جوڑیں' : 'Add to Google Calendar'}</span>
                    </a>

                    <button
                      onClick={downloadIcsFile}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-700" />
                      <span>{isUrdu ? 'آئی فون / اینڈرائیڈ کیلنڈر' : 'Download Apple/Android .ics'}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  {isUrdu ? 'ٹھیک ہے / بند کریں' : 'Close Window'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
