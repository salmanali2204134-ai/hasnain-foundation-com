/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types';
import { motion } from 'motion/react';
import { 
  Heart, 
  UserCheck, 
  Sparkles, 
  CreditCard, 
  Target, 
  PhoneCall 
} from 'lucide-react';

interface MobileQuickNavigationProps {
  lang: Language;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenSpiritual: () => void;
}

export default function MobileQuickNavigation({ 
  lang, 
  activeSection, 
  setActiveSection, 
  onOpenSpiritual 
}: MobileQuickNavigationProps) {
  const isUrdu = lang === 'ur';

  // Navigation Items with 3 buttons on the left side and 3 buttons on the right side
  const leftSideItems = [
    {
      id: 'donate',
      labelEn: 'Quick Donate',
      labelUr: 'فوری عطیہ',
      icon: Heart,
      color: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-100',
      iconColor: 'text-rose-500 fill-rose-500/10',
      action: () => setActiveSection('donate')
    },
    {
      id: 'durood-bank',
      labelEn: 'Durood Bank',
      labelUr: 'درود بینک',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200',
      iconColor: 'text-amber-600',
      action: () => setActiveSection('durood-bank')
    },
    {
      id: 'projects',
      labelEn: 'Welfare Projects',
      labelUr: 'فلاحی منصوبے',
      icon: Target,
      color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100',
      iconColor: 'text-emerald-500',
      action: () => setActiveSection('projects')
    }
  ];

  const rightSideItems = [
    {
      id: 'spiritual',
      labelEn: 'Spiritual Healing',
      labelUr: 'روحانی علاج',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-300',
      iconColor: 'text-amber-600',
      action: onOpenSpiritual
    },
    {
      id: 'patient-portal',
      labelEn: 'Patient Portal',
      labelUr: 'مریض پورٹل',
      icon: UserCheck,
      color: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-100',
      iconColor: 'text-sky-500',
      action: () => setActiveSection('patient-portal')
    },
    {
      id: 'contact',
      labelEn: 'Contact Us',
      labelUr: 'رابطہ کریں',
      icon: PhoneCall,
      color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100',
      iconColor: 'text-indigo-500',
      action: () => setActiveSection('contact')
    }
  ];

  return (
    <div id="mobile-quick-nav-container" className="lg:hidden w-full px-4 pt-4 pb-2 bg-slate-50">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/60 shadow-sm">
        
        {/* Subtle section descriptor */}
        <div className={`mb-3 flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] font-extrabold tracking-wider text-emerald-700 uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            <span>{isUrdu ? 'فوری نیویگیشن پورٹل' : 'Quick Navigation'}</span>
          </span>
          <span className="text-[9px] text-slate-400 font-medium">
            {isUrdu ? 'پورٹل سروسز' : 'Welfare & Spiritual Hub'}
          </span>
        </div>

        {/* The 3-Button on Each Side dual column grid layout */}
        <div className={`grid grid-cols-2 gap-3 ${isUrdu ? 'direction-rtl' : 'direction-ltr'}`}>
          
          {/* Left Side Navigation (Column 1) */}
          <div className="flex flex-col gap-2.5">
            {leftSideItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={item.action}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-2.5 p-3 rounded-xl border text-[13px] font-black tracking-tight transition-all duration-150 cursor-pointer ${item.color} ${
                    isUrdu ? 'flex-row-reverse text-right font-urdu' : 'flex-row text-left font-sans'
                  }`}
                  id={`mobile-quick-left-${item.id}`}
                >
                  <div className={`p-1.5 rounded-lg bg-white shadow-sm shrink-0 ${item.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex-grow leading-tight truncate">
                    {isUrdu ? item.labelUr : item.labelEn}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Side Navigation (Column 2) */}
          <div className="flex flex-col gap-2.5">
            {rightSideItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={item.action}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-2.5 p-3 rounded-xl border text-[13px] font-black tracking-tight transition-all duration-150 cursor-pointer ${item.color} ${
                    isUrdu ? 'flex-row-reverse text-right font-urdu' : 'flex-row text-left font-sans'
                  }`}
                  id={`mobile-quick-right-${item.id}`}
                >
                  <div className={`p-1.5 rounded-lg bg-white shadow-sm shrink-0 ${item.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex-grow leading-tight truncate">
                    {isUrdu ? item.labelUr : item.labelEn}
                  </span>
                </motion.button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
