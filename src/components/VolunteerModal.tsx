/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { Users, Mail, Phone, Calendar, Send, CheckCircle2, Award, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { submitVolunteerToSupabase } from '../lib/supabase';
import { VolunteerSignUp } from './Volunteer';

interface VolunteerModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export default function VolunteerModal({ lang, isOpen, onClose }: VolunteerModalProps) {
  const isUrdu = lang === 'ur';

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

    const dbResult = await submitVolunteerToSupabase(newSignUp);

    try {
      const stored = localStorage.getItem('hasnain_volunteers');
      const volunteersList = stored ? JSON.parse(stored) : [];
      volunteersList.unshift(newSignUp);
      localStorage.setItem('hasnain_volunteers', JSON.stringify(volunteersList));
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-auto flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-emerald-950 border-b border-emerald-900 text-white flex items-center justify-between shrink-0">
            <div className={`flex items-center gap-3 ${isUrdu ? 'flex-row-reverse text-right' : 'flex-row'}`}>
              <div className="p-2 rounded-xl bg-emerald-800/80 border border-emerald-700 text-emerald-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-base sm:text-lg font-black text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'آن لائن رضاکار رجسٹریشن فارم' : 'Online Volunteer Registration Form'}
                </h3>
                <p className={`text-[11px] text-emerald-300 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'حسنین فاؤنڈیشن کی فلاحی ٹیم کا حصہ بنیں' : 'Join Hasnain Foundation Volunteer Network'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body with Scroll */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.form
                  key="modal-volunteer-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <p className={`text-xs text-slate-500 bg-emerald-50/80 p-3 rounded-xl border border-emerald-100 ${isUrdu ? 'font-urdu text-right leading-relaxed' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'برائے مہربانی درج ذیل معلومات فراہم کریں تاکہ ہماری ٹیم آپ سے رابطہ کر کے آپ کو رضاکار گروپ میں شامل کر سکے۔' 
                      : 'Please fill out your contact details and designate your interests to register as an active volunteer.'}
                  </p>

                  {/* Name & Phone Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label htmlFor="modal-vol-name" className={`block text-xs font-bold text-slate-700 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'پورا نام (لازمی)' : 'Full Name (Required)'}
                      </label>
                      <div className="relative">
                        <input
                          id="modal-vol-name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={isUrdu ? "احمد رضا" : "e.g. Ahmed Raza"}
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-emerald-700 focus:bg-white transition-all ${
                            isUrdu ? 'text-right pr-9 pl-3 font-urdu' : 'pl-9 pr-3'
                          }`}
                        />
                        <div className={`absolute top-3 text-slate-400 ${isUrdu ? 'right-3' : 'left-3'}`}>
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label htmlFor="modal-vol-phone" className={`block text-xs font-bold text-slate-700 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'موبائل نمبر (لازمی)' : 'Phone Number (Required)'}
                      </label>
                      <div className="relative">
                        <input
                          id="modal-vol-phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 03180202424"
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-700 focus:bg-white transition-all ${
                            isUrdu ? 'text-right pr-9 pl-3' : 'pl-9 pr-3'
                          }`}
                        />
                        <div className={`absolute top-3 text-slate-400 ${isUrdu ? 'right-3' : 'left-3'}`}>
                          <Phone className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="modal-vol-email" className={`block text-xs font-bold text-slate-700 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                      {isUrdu ? 'ای میل ایڈریس (لازمی)' : 'Email Address (Required)'}
                    </label>
                    <div className="relative">
                      <input
                        id="modal-vol-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. hasnainfoundation225@gmail.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-700 focus:bg-white transition-all ${
                          isUrdu ? 'text-right pr-9 pl-3' : 'pl-9 pr-3'
                        }`}
                      />
                      <div className={`absolute top-3 text-slate-400 ${isUrdu ? 'right-3' : 'left-3'}`}>
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Areas of Interest Multi-select checkboxes */}
                  <div className="space-y-2">
                    <label className={`block text-xs font-bold text-slate-700 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                      {isUrdu ? 'دلچسپی کے فلاحی شعبے (کم از کم ایک منتخب کریں)' : 'Areas of Interest'}
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {interestOptions.map((option) => {
                        const isSelected = selectedInterests.includes(option.id);
                        return (
                          <button
                            type="button"
                            key={option.id}
                            onClick={() => handleInterestToggle(option.id)}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:border-slate-300'
                            } ${isUrdu ? 'flex-row-reverse text-right font-urdu' : 'font-sans'}`}
                          >
                            <span className={`w-4 h-4 flex items-center justify-center rounded border transition-colors shrink-0 ${
                              isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                            </span>
                            <span className="flex-1 text-[11px]">{option.label[lang]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-2">
                    <label className={`block text-xs font-bold text-slate-700 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                      {isUrdu ? 'دستیاب اوقاتِ کار' : 'Availability / Schedule Preference'}
                    </label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availabilityOptions.map((option) => {
                        const isSelected = formData.availability === option.id;
                        return (
                          <button
                            type="button"
                            key={option.id}
                            onClick={() => handleAvailabilitySelect(option.id)}
                            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-extrabold'
                                : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <Calendar className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
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
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm cursor-pointer disabled:opacity-50 transition-colors shadow-md shadow-emerald-900/20 ${
                        isUrdu ? 'font-urdu' : 'font-sans'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>{isUrdu ? 'ارسال کیا جا رہا ہے...' : 'Submitting Application...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{isUrdu ? 'آن لائن درخواست جمع کروائیں' : 'Submit Online Registration'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* Success Message */
                <motion.div
                  key="modal-volunteer-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center p-6 space-y-4"
                >
                  <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl w-16 h-16 flex items-center justify-center shadow-none">
                    <CheckCircle2 className="w-10 h-10 text-emerald-700" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className={`text-xl font-black text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                      {isUrdu ? 'جزاک اللہ خیراً!' : 'JazakAllahu Khairan!'}
                    </h3>
                    <h4 className={`text-sm font-bold text-emerald-800 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                      {isUrdu ? 'آن لائن رجسٹریشن کامیابی سے موصول ہوگئی' : 'Online Registration Received Successfully!'}
                    </h4>
                  </div>

                  <p className={`text-slate-600 text-xs sm:text-sm max-w-md leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'حسنین فاؤنڈیشن میں شمولیت کے لیے آپ کی آن لائن درخواست موصول ہو چکی ہے۔ ہماری ٹیم کا منتظم جلد ہی آپ سے رابطہ کرے گا۔' 
                      : 'Thank you for submitting your volunteer application. Our admin team will contact you shortly via WhatsApp or phone.'}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-emerald-100 max-w-sm w-full flex items-center gap-3 text-left font-sans">
                    <div className="p-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">{isUrdu ? 'اسٹیٹس' : 'Status'}</span>
                      <span className={`block text-xs font-bold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
                        {isUrdu ? 'آن لائن رضاکار فارم منظور شدہ' : 'Active Volunteer Application'}
                      </span>
                      <span className="block text-[9px] text-emerald-700 font-mono font-bold">ID: HF-VOL-{Math.floor(Math.random() * 899 + 100)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
                    >
                      {isUrdu ? 'مکمل کریں' : 'Done & Close'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
