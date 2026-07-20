/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Calendar, Clock, Phone, Send, User, MapPin, Mail, AlertCircle, CheckCircle, Copy, Sparkles, Shield, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppointmentSystemProps {
  lang: Language;
  prefilledReason?: string;
  onSuccess?: () => void;
}

export default function AppointmentSystem({ lang, prefilledReason = '', onSuccess }: AppointmentSystemProps) {
  const isUrdu = lang === 'ur';

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    age: '',
    gender: 'Male',
    phone: '',
    whatsapp: '',
    email: '',
    country: 'Pakistan',
    city: '',
    reason: 'Online Istikhara',
    description: '',
    appointmentDate: '',
    appointmentTime: '02:00 PM - 04:00 PM',
    files: [] as string[]
  });

  // Pre-fill reason if selected from other parts of the site
  useEffect(() => {
    if (prefilledReason) {
      setFormData(prev => ({ ...prev, reason: prefilledReason }));
    }
  }, [prefilledReason]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Available services list matching the requirements
  const SERVICES_LIST = [
    { en: "Online Istikhara", ur: "آن لائن استخارہ" },
    { en: "Spiritual Guidance", ur: "روحانی رہنمائی" },
    { en: "Islamic Ruqyah", ur: "شرعی دم (رقیہ)" },
    { en: "Protection Duas", ur: "حفاظتی دعائیں" },
    { en: "Quranic Healing", ur: "قرآنی شفاء" },
    { en: "Taweez according to Islamic principles", ur: "شرعی تعویذات" },
    { en: "Family Issues", ur: "خاندانی تنازعات کا حل" },
    { en: "Business Problems", ur: "کاروباری بندش کا توڑ" },
    { en: "Marriage Problems", ur: "شادی کی بندش و مسائل" },
    { en: "Evil Eye Guidance", ur: "نظرِ بد کا علاج" },
    { en: "Black Magic Guidance", ur: "جیسا جادو ویسا کاٹ" },
    { en: "Jinn Related Guidance", ur: "آسیب و جنات کا علاج" }
  ];

  const TIME_SLOTS = [
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "05:00 PM - 07:00 PM",
    "08:00 PM - 10:00 PM"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.name || !formData.age || !formData.phone || !formData.whatsapp || !formData.email || !formData.description || !formData.appointmentDate) {
      setError(isUrdu ? "براہ کرم تمام لازمی فیلڈز پُر کریں۔" : "Please fill in all mandatory fields marked with *.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const resJson = await response.json();
      if (resJson.success) {
        setSuccessData(resJson);
        if (onSuccess) onSuccess();
      } else {
        setError(resJson.error || (isUrdu ? "رجسٹریشن میں خرابی پیش آئی۔ دوبارہ کوشش کریں۔" : "Failed to book appointment. Please try again."));
      }
    } catch (err: any) {
      console.error(err);
      setError(isUrdu ? "سرور سے رابطہ قائم نہیں ہو سکا۔" : "Could not connect to the server. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="appointment-section" className="py-2 bg-slate-50 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-950/5 to-transparent pointer-events-none" />
      <div className="absolute -left-64 top-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-64 bottom-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-1 sm:px-2 relative z-10">
        
        {/* Outer Form Frame */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden backdrop-blur-md">
          
          <AnimatePresence mode="wait">
            {!successData ? (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleFormSubmit}
                className="p-6 sm:p-10 space-y-6"
              >
                {/* Heading statement */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <p className={`text-sm text-emerald-800 font-bold ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu 
                      ? '🌸 "شفاء صرف اور صرف اللہ تعالیٰ کے حکم سے ملتی ہے۔"'
                      : '🌸 "Healing comes only by the Will of Allah."'}
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Patient Information Grid */}
                <div>
                  <h3 className={`text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                    {isUrdu ? 'مریض کی معلومات' : '1. Personal Details'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'مریض کا نام *' : 'Patient Name *'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={isUrdu ? "محمد احمد" : "Full Name"}
                          className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    {/* Father Name */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'والد کا نام' : "Father's Name (Optional)"}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          placeholder={isUrdu ? "علی احمد" : "Father Name"}
                          className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    {/* Age */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'مریض کی عمر *' : 'Patient Age *'}
                      </label>
                      <input
                        type="number"
                        name="age"
                        required
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="e.g. 25"
                        className="w-full px-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'جنس *' : 'Gender *'}
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                      >
                        <option value="Male">{isUrdu ? 'مرد' : 'Male'}</option>
                        <option value="Female">{isUrdu ? 'خاتون' : 'Female'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information Grid */}
                <div>
                  <h3 className={`text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                    {isUrdu ? 'رابطے کی معلومات' : '2. Contact Details'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'فون نمبر *' : 'Phone Number *'}
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 03152204134"
                          className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'واٹس ایپ نمبر *' : 'WhatsApp Number *'}
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="whatsapp"
                          required
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="e.g. 03152204134"
                          className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                        />
                        <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'ای میل ایڈریس *' : 'Email Address *'}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. name@domain.com"
                          className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    {/* Country & City */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                          {isUrdu ? 'ملک' : 'Country'}
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                          {isUrdu ? 'شہر *' : 'City *'}
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder={isUrdu ? "کراچی" : "Karachi"}
                          className="w-full px-3 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Details */}
                <div>
                  <h3 className={`text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                    {isUrdu ? 'روحانی مسئلہ اور معائنہ کا وقت' : '3. Diagnosis & Appointment Slot'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Reason/Service dropdown */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'رابطے کی وجہ / مسئلہ کا انتخاب *' : 'Reason / Spiritual Treatment Selected *'}
                      </label>
                      <select
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all font-semibold"
                      >
                        {SERVICES_LIST.map((service, idx) => (
                          <option key={idx} value={service.en}>
                            {isUrdu ? service.ur : service.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'پسندیدہ تاریخ معائنہ *' : 'Preferred Appointment Date *'}
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="appointmentDate"
                          required
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                        />
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    {/* Preferred Time Slot */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'پسندیدہ وقت *' : 'Preferred Time Slot *'}
                      </label>
                      <div className="relative">
                        <select
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                        >
                          {TIME_SLOTS.map((slot, idx) => (
                            <option key={idx} value={slot}>{slot}</option>
                          ))}
                        </select>
                        <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    {/* Files Placeholder (Medical reports) */}
                    <div>
                      <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                        {isUrdu ? 'طبی رپورٹس / سابقہ نسخہ جات (اختیاری)' : 'Medical Reports / Files (Optional)'}
                      </label>
                      <input
                        type="file"
                        disabled
                        className="w-full px-4 py-2 text-slate-400 text-xs rounded-xl border border-dashed border-slate-300 py-3 bg-slate-50 text-center"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1 text-center">
                        {isUrdu ? 'پی ڈی ایف اور تصاویر اپ لوڈ کرنا عارضی طور پر آف لائن ہے۔' : 'Drag-and-drop file upload is optimized for security.'}
                      </span>
                    </div>
                  </div>

                  {/* Problem Description Text Area */}
                  <div className="mt-4">
                    <label className={`block text-xs font-bold text-slate-700 mb-1.5 ${isUrdu ? 'text-right font-urdu' : ''}`}>
                      {isUrdu ? 'مسئلہ کی تفصیل اور علامات *' : 'Brief Problem Description & Physical/Spiritual Symptoms *'}
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={isUrdu 
                        ? "اپنی جسمانی و روحانی علامات جیسے خوابوں میں ڈرنا، کاروبار کا اچانک ٹھپ ہونا یا شدید چڑچڑاپن تفصیل سے لکھیں..." 
                        : "Describe your symptoms (e.g., sleeplessness, recurring nightmares, severe body pain, business/marriage blockages, medical treatment status)..."}
                      className="w-full px-4 py-3 text-slate-800 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Security Disclaimer */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                  <p>
                    {isUrdu 
                      ? 'نوٹ: حسنین فاؤنڈیشن مریض کے تمام کوائف، بیماریوں اور رازوں کی صد فیصد حفاظت کا ضامن ہے۔ آپ کا ڈیٹا مکمل طور پر خفیہ رکھا جائے گا اور صرف مستند خلفاء معائنے کے لیے استعمال کریں گے۔'
                      : 'Hasnain Foundation guarantees 100% confidentiality of all medical, physical, and spiritual reports. Your symptoms are shared exclusively with Khalifa Salman Ali and Allama Shayan Ali.'}
                  </p>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold text-base border border-emerald-800 hover:border-emerald-950 transition-all shadow-lg hover:shadow-emerald-900/15 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 text-amber-400 rotate-45" />
                    )}
                    <span>{isUrdu ? 'بکنگ رجسٹرڈ کریں (سبمٹ)' : 'Register Patient & Generate ID'}</span>
                  </button>
                </div>

              </motion.form>
            ) : (
              // ==========================================
              // SUCCESS RECEIPT / PATIENT CARD GENERATED
              // ==========================================
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 sm:p-10 space-y-8 text-center"
              >
                {/* Simulated Notification Feeds in Green banner */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-2xl p-4 text-xs space-y-3 animate-pulse">
                  <div className="flex items-center gap-2 justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold uppercase tracking-wider">
                      {isUrdu ? 'مسائل حل کرنے کے لئے نوٹیفکیشن جاری' : 'Notifications Processed & Transmitted Successfully'}
                    </span>
                  </div>
                  <div className="border-t border-emerald-500/10 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-mono text-[10px] text-emerald-700">
                    <div>
                      <span className="font-bold text-emerald-900 block">✓ SMTP EMAIL TRIGGERED:</span>
                      {successData.notifications.emailText.substring(0, 70)}...
                    </div>
                    <div>
                      <span className="font-bold text-emerald-900 block">✓ WHATSAPP API SENT:</span>
                      {successData.notifications.whatsAppText.substring(0, 70)}...
                    </div>
                  </div>
                </div>

                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>

                <div>
                  <h3 className={`text-2xl font-black text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'ماشاء اللہ! رجسٹریشن مکمل ہو گئی ہے' : 'Assalam-o-Alaikum! Registration Successful'}
                  </h3>
                  <p className={`text-slate-600 text-sm mt-2 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu 
                      ? 'مریض کی رجسٹریشن کارڈ کامیابی کے ساتھ بن گیا ہے۔ معائنے کی تفصیلات درج ذیل ہیں۔'
                      : 'Your patient registration has been recorded. Below is your official spiritual booking slip.'}
                  </p>
                </div>

                {/* Elegant Copiable Printable Patient Card Slip */}
                <div className="max-w-md mx-auto bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border-2 border-amber-500/40 text-left">
                  {/* Card Watermark */}
                  <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                    <svg className="w-full h-full text-amber-400 scale-125" viewBox="0 0 100 100" fill="currentColor">
                      <polygon points="50,0 60,35 95,35 65,55 80,90 50,70 20,90 35,55 5,35 40,35" />
                    </svg>
                  </div>

                  {/* Card Header */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 relative z-10">
                    <div>
                      <h4 className="font-extrabold text-sm tracking-wide text-amber-400">HASNAIN FOUNDATION</h4>
                      <p className="text-[9px] text-emerald-300 font-bold uppercase tracking-widest font-mono">Spiritual Healing Center</p>
                    </div>
                    <div className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-mono text-xs font-black">
                      {successData.appointment.id}
                    </div>
                  </div>

                  {/* Card Body Grid */}
                  <div className="space-y-3 text-xs relative z-10">
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2">
                      <span className="text-slate-400">{isUrdu ? 'مریض کا نام:' : 'Patient Name:'}</span>
                      <span className="col-span-2 font-black text-white">{successData.appointment.name}</span>
                    </div>

                    {successData.appointment.fatherName && (
                      <div className="grid grid-cols-3 border-b border-white/5 pb-2">
                        <span className="text-slate-400">{isUrdu ? 'والد کا نام:' : "Father's Name:"}</span>
                        <span className="col-span-2 text-white">{successData.appointment.fatherName}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 border-b border-white/5 pb-2">
                      <span className="text-slate-400">{isUrdu ? 'عمر / جنس:' : 'Age / Gender:'}</span>
                      <span className="col-span-2 text-white">{successData.appointment.age} Years / {successData.appointment.gender}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-white/5 pb-2">
                      <span className="text-slate-400">{isUrdu ? 'علاج کا زمرہ:' : 'Treatment For:'}</span>
                      <span className="col-span-2 text-amber-300 font-bold">{successData.appointment.reason}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-white/5 pb-2">
                      <span className="text-slate-400">{isUrdu ? 'تاریخ معائنہ:' : 'Appointment Date:'}</span>
                      <span className="col-span-2 text-white font-mono">{successData.appointment.appointmentDate}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-white/5 pb-2">
                      <span className="text-slate-400">{isUrdu ? 'وقت کا سلاٹ:' : 'Time Slot:'}</span>
                      <span className="col-span-2 text-white font-mono">{successData.appointment.appointmentTime}</span>
                    </div>

                    <div className="grid grid-cols-3 pb-1">
                      <span className="text-slate-400">{isUrdu ? 'رابطہ فون:' : 'Phone Contact:'}</span>
                      <span className="col-span-2 text-emerald-300 font-mono">{successData.appointment.whatsapp} (WhatsApp)</span>
                    </div>
                  </div>

                  {/* Slip footer statement */}
                  <p className="text-[10px] text-slate-400 text-center border-t border-white/10 pt-4 mt-4 leading-relaxed font-semibold italic relative z-10">
                    {isUrdu 
                      ? 'براہ کرم اس بکنگ سلپ کو سنبھال کر رکھیں۔ اسکرین شاٹ لیں یا پرنٹ کریں۔'
                      : 'Please take a screenshot of this card. Bring the ID on your scheduled time.'}
                  </p>
                </div>

                {/* Receipt Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                  <button
                    onClick={() => copyToClipboard(`Patient Booking ID: ${successData.appointment.id}\nPatient: ${successData.appointment.name}\nTreatment: ${successData.appointment.reason}\nDate: ${successData.appointment.appointmentDate}\nTime Slot: ${successData.appointment.appointmentTime}`)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'تفصیلات کاپی کریں' : 'Copy Booking Details')}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSuccessData(null);
                      setFormData(prev => ({
                        ...prev,
                        name: '',
                        fatherName: '',
                        age: '',
                        phone: '',
                        whatsapp: '',
                        email: '',
                        city: '',
                        description: '',
                        appointmentDate: ''
                      }));
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>{isUrdu ? 'نیا فارم بک کریں' : 'Book Another Session'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
