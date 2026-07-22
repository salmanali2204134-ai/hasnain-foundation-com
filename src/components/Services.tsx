/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types';
import { DICTIONARY, SERVICES_DATA } from '../data';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesProps {
  lang: Language;
  onOpenSpiritual?: () => void;
}

// Map strings to Lucide components safely
function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'Soup': return Icons.Soup;
    case 'HandCoins': return Icons.HandCoins;
    case 'GraduationCap': return Icons.GraduationCap;
    case 'HeartHandshake': return Icons.HeartHandshake;
    case 'Church': return Icons.Home; // Elegant Mosque building representation fallback
    case 'Users': return Icons.Users;
    case 'HeartPulse': return Icons.HeartPulse;
    case 'Megaphone': return Icons.Megaphone;
    case 'Sparkles': return Icons.Sparkles;
    default: return Icons.Heart;
  }
}

export default function Services({ lang, onOpenSpiritual }: ServicesProps) {
  const isUrdu = lang === 'ur';

  return (
    <section id="services-section" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs sm:text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Icons.HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'ہماری فلاحی خدمات' : 'Welfare Services'}
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
            {DICTIONARY.services.title[lang]}
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
            {DICTIONARY.services.subtitle[lang]}
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_DATA.map((service, index) => {
            const IconComponent = getIconComponent(service.iconName);
            const isSpiritualCard = service.id === 'spiritual-healing' || service.isPremium;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => {
                  if (isSpiritualCard && onOpenSpiritual) {
                    onOpenSpiritual();
                  }
                }}
                className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between ${
                  isSpiritualCard
                    ? 'border-amber-400/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 shadow-md hover:shadow-xl hover:border-amber-500 cursor-pointer border-2 ring-1 ring-amber-300/30'
                    : 'border-slate-200 bg-white hover:border-emerald-600 hover:shadow-md'
                } ${isUrdu ? 'text-right' : 'text-left'}`}
              >
                {/* Premium Card Special Badge */}
                {isSpiritualCard && (
                  <div className={`absolute top-4 ${isUrdu ? 'left-4' : 'right-4'}`}>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                      <Icons.Sparkles className="w-3 h-3 fill-slate-950" />
                      <span>{isUrdu ? 'مفت شرعی خدمت' : '100% Free Service'}</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Icon Emblem */}
                  <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center transition-all duration-200 mb-5 ${
                    isSpiritualCard
                      ? 'bg-amber-500 text-slate-950 shadow-sm border border-amber-400 group-hover:scale-105'
                      : 'bg-emerald-50 border border-emerald-100 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700'
                  } ${isUrdu ? 'ml-auto' : ''}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-black text-slate-900 leading-tight mb-2.5 transition-colors duration-150 ${
                    isSpiritualCard ? 'text-amber-950 group-hover:text-amber-800' : 'group-hover:text-emerald-800'
                  } ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {service.title[lang]}
                  </h3>

                  {/* Description */}
                  <p className={`text-slate-600 text-xs sm:text-sm leading-relaxed ${
                    isUrdu ? 'font-urdu leading-loose' : 'font-sans'
                  }`}>
                    {service.description[lang]}
                  </p>
                </div>

                {/* Card Action Link for Spiritual Healing */}
                {isSpiritualCard && (
                  <div className={`mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-950 ${
                    isUrdu ? 'flex-row-reverse font-urdu' : 'font-sans'
                  }`}>
                    <span>{isUrdu ? 'آن لائن استخارہ و وقت لیں ←' : 'Book Istikhara & Healing →'}</span>
                    <Icons.ArrowRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${isUrdu ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
