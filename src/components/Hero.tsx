/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types';
import { DICTIONARY, IMAGES } from '../data';
import { Heart, Send, Users, ShieldCheck, Star, Sparkles, Video } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  lang: Language;
  onDonateClick: () => void;
  onDuroodClick?: () => void;
  onReelsClick?: () => void;
}

export default function Hero({ lang, onDonateClick, onDuroodClick, onReelsClick }: HeroProps) {
  const isUrdu = lang === 'ur';

  // Statistics items
  const stats = [
    {
      id: 'families',
      number: '50,000+',
      numberUr: '۵۰,۰۰۰+',
      label: DICTIONARY.stats.families[lang],
      icon: Users,
      color: 'border-emerald-500 text-emerald-600 bg-emerald-50'
    },
    {
      id: 'projects',
      number: '150+',
      numberUr: '۱۵۰+',
      label: DICTIONARY.stats.projects[lang],
      icon: ShieldCheck,
      color: 'border-amber-500 text-amber-600 bg-amber-50'
    },
    {
      id: 'programs',
      number: '500+',
      numberUr: '۵۰۰+',
      label: DICTIONARY.stats.programs[lang],
      icon: Star,
      color: 'border-royal-500 text-royal-600 bg-royal-50'
    },
    {
      id: 'volunteers',
      number: '1,200+',
      numberUr: '۱,۲۰۰+',
      label: DICTIONARY.stats.volunteers[lang],
      icon: Sparkles,
      color: 'border-emerald-500 text-emerald-600 bg-emerald-50'
    }
  ];

  return (
    <div className="relative">
      {/* Immersive Hero Section Container */}
      <section 
        id="hero-section"
        className="relative min-h-[85vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 bg-slate-900"
      >
        {/* Background Image with Dark Emerald Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.heroBg}
            alt="Hasnain Foundation Hero"
            className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-slate-950/95 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-emerald-950/30" />
        </div>

        {/* Floating Abstract Islamic Geometry Accents */}
        <div className="absolute inset-0 pointer-events-none opacity-10 z-0 flex items-center justify-center">
          <svg className="w-[500px] h-[500px] text-amber-400" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L55 35 L85 30 L60 50 L85 70 L55 65 L50 100 L45 65 L15 70 L40 50 L15 30 L45 35 Z" />
          </svg>
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          {/* Animated Little Islamic Motif */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-6 text-xs sm:text-xs font-bold uppercase tracking-widest mx-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'الْحَمْدُ لِلّٰهِ - انسانیت اول' : 'Alhamdulillah - Serving with Faith'}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto ${
              isUrdu ? 'font-urdu leading-snug text-4xl sm:text-5xl md:text-6xl text-emerald-50' : 'font-sans'
            }`}
          >
            {DICTIONARY.hero.title[lang]}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto mt-6 leading-relaxed ${
              isUrdu ? 'font-urdu leading-loose text-base sm:text-lg text-slate-200' : 'font-sans'
            }`}
          >
            {DICTIONARY.hero.subtitle[lang]}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 ${
              isUrdu ? 'sm:flex-row-reverse' : ''
            }`}
          >
            {/* 1. Durood Bank Premium Button (Top / First) */}
            {onDuroodClick && (
              <button
                id="hero-durood-btn"
                onClick={onDuroodClick}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-base border border-amber-400 hover:border-amber-500 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.98] ${
                  isUrdu ? 'font-urdu' : 'font-sans'
                }`}
              >
                <Sparkles className="w-4 h-4 text-slate-950 animate-pulse fill-slate-950/20" />
                <span>{isUrdu ? '📿 درود بینک' : 'Durood Bank'}</span>
              </button>
            )}

            {/* 2. Primary Donate Button (Second) */}
            <button
              id="hero-donate-btn"
              onClick={onDonateClick}
              className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base border border-emerald-700 hover:border-emerald-800 transition-colors cursor-pointer ${
                isUrdu ? 'font-urdu' : 'font-sans'
              }`}
            >
              <Heart className="w-4 h-4 fill-current text-white/90" />
              <span>{DICTIONARY.general.donateNow[lang]}</span>
            </button>

            {/* 3. Secondary WhatsApp Button (Third) */}
            <a
              id="hero-whatsapp-btn"
              href={`https://wa.me/923180202424?text=${encodeURIComponent(DICTIONARY.general.whatsappDonationAlert[lang])}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-base border border-white/20 transition-colors cursor-pointer backdrop-blur-sm ${
                isUrdu ? 'font-urdu' : 'font-sans'
              }`}
            >
              <Send className="w-4 h-4 text-emerald-400 rotate-45 sm:rotate-0" />
              <span>{DICTIONARY.general.whatsappContact[lang]}</span>
            </a>
          </motion.div>
        </div>

        {/* Decorative Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-[25px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,42.4V120H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Floating Statistics Section */}
      <section 
        id="statistics-bar" 
        className="relative z-20 max-w-6xl mx-auto -mt-10 px-4"
      >
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all duration-200 ${
                    isUrdu ? 'flex-row-reverse text-right' : 'text-left'
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 flex-shrink-0 border border-emerald-100">
                    <StatIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                      {isUrdu ? stat.numberUr : stat.number}
                    </h3>
                    <p className={`text-xs text-slate-500 font-bold mt-0.5 ${
                      isUrdu ? 'font-urdu leading-none' : 'font-sans'
                    }`}>
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
