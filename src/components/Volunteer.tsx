/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { Users, Mail, Phone, Calendar, Heart, CheckCircle2, Sparkles, Send, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { submitVolunteerToSupabase } from '../lib/supabase';

interface VolunteerProps {
  lang: Language;
}

export interface VolunteerSignUp {
  id: string;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  availability: string;
  timestamp: string;
}

export default function Volunteer({ lang }: VolunteerProps) {
  const isUrdu = lang === 'ur';

  // State Management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    availability: 'flexible',
  });
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'fallback'>('idle');

  const interestOptions = [
    { id: 'food', label: { en: 'Food Distribution & Drives', ur: 'راشن اور لنگر کی تقسیم' } },
    { id: 'events', label: { en: 'Event & Spiritual Support', ur: 'مذہبی تقاریب و اجتماعات' } },
    { id: 'welfare', label: { en: 'Medical Camps & RO Plants', ur: 'طبی کیمپ اور واٹر فلٹریشن' } },
    { id: 'admin', label: { en: 'Administrative & Office Work', ur: 'دفتری اور انتظامی امور' } },
    { id: 'tech', label: { en: 'Social Media & Tech Support', ur: 'سوشل میڈیا اور انفارمیشن ٹیکنالوجی' } },
  ];

  const availabilityOptions = [
    { id: 'weekdays', label: { en: 'Weekdays', ur: 'کام کے دن (پیر تا جمعہ)' } },
    { id: 'weekends', label: { en: 'Weekends', ur: 'ہفتہ وار تعطیلات (ہفتہ، اتوار)' } },
    { id: 'evenings', label: { en: 'Evenings Only', ur: 'صرف شام کے وقت' } },
    { id: 'flexible', label: { en: 'Flexible / Any Time', ur: 'لچکدار (کسی بھی وقت)' } },
  ];

  const handleInterestToggle = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvailabilitySelect = (id: string) => {
    setFormData({ ...formData, availability: id });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      alert(isUrdu ? "براہ کرم کم از کم ایک دلچسپی کا شعبہ منتخب کریں۔" : "Please select at least one area of interest.");
      return;
    }

    setIsSubmitting(true);
    setSyncStatus('idle');

    // Create volunteer object
    const newSignUp: VolunteerSignUp = {
      id: `vol-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      interests: selectedInterests,
      availability: formData.availability,
      timestamp: new Date().toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Attempt direct real-time sync to Supabase database first
    const dbResult = await submitVolunteerToSupabase(newSignUp);

    // Also persist to localStorage for continuous robust offline access
    try {
      const stored = localStorage.getItem('hasnain_volunteers');
      const volunteersList = stored ? JSON.parse(stored) : [];
      volunteersList.unshift(newSignUp);
      localStorage.setItem('hasnain_volunteers', JSON.stringify(volunteersList));

      // Dispatch storage update event
      window.dispatchEvent(new Event('volunteers_updated'));
    } catch (err) {
      console.error("Failed to save volunteer registration locally:", err);
    }

    if (dbResult.success) {
      setSyncStatus('success');
    } else {
      setSyncStatus('fallback');
    }

    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      availability: 'flexible',
    });
    setSelectedInterests([]);
    setShowSuccess(false);
  };

  return (
    <section id="volunteer-section" className="py-20 sm:py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs sm:text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'رضاکار بنیں' : 'Volunteer Program'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight ${
              isUrdu ? 'font-urdu leading-snug text-3xl sm:text-4xl' : 'font-sans'
            }`}
          >
            {isUrdu ? 'رضائے الٰہی کے لیے انسانیت کی خدمت میں ہمارا ہاتھ بٹائیں' : 'Serve Humanity with Hasnain Foundation'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-slate-500 text-sm sm:text-base mt-4 leading-relaxed ${
              isUrdu ? 'font-urdu leading-loose text-base text-slate-600' : 'font-sans'
            }`}
          >
            {isUrdu 
              ? 'حسنین فاؤنڈیشن کا کوئی بھی کام رضاکاروں کی انتھک محنت کے بغیر ممکن نہیں۔ آئیے دکھی انسانیت کی خدمت اور معاشرتی اصلاح کی اس بابرکت مہم کا حصہ بنیں۔' 
              : 'Our initiatives are powered by the incredible dedication of our volunteer family. Join us to help support marginalized communities, organize gatherings, and drive direct impact on the ground.'}
          </motion.p>
        </div>

        {/* Content Splitting Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch ${
          isUrdu ? 'lg:flex-row-reverse' : ''
        }`}>
          
          {/* Volunteer Pitch details: Left (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Direct Cards for benefits */}
            <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 flex-grow flex flex-col justify-center">
              
              <h3 className={`text-lg sm:text-xl font-bold text-slate-900 mb-2 ${isUrdu ? 'font-urdu text-right' : 'text-left'}`}>
                {isUrdu ? 'آپ فاؤنڈیشن کا حصہ کیوں بنیں؟' : 'Why Join Our Volunteer Network?'}
              </h3>

              {/* Bullet 1 */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg flex-shrink-0 h-10 w-10 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold text-slate-800 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'رضائے الٰہی اور آخرت کا اجر' : 'Earn Islamic & Spiritual Rewards'}
                  </h4>
                  <p className={`text-slate-500 text-xs leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'رسول اللہ ﷺ نے فرمایا: "تم میں سے بہترین شخص وہ ہے جو لوگوں کو سب سے زیادہ فائدہ پہنچائے۔" خالصتاً نیکی کے لیے وقت دیں۔' 
                      : 'Serve solely for the pleasure of Almighty Allah, putting your faith into motion by comforting the impoverished.'}
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-lg flex-shrink-0 h-10 w-10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-amber-600 fill-current" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold text-slate-800 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'براہِ راست عوامی اثرات' : 'Direct Ground-level Impact'}
                  </h4>
                  <p className={`text-slate-500 text-xs leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'مستحقین تک خشک راشن کی فراہمی، سڑک پر چلنے والے مسافروں کو گرم کھانا پیش کرنا اور واٹر پلانٹ کی دیکھ بھال میں عملاً حصہ لیں۔' 
                      : 'Distribute monthly ration boxes, organize spiritual conferences, and monitor neighborhood RO filtration units directly.'}
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg flex-shrink-0 h-10 w-10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold text-slate-800 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'لچکدار اوقاتِ کار' : 'Highly Flexible Commitments'}
                  </h4>
                  <p className={`text-slate-500 text-xs leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'چاہے آپ کے پاس ہفتے میں صرف دو گھنٹے ہوں، یا صرف چھٹی کے دن، آپ اپنی سہولت کے مطابق وقت وقف کر سکتے ہیں۔' 
                      : 'Whether you can dedicate 2 hours a week or have availability only on weekends, we map responsibilities to suit your schedule.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Volunteer Stats Visual banner */}
            <div className="bg-emerald-950 rounded-xl p-5 border border-emerald-900 text-emerald-100 flex items-center justify-between">
              <div className={isUrdu ? 'text-right' : 'text-left'}>
                <span className="block text-[10px] text-emerald-300 font-bold uppercase tracking-widest">{isUrdu ? 'ہمارا رضاکار گروپ' : 'Active Network'}</span>
                <span className={`block font-black text-white text-base sm:text-lg mt-1 ${isUrdu ? 'font-urdu' : ''}`}>
                  {isUrdu ? '۱۵۰+ سرگرم اسلامی بھائی' : '150+ Dedicated Members'}
                </span>
              </div>
              <div className="p-2.5 bg-white/10 rounded-full text-amber-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* VOLUNTEER FORM: Right (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.form
                  key="volunteer-signup-form"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className={`border-b border-slate-100 pb-4 mb-4 ${isUrdu ? 'text-right' : 'text-left'}`}>
                    <h3 className={`text-base sm:text-lg font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                      {isUrdu ? 'رجسٹریشن فارم برائے رضاکار' : 'Volunteer Registration Form'}
                    </h3>
                    <p className={`text-xs text-slate-400 mt-1 ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                      {isUrdu ? 'برائے مہربانی درج ذیل معلومات فراہم کریں تاکہ ہماری ٹیم آپ سے رابطہ کر سکے۔' : 'Please provide accurate contact information and designate your interests.'}
                    </p>
                  </div>

                  {/* Core fields row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label htmlFor="vol-name" className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'پورا نام (لازمی)' : 'Your Full Name (Required)'}
                      </label>
                      <div className="relative">
                        <input
                          id="vol-name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={isUrdu ? "احمد رضا" : "e.g. Ahmed Raza"}
                          className={`w-full px-3 py-2 pl-9 rounded-lg border border-slate-200 bg-white text-slate-950 focus:outline-none focus:border-emerald-700 text-xs ${
                            isUrdu ? 'text-right pr-9 pl-3 font-urdu' : ''
                          }`}
                        />
                        <div className={`absolute top-2.5 text-slate-400 ${isUrdu ? 'right-3' : 'left-3'}`}>
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label htmlFor="vol-phone" className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'موبائل نمبر (لازمی)' : 'Phone Number (Required)'}
                      </label>
                      <div className="relative">
                        <input
                          id="vol-phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 03180202424"
                          className={`w-full px-3 py-2 pl-9 rounded-lg border border-slate-200 bg-white text-slate-955 focus:outline-none focus:border-emerald-700 text-xs font-mono ${
                            isUrdu ? 'text-right pr-9 pl-3' : ''
                          }`}
                        />
                        <div className={`absolute top-2.5 text-slate-400 ${isUrdu ? 'right-3' : 'left-3'}`}>
                          <Phone className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email address */}
                  <div className="space-y-1">
                    <label htmlFor="vol-email" className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                      {isUrdu ? 'ای میل ایڈریس (لازمی)' : 'Email Address (Required)'}
                    </label>
                    <div className="relative">
                      <input
                        id="vol-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. hasnainfoundation225@gmail.com"
                        className={`w-full px-3 py-2 pl-9 rounded-lg border border-slate-200 bg-white text-slate-955 focus:outline-none focus:border-emerald-700 text-xs font-mono ${
                          isUrdu ? 'text-right pr-9 pl-3' : ''
                        }`}
                      />
                      <div className={`absolute top-2.5 text-slate-400 ${isUrdu ? 'right-3' : 'left-3'}`}>
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Areas of Interest Multi-select checkboxes */}
                  <div className="space-y-2">
                    <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                      {isUrdu ? 'دلچسپی کے فلاحی شعبے (کم از کم ایک منتخب کریں)' : 'Areas of Interest (Select all that apply)'}
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {interestOptions.map((option) => {
                        const isSelected = selectedInterests.includes(option.id);
                        return (
                          <button
                            type="button"
                            key={option.id}
                            onClick={() => handleInterestToggle(option.id)}
                            className={`flex items-center gap-2.5 p-2.5 px-3.5 rounded-lg border text-xs font-semibold text-left transition-colors cursor-pointer select-none ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:border-slate-300'
                            } ${isUrdu ? 'flex-row-reverse text-right font-urdu' : 'font-sans'}`}
                          >
                            <span className={`w-4 h-4 flex items-center justify-center rounded border transition-colors ${
                              isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                            </span>
                            <span className="flex-1">{option.label[lang]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability Selectable Cards */}
                  <div className="space-y-2">
                    <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                      {isUrdu ? 'دستیاب اوقاتِ کار' : 'Availability / Schedule Preference'}
                    </label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {availabilityOptions.map((option) => {
                        const isSelected = formData.availability === option.id;
                        return (
                          <button
                            type="button"
                            key={option.id}
                            onClick={() => handleAvailabilitySelect(option.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <Calendar className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                            <span className={`text-[10px] sm:text-[11px] leading-tight ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                              {option.label[lang]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm cursor-pointer disabled:opacity-50 transition-colors ${
                        isUrdu ? 'font-urdu' : 'font-sans'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>{isUrdu ? 'رجسٹریشن کی جا رہی ہے...' : 'Submitting Registration...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{isUrdu ? 'رضاکار کی حیثیت سے شامل ہوں' : 'Submit Volunteer Application'}</span>
                        </>
                      )}
                    </button>
                  </div>

                </motion.form>
              ) : (
                // Thank you message
                <motion.div
                  key="volunteer-success-msg"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-5"
                >
                  <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg w-16 h-16 flex items-center justify-center shadow-none">
                    <CheckCircle2 className="w-10 h-10 text-emerald-700" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className={`text-xl font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                      {isUrdu ? 'جزاک اللہ خیراً!' : 'JazakAllahu Khairan!'}
                    </h3>
                    <h4 className={`text-base font-bold text-emerald-800 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                      {isUrdu ? 'رجسٹریشن کامیابی کے ساتھ مکمل ہوگئی ہے' : 'Your Volunteer Registration was Successful!'}
                    </h4>
                  </div>

                  <p className={`text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed ${isUrdu ? 'font-urdu leading-loose text-slate-600' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'حسنین فاؤنڈیشن کی رضاکار ٹیم میں شامل ہونے کا بیحد شکریہ۔ آپ کے جذبے کو خراجِ تحسین پیش کرتے ہیں۔ ہماری ٹیم کا منتظم جلد ہی آپ کے فراہم کردہ فون نمبر یا ای میل پر آپ سے رابطہ کرے گا تاکہ آپ کو فعال گروپس میں شامل کیا جا سکے۔' 
                      : 'Thank you for your noble intention to support our mission. Volunteers like you are the true backbone of our outreach. An administrator from our volunteer coordination department will review your preferences and get in touch with you shortly via phone/WhatsApp.'}
                  </p>

                  {/* Mock Visual Member Badge Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-emerald-100 max-w-sm w-full flex items-center gap-3.5 text-left font-sans">
                    <div className="p-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isUrdu ? 'ابتدائی درجہ' : 'Initial Status'}</span>
                      <span className={`block text-xs font-extrabold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
                        {isUrdu ? 'عزمِ رضا کارڈ جاری شدہ' : 'Certified Active Volunteer candidate'}
                      </span>
                      <span className="block text-[9px] text-emerald-700 font-bold mt-0.5">ID: HF-VOL-{Math.floor(Math.random() * 899 + 100)}</span>
                    </div>
                  </div>

                  {/* Supabase Sync Feedback Indicator */}
                  {syncStatus === 'success' && (
                    <div className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>{isUrdu ? 'ڈیٹا بیس کامیابی سے ہم آہنگ ہو گیا' : 'Live synced to Supabase database'}</span>
                    </div>
                  )}
                  {syncStatus === 'fallback' && (
                    <div className="text-[10px] bg-amber-50/70 text-amber-800 font-bold px-3 py-1.5 rounded-lg border border-amber-100 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>{isUrdu ? 'مقامی طور پر محفوظ کیا گیا (سپابیس کلاؤڈ سیکیور فالبیک)' : 'Saved locally (Supabase secure local fallback)'}</span>
                    </div>
                  )}

                  <button
                    onClick={resetForm}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer bg-white transition-colors"
                  >
                    {isUrdu ? 'ایک اور رجسٹریشن کریں' : 'Register Another Volunteer'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
