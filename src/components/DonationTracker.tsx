/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Target, TrendingUp, Coins, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface DonationTrackerProps {
  lang: Language;
  onOpenAdmin?: () => void;
}

export default function DonationTracker({ lang, onOpenAdmin }: DonationTrackerProps) {
  const [goal, setGoal] = useState<number>(25000000);
  const [raised, setRaised] = useState<number>(19450000);
  const isUrdu = lang === 'ur';

  // Load tracker values from localStorage on mount and periodically
  useEffect(() => {
    const storedGoal = localStorage.getItem('hasnain_donation_goal');
    const storedRaised = localStorage.getItem('hasnain_donation_raised');
    
    if (storedGoal) setGoal(Number(storedGoal));
    if (storedRaised) setRaised(Number(storedRaised));

    // Event listener to synchronize changes in real-time across components
    const handleStorageChange = () => {
      const g = localStorage.getItem('hasnain_donation_goal');
      const r = localStorage.getItem('hasnain_donation_raised');
      if (g) setGoal(Number(g));
      if (r) setRaised(Number(r));
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event dispatch for same-window updates
    window.addEventListener('donation_tracker_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('donation_tracker_updated', handleStorageChange);
    };
  }, []);

  const percentage = Math.min(100, Math.round((raised / goal) * 100)) || 0;

  return (
    <div id="donation-goal-tracker-card" className="bg-gradient-to-br from-emerald-900 to-slate-950 text-white rounded-xl p-6 sm:p-8 border border-emerald-800 shadow-xl relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />

      {/* Decorative Golden Badge */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full border border-amber-400/20 rotate-45 -z-10" />

      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 ${
        isUrdu ? 'md:flex-row-reverse' : ''
      }`}>
        
        {/* Core details */}
        <div className={`space-y-2 flex-1 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-800/60 border border-emerald-700/50 text-[11px] font-bold uppercase tracking-wider ${
            isUrdu ? 'flex-row-reverse font-urdu' : 'font-sans'
          }`}>
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isUrdu ? 'مجموعی عطیہ کا ہدف ۲۰۲۶ء' : 'Annual Welfare & Construction Goal 2026'}
            </span>
          </div>

          <h3 className={`text-xl sm:text-2xl font-black tracking-tight text-white ${
            isUrdu ? 'font-urdu leading-snug' : 'font-sans'
          }`}>
            {isUrdu 
              ? 'انسانیت کی فلاح اور مسجد کی تعمیر کا مجموعی فنڈ ٹریکر' 
              : 'Our Collective Welfare & Construction Progress'}
          </h3>

          <p className={`text-xs sm:text-sm text-emerald-200/80 max-w-xl leading-relaxed ${
            isUrdu ? 'font-urdu leading-loose text-emerald-200/90' : 'font-sans'
          }`}>
            {isUrdu 
              ? 'یہ ٹریکر حسنین فاؤنڈیشن کے تمام فعال منصوبوں بشمول جامع مسجد عبدالقادر جیلانی کی تعمیر اور روزانہ راشن مہم کی مجموعی مالیاتی صورتحال کو ظاہر کرتا ہے۔'
              : 'This tracker displays the combined fundraising progress for all Hasnain Foundation projects, including mosque construction, food drives, and clean water operations.'}
          </p>
        </div>

        {/* Dynamic percentage display */}
        <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl p-4 min-w-[120px] self-start md:self-center">
          <span className="text-amber-400"><TrendingUp className="w-6 h-6 animate-pulse" /></span>
          <span className="font-mono text-3xl font-black text-white mt-1">{percentage}%</span>
          <span className={`text-[10px] text-emerald-300 font-bold uppercase tracking-widest mt-1 ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu ? 'مکمل شدہ' : 'Completed'}
          </span>
        </div>

      </div>

      {/* Visual Progress Bar Container */}
      <div className="mt-8 space-y-3 relative z-10">
        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-emerald-950 p-0.5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 rounded-full relative"
          >
            {/* Visual shine effect on progress bar */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>

        {/* Amount Raised vs Goal Details Row */}
        <div className={`flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 text-xs sm:text-sm font-sans pt-1 ${
          isUrdu ? 'sm:flex-row-reverse' : ''
        }`}>
          
          {/* Raised */}
          <div className={`flex items-center gap-2.5 p-2 px-3 rounded-lg bg-emerald-900/50 border border-emerald-800/40 ${
            isUrdu ? 'flex-row-reverse text-right' : 'text-left'
          }`}>
            <Coins className="w-4 h-4 text-emerald-400" />
            <div>
              <span className={`block text-[10px] text-emerald-300 font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'جمع شدہ رقم' : 'Amount Raised'}
              </span>
              <span className="font-mono font-extrabold text-white text-base">
                PKR {raised.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Goal */}
          <div className={`flex items-center gap-2.5 p-2 px-3 rounded-lg bg-slate-900/50 border border-slate-800/60 ${
            isUrdu ? 'flex-row-reverse text-right' : 'text-left'
          }`}>
            <Target className="w-4 h-4 text-amber-400" />
            <div>
              <span className={`block text-[10px] text-slate-400 font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'کل ہدف' : 'Target Goal'}
              </span>
              <span className="font-mono font-extrabold text-white text-base">
                PKR {goal.toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Admin Button Hint */}
      {onOpenAdmin && (
        <div className={`mt-5 pt-3 border-t border-white/5 flex ${isUrdu ? 'justify-start' : 'justify-end'}`}>
          <button
            onClick={onOpenAdmin}
            className="text-[10px] sm:text-xs text-emerald-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer font-sans"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isUrdu ? 'ایڈمن ٹول: ہدف اور رقم تبدیل کریں' : 'Update Goal & Raised Amount (Admin Tool)'}
            </span>
          </button>
        </div>
      )}

    </div>
  );
}
