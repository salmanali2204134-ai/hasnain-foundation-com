/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { DICTIONARY } from '../data';
import { MapPin, Phone, Mail, Send, CheckCircle, Smartphone, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { submitContactToSupabase } from '../lib/supabase';

interface ContactProps {
  lang: Language;
  onOpenComplaint?: () => void;
}

export default function Contact({ lang, onOpenComplaint }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'fallback'>('idle');

  const isUrdu = lang === 'ur';

  const contactInfo = {
    address: {
      en: "Hasnain Foundation, Jamia Masjid Abdul Qadir Jilani, Street 1, Sector 6-C, KDA Scheme 41, Surjani Town, Karachi, Pakistan",
      ur: "حسنین فاؤنڈیشن، جامع مسجد عبدالقادر جیلانی، اسٹریٹ ۱، سیکٹر 6-C، کے ڈی اے اسکیم ۴۱، سرجانی ٹاؤن، کراچی، پاکستان"
    },
    phone: "03180202424",
    whatsapp: "03180202424",
    email: "info@hasnainfoundation.org"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSyncStatus('idle');
    
    // Attempt live Supabase submit first
    const dbResult = await submitContactToSupabase(formData);

    if (dbResult.success) {
      setSyncStatus('success');
    } else {
      setSyncStatus('fallback');
    }

    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setShowSuccess(false), 8000);
  };

  return (
    <section id="contact-us-section" className="py-20 sm:py-24 bg-slate-50 overflow-hidden">
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
            <Mail className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'ہم سے رابطہ کریں' : 'Get in Touch'}
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
            {DICTIONARY.contact.title[lang]}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-slate-500 text-sm sm:text-base mt-4 leading-relaxed ${
              isUrdu ? 'font-urdu leading-loose text-base' : 'font-sans'
            }`}
          >
            {DICTIONARY.contact.subtitle[lang]}
          </motion.p>
        </div>

        {/* Form vs Info grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch ${
          isUrdu ? 'lg:flex-row-reverse' : ''
        }`}>
          
          {/* CONTACT INFO: Left (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Particulars Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-none">
              
              {/* Address detail */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg flex-shrink-0 h-10 w-10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest ${isUrdu ? 'font-urdu' : ''}`}>
                    {DICTIONARY.contact.addressLabel[lang]}
                  </span>
                  <p className={`text-slate-700 text-xs sm:text-sm leading-relaxed ${
                    isUrdu ? 'font-urdu leading-loose' : 'font-sans'
                  }`}>
                    {contactInfo.address[lang]}
                  </p>
                </div>
              </div>

              {/* Phone detail */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-lg flex-shrink-0 h-10 w-10 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest ${isUrdu ? 'font-urdu' : ''}`}>
                    {DICTIONARY.contact.phoneLabel[lang]}
                  </span>
                  <a href={`tel:${contactInfo.phone}`} className="block font-mono font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp detail */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg flex-shrink-0 h-10 w-10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest ${isUrdu ? 'font-urdu' : ''}`}>
                    {DICTIONARY.contact.whatsappLabel[lang]}
                  </span>
                  <a href={`https://wa.me/923180202424`} target="_blank" rel="noreferrer" className="block font-mono font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors">
                    {contactInfo.whatsapp}
                  </a>
                </div>
              </div>

              {/* Email detail */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg flex-shrink-0 h-10 w-10 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className={`block text-[10px] font-bold text-slate-400 uppercase tracking-widest ${isUrdu ? 'font-urdu' : ''}`}>
                    {DICTIONARY.contact.emailLabel[lang]}
                  </span>
                  <a href={`mailto:${contactInfo.email}`} className="block font-mono font-semibold text-slate-700 text-sm hover:text-emerald-700 transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

            </div>

            {/* INTEGRATED ACTUAL GOOGLE MAPS IFRAME EMBED */}
            <div className="bg-white rounded-xl border border-slate-200 p-2 overflow-hidden relative shadow-none flex flex-col gap-2">
              <div className="h-64 sm:h-72 w-full overflow-hidden rounded-lg">
                <iframe
                  title="Jamia Masjid Abdul Qadir Jilani Map"
                  src="https://maps.google.com/maps?q=Jamia%20Masjid%20Abdul%20Qadir%20Jilani,%20Surjani%20Town%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <a 
                href="https://maps.app.goo.gl/WAH1sv76pVNsSQiHA"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isUrdu ? 'گوگل میپس پر لوکیشن دیکھیں' : 'Open in Google Maps'}</span>
              </a>
            </div>

            {/* COMPLAINTS SECURE MODULE LINK */}
            {onOpenComplaint && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 space-y-3 shadow-none text-left">
                <div className="flex items-center gap-2 text-rose-800">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className={`font-extrabold text-xs sm:text-sm ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'بدعنوانی یا فیس چارجنگ کی شکایت' : 'Report Wrongdoing / Fee Charging'}
                  </span>
                </div>
                <p className={`text-rose-700/80 text-[11px] leading-relaxed ${isUrdu ? 'font-urdu leading-loose text-xs' : ''}`}>
                  {isUrdu 
                    ? 'ہمارے تمام روحانی علاج، دم اور استخارہ بالکل مفت ہیں۔ اگر کوئی فیس مانگے تو خفیہ اور محفوظ شکایت یہاں درج کریں۔'
                    : 'Spiritual treatments are completely free of charge. If anyone demands money or acts wrongfully, file a secure report immediately.'}
                </p>
                <button
                  type="button"
                  onClick={onOpenComplaint}
                  className={`w-full py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm text-center ${
                    isUrdu ? 'font-urdu' : ''
                  }`}
                >
                  {isUrdu ? 'خفیہ شکایت درج کریں' : 'File Secure Confidential Report'}
                </button>
              </div>
            )}
          </div>

          {/* CONTACT FORM: Right (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-none">
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {DICTIONARY.contact.formName[lang]}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-955 focus:outline-none focus:border-emerald-700 text-xs ${
                          isUrdu ? 'text-right font-urdu' : ''
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {DICTIONARY.contact.formEmail[lang]}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-955 focus:outline-none focus:border-emerald-700 text-xs ${
                          isUrdu ? 'text-right' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {DICTIONARY.contact.formPhone[lang]}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-955 focus:outline-none focus:border-emerald-700 text-xs ${
                          isUrdu ? 'text-right' : ''
                        }`}
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {DICTIONARY.contact.formSubject[lang]}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-955 focus:outline-none focus:border-emerald-700 text-xs ${
                          isUrdu ? 'text-right font-urdu' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                      {DICTIONARY.contact.formMessage[lang]}
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-955 focus:outline-none focus:border-emerald-700 text-xs ${
                        isUrdu ? 'text-right font-urdu leading-loose' : ''
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 ${
                      isUrdu ? 'font-urdu' : ''
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting ? DICTIONARY.contact.formSending[lang] : DICTIONARY.contact.formSubmit[lang]}
                    </span>
                  </button>
                </motion.form>
              ) : (
                // Success message
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4"
                >
                  <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg w-14 h-14 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className={`text-xl font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {isUrdu ? 'پیغام موصول ہو گیا!' : 'Message Received!'}
                  </h3>
                  <p className={`text-slate-500 text-xs max-w-md leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                    {DICTIONARY.contact.formSuccess[lang]}
                  </p>

                  {/* Supabase Sync Feedback Indicator */}
                  {syncStatus === 'success' && (
                    <div className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 inline-flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>{isUrdu ? 'ڈیٹا بیس کامیابی سے ہم آہنگ ہو گیا' : 'Live synced to Supabase database'}</span>
                    </div>
                  )}
                  {syncStatus === 'fallback' && (
                    <div className="text-[10px] bg-amber-50/70 text-amber-800 font-bold px-3 py-1.5 rounded-lg border border-amber-100 inline-flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>{isUrdu ? 'مقامی طور پر محفوظ کیا گیا (سپابیس کلاؤڈ سیکیور فالبیک)' : 'Saved locally (Supabase secure local fallback)'}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
