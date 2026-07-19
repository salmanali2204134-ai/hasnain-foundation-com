/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { DICTIONARY } from '../data';
import { Search, ShieldCheck, Calendar, Activity, Sparkles, Clock, ArrowRight, Heart, FileText, Printer, CheckCircle, HelpCircle, User, Phone, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PatientPortalProps {
  lang: Language;
  onNavigateToBooking: () => void;
}

export default function PatientPortal({ lang, onNavigateToBooking }: PatientPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isUrdu = lang === 'ur';

  // Remove on-mount fetching of all patients to prevent data leaks.
  // Patient lookup is now done securely on the server-side.

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSelectedPatient(null);
    setSearched(true);
    
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/appointments/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (data.success && data.appointment) {
        setSelectedPatient(data.appointment);
      } else {
        setErrorMsg(
          isUrdu 
            ? "ملازمت یا ریکارڈ نہیں ملا۔ برائے مہربانی اپنا درست فون نمبر یا مریض آئی ڈی (جیسے HF-APT-1001) درج کریں۔"
            : "No active treatment record found. Please verify your phone number or Patient ID (e.g., HF-APT-1001)."
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        isUrdu 
          ? "سرور سے رابطہ کرنے میں ناکامی۔ دوبارہ کوشش کریں۔"
          : "Failed to communicate with the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to render treatment status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold font-sans">
            <CheckCircle className="w-3.5 h-3.5" />
            {isUrdu ? 'کامیاب علاج / شفایاب' : 'Fully Healed & Completed'}
          </span>
        );
      case 'follow-up':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold font-sans animate-pulse">
            <Activity className="w-3.5 h-3.5" />
            {isUrdu ? 'زیرِ علاج / فالو اپ جاری' : 'Under Treatment / Follow-up'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold font-sans">
            <Clock className="w-3.5 h-3.5" />
            {isUrdu ? 'ابتدائی معائنہ کیلئے زیرِ التواء' : 'Pending Diagnosis'}
          </span>
        );
    }
  };

  return (
    <section id="patient-portal-section" className="py-20 sm:py-24 bg-slate-50 overflow-hidden min-h-[750px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold uppercase tracking-wider mb-3"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'مریضوں کا ریکارڈ اور شفا کارڈ پورٹل' : 'Spiritual Healing & Patient Portal'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight ${
              isUrdu ? 'font-urdu leading-snug text-3xl sm:text-4xl' : 'font-sans'
            }`}
          >
            {isUrdu ? 'اپنا شفا کارڈ تلاش کریں' : 'Track Your Spiritual Treatment'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed ${
              isUrdu ? 'font-urdu leading-loose text-sm' : 'font-sans'
            }`}
          >
            {isUrdu 
              ? "اپنے جسمانی و روحانی امراض (جادو، جنات، نظرِ بد، بندش) کے شرعی علاج کی تفصیلات، تجویز کردہ وظائف اور شفا کی صورتحال معلوم کرنے کیلئے اپنا رجسٹرڈ فون نمبر یا مریض کارڈ نمبر درج کریں۔"
              : "Enter your registered Mobile Number or Patient ID (e.g., 03152204134 or HF-APT-1001) to securely view your diagnostics, Ruqyah prescription, and healing progress."
            }
          </motion.p>
        </div>

        {/* Search Panel Box */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-10"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isUrdu ? "موبائل نمبر یا مریض آئی ڈی درج کریں (مثلاً 03152204134)" : "Enter Phone, Email or Patient ID (e.g., 03152204134)"}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm transition-all ${
                  isUrdu ? 'font-urdu' : 'font-sans'
                }`}
              />
            </div>
            <button
              type="submit"
              className={`bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer ${
                isUrdu ? 'font-urdu' : 'font-sans'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{isUrdu ? 'تلاش کریں' : 'Retrieve Record'}</span>
            </button>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center text-xs text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isUrdu ? 'ٹیسٹ کیلئے نمونہ ڈیٹا:' : 'For Testing (Demo Data):'}</span>
            <button 
              type="button"
              onClick={() => { setSearchQuery('03152204134'); }} 
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-[11px]"
            >
              03152204134 (Muhammad Ali)
            </button>
            <button 
              type="button"
              onClick={() => { setSearchQuery('03215556789'); }} 
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-[11px]"
            >
              03215556789 (Amina Begum)
            </button>
            <button 
              type="button"
              onClick={() => { setSearchQuery('HF-APT-1003'); }} 
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-[11px]"
            >
              HF-APT-1003 (Zainab Fatimah)
            </button>
          </div>
        </motion.div>

        {/* Display Search Results */}
        <AnimatePresence mode="wait">
          {selectedPatient ? (
            <motion.div
              key="patient-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* STUNNING EMERALD SPIRITUAL HEALING CARD */}
              <div 
                id="printable-healing-card"
                className="bg-white rounded-3xl border-2 border-emerald-600/30 overflow-hidden shadow-md print:border-none print:shadow-none"
              >
                
                {/* Card Header Frame */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center justify-center translate-x-12">
                    <Sparkles className="w-64 h-64 text-white" />
                  </div>
                  
                  <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className={`text-center sm:text-left ${isUrdu ? 'sm:text-right' : ''}`}>
                      <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'مریض روحانی شفا کارڈ' : 'Spiritual Healing & Protection Card'}
                      </h3>
                      <p className="text-emerald-200 text-[11px] font-sans font-medium tracking-widest uppercase mt-1">
                        Hasnain Foundation • Surjani Town Karachi
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-end">
                      <span className="text-[10px] uppercase font-bold text-emerald-300 font-sans tracking-wider">
                        {isUrdu ? 'مریض کارڈ آئی ڈی' : 'Patient ID'}
                      </span>
                      <span className="font-mono text-base font-black tracking-wider bg-emerald-950/40 text-emerald-200 px-3 py-1 rounded-lg mt-1 border border-emerald-700/50">
                        {selectedPatient.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body Frame */}
                <div className="p-6 sm:p-8 space-y-8">
                  
                  {/* Grid 1: Patient Identity */}
                  <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-100 ${
                    isUrdu ? 'md:flex-row-reverse' : ''
                  }`}>
                    
                    {/* Patient Photo Avatar */}
                    <div className="md:col-span-3 flex justify-center">
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 flex items-center justify-center">
                        {selectedPatient.photo ? (
                          <img 
                            src={selectedPatient.photo} 
                            alt={selectedPatient.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-slate-300" />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-emerald-700 text-white text-[9px] font-bold text-center py-0.5 font-sans">
                          {isUrdu ? 'تصدیق شدہ' : 'VERIFIED'}
                        </div>
                      </div>
                    </div>

                    {/* Patient Particulars */}
                    <div className="md:col-span-9 grid grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className={`space-y-1 ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <span className="text-slate-400 font-medium">{isUrdu ? 'نام مریض' : 'Patient Name'}</span>
                        <p className={`font-bold text-slate-950 text-base ${isUrdu ? 'font-urdu' : ''}`}>{selectedPatient.name}</p>
                      </div>

                      <div className={`space-y-1 ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <span className="text-slate-400 font-medium">{isUrdu ? 'والد/شوہر کا نام' : "Father/Husband's Name"}</span>
                        <p className={`font-bold text-slate-800 ${isUrdu ? 'font-urdu' : ''}`}>{selectedPatient.fatherName || 'N/A'}</p>
                      </div>

                      <div className={`space-y-1 ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <span className="text-slate-400 font-medium">{isUrdu ? 'عمر / جنس' : 'Age / Gender'}</span>
                        <p className="font-semibold text-slate-800">
                          {selectedPatient.age} {isUrdu ? 'سال' : 'Years'} • {
                            selectedPatient.gender === 'Male' 
                              ? (isUrdu ? 'مرد' : 'Male') 
                              : (isUrdu ? 'خواتین' : 'Female')
                          }
                        </p>
                      </div>

                      <div className={`space-y-1 ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <span className="text-slate-400 font-medium">{isUrdu ? 'مقام / شہر' : 'City / Country'}</span>
                        <p className="font-semibold text-slate-800">{selectedPatient.city}, {selectedPatient.country}</p>
                      </div>

                      <div className={`space-y-1 ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <span className="text-slate-400 font-medium">{isUrdu ? 'رجسٹریشن کی تاریخ' : 'Registration Date'}</span>
                        <p className="font-mono font-semibold text-slate-600 text-xs">{selectedPatient.registeredAt || 'N/A'}</p>
                      </div>

                      <div className={`space-y-1 ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <span className="text-slate-400 font-medium">{isUrdu ? 'علاج کی صورتحال' : 'Healing Status'}</span>
                        <div className="block mt-0.5">{getStatusBadge(selectedPatient.status)}</div>
                      </div>
                    </div>

                  </div>

                  {/* Diagnostic Block */}
                  <div className={`p-4 rounded-xl bg-slate-50 border border-slate-100 ${
                    isUrdu ? 'text-right' : 'text-left'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-2 justify-start">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <h4 className={`text-sm font-bold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
                        {isUrdu ? 'تشخیص و مرض کی تفصیل' : 'Primary Spiritual Assessment & Symptoms'}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs sm:text-sm mt-3">
                      <div className="sm:col-span-4 font-semibold text-emerald-800">
                        {isUrdu ? 'مرض / شکایت:' : 'Reason / Topic:'}
                      </div>
                      <div className={`sm:col-span-8 font-bold text-slate-900 ${isUrdu ? 'font-urdu text-base' : ''}`}>
                        {selectedPatient.reason}
                      </div>

                      <div className="sm:col-span-4 font-semibold text-slate-400 mt-2">
                        {isUrdu ? 'علائم اور تفصیل:' : 'Patient Description:'}
                      </div>
                      <div className={`sm:col-span-8 text-slate-600 italic mt-2 ${isUrdu ? 'font-urdu text-sm leading-loose' : ''}`}>
                        "{selectedPatient.description}"
                      </div>
                    </div>
                  </div>

                  {/* Spiritual Treatment Prescription Notes */}
                  <div className={`p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3 ${
                    isUrdu ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`flex items-center gap-1.5 justify-start ${isUrdu ? 'flex-row-reverse' : ''}`}>
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <h4 className={`text-sm font-black text-emerald-950 ${isUrdu ? 'font-urdu text-base' : ''}`}>
                        {isUrdu ? 'شرعی علاج اور نسخہ شفا' : 'Prescribed Shariah Ruqyah Treatment & Prayers'}
                      </h4>
                    </div>

                    <p className={`text-xs sm:text-sm text-slate-700 leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : ''}`}>
                      {selectedPatient.treatmentNotes || (isUrdu 
                        ? 'ابتدائی معائنہ زیرِ التواء ہے۔ شیخِ محترم کی طرف سے جائزہ لینے کے بعد نسخہ یہاں شائع کر دیا جائے گا۔'
                        : 'Initial spiritual assessment is pending. Once reviewed by the Sheikh, your Quranic prescription will be published here.')}
                    </p>

                    {selectedPatient.followUpNotes && (
                      <div className="mt-4 pt-4 border-t border-emerald-100">
                        <span className={`block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 ${isUrdu ? 'font-urdu' : ''}`}>
                          {isUrdu ? 'فالو اپ اور ہدایات:' : 'Follow-up Notes & Care Instructions:'}
                        </span>
                        <p className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : ''}`}>
                          {selectedPatient.followUpNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Protective Duas Block (Always Printed for Barakah) */}
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center space-y-2 bg-slate-50/30">
                    <p className="text-xs font-serif text-slate-500 italic">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ"
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {isUrdu 
                        ? "نبی کریم ﷺ کا فرمان ہے: 'مصیبت کے وقت عافیت تلاش کرو اور دعاؤں کے ذریعے شفا مانگو۔' اللہ تمام مریضوں کو شفائے کاملہ عطا فرمائے۔"
                        : "Quranic Healing: 'And We send down of the Quran that which is a healing and a mercy to those who believe.' (Al-Isra: 82)"}
                    </p>
                  </div>

                </div>

                {/* Card Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400 font-sans flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    {isUrdu ? 'محفوظ شرعی ہیلنگ کارڈ' : 'Secured Ruqyah Health Record'}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 active:scale-95 transition-all rounded-lg cursor-pointer text-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'پرنٹ کارڈ' : 'Print Healing Card'}</span>
                    </button>
                    <a
                      href={`https://wa.me/923180202424?text=${encodeURIComponent(
                        isUrdu 
                          ? `السلام علیکم، میں حسنین فاؤنڈیشن مریض کارڈ آئی ڈی: ${selectedPatient.id} کے حوالے سے اپنے علاج کے بارے میں رہنمائی چاہتا ہوں۔`
                          : `Assalamu Alaikum, I would like guidance on my Ruqyah Treatment Card with ID: ${selectedPatient.id}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold hover:bg-emerald-700 active:scale-95 transition-all rounded-lg cursor-pointer text-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'واٹس ایپ رابطہ' : 'WhatsApp Consultation'}</span>
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : searched ? (
            <motion.div
              key="no-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center p-10 bg-white border border-slate-200 rounded-2xl shadow-sm"
            >
              <div className="w-16 h-16 bg-amber-50 border border-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className={`text-lg font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                {isUrdu ? 'کوئی مریض ریکارڈ نہیں ملا' : 'Record Not Found'}
              </h3>
              <p className={`text-slate-500 text-sm max-w-md mx-auto mt-2 leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                {errorMsg}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
                >
                  {isUrdu ? 'دوبارہ کوشش کریں' : 'Clear Search'}
                </button>
                <button
                  type="button"
                  onClick={onNavigateToBooking}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <span>{isUrdu ? 'نئی رجسٹریشن درج کریں' : 'Register as New Patient'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* Welcome / Onboard Portal state */
            <motion.div
              key="welcome-portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-6"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className={`text-base font-bold text-slate-800 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'مفت شرعی معائنہ اور کارڈ کی سہولت' : 'Retrieve Your Official Treatment Card'}
                </h3>
                <p className={`text-xs text-slate-500 leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                  {isUrdu 
                    ? "حسنین فاؤنڈیشن کے شرعی معائنہ سینٹر میں آنے والے ہر مریض کا تفصیلی ریکارڈ، قرآن و سنت کی روشنی میں شیخ کا نسخہ شفا اور آئندہ آنے کی تاریخ اس آن لائن پورٹل پر دستیاب رہتی ہے۔ تلاش کرنے کیلئے اپنا موبائل نمبر اوپر درج کریں۔"
                    : "Every patient examined by our Shariah Ruqyah center has their notes, protective prayers, and progress synced in real-time. Use the search bar above to look up your spiritual healing card."
                  }
                </p>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-center">
                <button
                  onClick={onNavigateToBooking}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 group"
                >
                  <span>{isUrdu ? 'شرعی معائنے کیلئے رجسٹریشن بکنگ کریں' : 'Book a New Spiritual Healing Session'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
