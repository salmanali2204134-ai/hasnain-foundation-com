/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, BookOpen, Calendar, ShieldCheck, Heart, AlertCircle, RefreshCw } from 'lucide-react';
import AppointmentSystem from './AppointmentSystem';
import KnowledgeLibrary from './KnowledgeLibrary';

interface SpiritualPortalModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'appointment' | 'library';
}

export default function SpiritualPortalModal({ lang, isOpen, onClose, initialTab = 'appointment' }: SpiritualPortalModalProps) {
  const isUrdu = lang === 'ur';
  const [activeTab, setActiveTab] = useState<'appointment' | 'library'>(initialTab);

  // Keep activeTab in sync when modal opens with a specific tab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Main container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl border border-slate-200 w-full max-w-6xl h-[92vh] md:h-[88vh] max-h-[950px] overflow-hidden shadow-2xl relative flex flex-col z-10"
        >
          
          {/* Top Header Panel */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 shrink-0 relative">
            
            {/* Close button top right (or left in RTL) */}
            <button
              onClick={onClose}
              className={`absolute top-4 sm:top-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer ${
                isUrdu ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
              }`}
              title={isUrdu ? 'بند کریں' : 'Close Portal'}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title and Badge */}
            <div className={`flex flex-col gap-2 ${isUrdu ? 'text-right items-start md:items-end' : 'text-left'}`}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isUrdu ? 'روحانی شفا خانہ و مسنون رہنمائی' : 'Spiritual Care Clinic & Guidance'}</span>
              </span>
              
              <h2 className={`text-xl sm:text-2xl font-black text-white tracking-tight ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                {isUrdu ? 'آن لائن استخارہ، دم اور اصلاحی رہنمائی پورٹل' : 'Online Istikhara & Spiritual Healing'}
              </h2>
            </div>
          </div>

          {/* Guarantee / Info Micro bar - Reassuring 100% Free services */}
          <div className="bg-amber-50 border-b border-amber-100 px-5 sm:px-6 py-3 shrink-0">
            <div className={`flex items-start md:items-center gap-3 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 md:mt-0" />
              <p className={`text-[11px] sm:text-xs text-amber-900 leading-relaxed font-semibold ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                {isUrdu 
                  ? 'اہلِ سنت والجماعت کے عقائد کے مطابق شرعی دم (رقیہ) اور استخارہ بالکل مفت۔ کوئی فیس یا ہدیہ نہیں لیا جاتا۔'
                  : 'All spiritual treatments, Quranic Ruqyah, and online Istikhara are provided 100% free of charge. We never demand money or gifts.'}
              </p>
            </div>
          </div>

          {/* Tabs Selector Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-3 shrink-0 flex items-center justify-between gap-4">
            <div className={`flex items-center gap-2 w-full sm:w-auto ${isUrdu ? 'flex-row-reverse' : ''}`}>
              
              {/* Tab 1: Appointment Booking */}
              <button
                onClick={() => setActiveTab('appointment')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  activeTab === 'appointment'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                } ${isUrdu ? 'font-urdu' : 'font-sans'}`}
              >
                <Calendar className="w-4 h-4" />
                <span>{isUrdu ? 'آن لائن استخارہ و دم کے لیے وقت لیں' : 'Book Istikhara / Ruqyah'}</span>
              </button>

              {/* Tab 2: Knowledge Library */}
              <button
                onClick={() => setActiveTab('library')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  activeTab === 'library'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                } ${isUrdu ? 'font-urdu' : 'font-sans'}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{isUrdu ? 'مسنون دعائیں اور رقیہ لائبریری' : 'Ruqyah Knowledge Library'}</span>
              </button>
            </div>

            <span className="hidden md:inline text-xs font-bold text-slate-400 uppercase font-sans">
              {isUrdu ? 'حسینی خدمتِ خلق' : 'Serving Humanity'}
            </span>
          </div>

          {/* Interactive Content Scrollable Body */}
          <div className="flex-grow overflow-y-auto bg-slate-50">
            <AnimatePresence mode="wait">
              {activeTab === 'appointment' ? (
                <motion.div
                  key="appointment-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 sm:p-4"
                >
                  <AppointmentSystem lang={lang} />
                </motion.div>
              ) : (
                <motion.div
                  key="library-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 sm:p-4"
                >
                  <KnowledgeLibrary lang={lang} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Modal Footer Bar */}
          <div className="bg-slate-100 px-5 sm:px-6 py-4 shrink-0 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className={`text-center sm:text-left text-[11px] text-slate-500 font-bold ${isUrdu ? 'sm:text-right font-urdu' : 'font-sans'}`}>
              {isUrdu
                ? 'کسی بھی شکایت یا فیس چارجنگ کی صورت میں فوری طور پر نیچے رابطہ کریں یا رپورٹ درج کریں۔'
                : 'Spiritual services are managed under strict moral guidelines. Read rules inside.'}
            </div>
            
            <button
              onClick={onClose}
              className={`px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs transition-all cursor-pointer ${
                isUrdu ? 'font-urdu' : ''
              }`}
            >
              {isUrdu ? 'بند کریں' : 'Close Portal'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
