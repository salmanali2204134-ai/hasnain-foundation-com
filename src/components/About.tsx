/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { DICTIONARY, IMAGES } from '../data';
import { Heart, Landmark, Target, Award, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AboutProps {
  lang: Language;
}

export default function About({ lang }: AboutProps) {
  const isUrdu = lang === 'ur';
  const [showValues, setShowValues] = useState(false);

  const valuesIcons = [Heart, Landmark, Target, Award, CheckCircle2];

  return (
    <section id="about-us-section" className="py-20 sm:py-24 bg-slate-50 overflow-hidden">
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
            <Landmark className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'تعارفِ فاؤنڈیشن' : 'Foundation Overview'}
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
            {DICTIONARY.about.title[lang]}
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
            {DICTIONARY.about.subtitle[lang]}
          </motion.p>
        </div>

        {/* Narrative & Visual Box */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
          isUrdu ? 'lg:flex-row-reverse' : ''
        }`}>
          
          {/* Main Story Text */}
          <motion.div
            initial={{ opacity: 0, x: isUrdu ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`lg:col-span-7 space-y-6 ${isUrdu ? 'text-right' : 'text-left'}`}
          >
            <p className={`text-slate-600 text-base leading-relaxed sm:leading-loose ${
              isUrdu ? 'font-urdu' : 'font-sans'
            }`}>
              {DICTIONARY.about.description[lang]}
            </p>
            
            {/* Direct Quran Quote Accent */}
            <div className="relative p-5 sm:p-6 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-start gap-4">
              <span className="text-4xl text-emerald-700 leading-none select-none font-serif">“</span>
              <div>
                <p className={`text-slate-700 italic text-sm sm:text-base leading-relaxed ${
                  isUrdu ? 'font-urdu' : 'font-sans'
                }`}>
                  {isUrdu 
                    ? "اور جو شخص کسی کی جان بچاتا ہے تو گویا اس نے تمام لوگوں کی جان بچائی۔ (القرآن)" 
                    : "And whoever saves one life - it is as if he had saved mankind entirely. (Al-Quran, 5:32)"}
                </p>
                <span className="block mt-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {isUrdu ? 'القرآن الکریم' : 'Holy Quran'}
                </span>
              </div>
            </div>

            {/* Visual Photo of Volunteers */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-xl overflow-hidden border border-slate-200 h-64 sm:h-72 shadow-sm"
            >
              <img
                src={IMAGES.aboutVolunteers}
                alt="Hasnain Foundation Volunteers"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className={`absolute bottom-4 ${isUrdu ? 'right-4 text-right' : 'left-4 text-left'} text-white px-4`}>
                <span className={`inline-block text-[10px] font-bold tracking-wider bg-emerald-700/90 px-2 py-0.5 rounded ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'ہمارے مخلص رضاکار' : 'Our Dedicated Volunteers'}
                </span>
                <p className={`text-xs text-slate-200 mt-1.5 font-semibold ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'کراچی میں فلاحی سرگرمیوں کے دوران ایک یادگار لمحہ' : 'Serving the community with devotion in Karachi, Pakistan'}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Side-by-side Mission & Vision Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`p-6 sm:p-8 rounded-xl bg-white border border-slate-200 transition-colors duration-200 group ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
            >
              <div className={`flex items-center gap-3.5 mb-4 relative z-10 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className={`text-lg sm:text-lg font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {DICTIONARY.about.mission[lang]}
                </h3>
              </div>
              <p className={`text-slate-500 text-sm leading-relaxed relative z-10 ${
                isUrdu ? 'font-urdu leading-loose' : 'font-sans'
              }`}>
                {DICTIONARY.about.missionText[lang]}
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={`p-6 sm:p-8 rounded-xl bg-white border border-slate-200 transition-colors duration-200 group ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
            >
              <div className={`flex items-center gap-3.5 mb-4 relative z-10 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className={`text-lg sm:text-lg font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {DICTIONARY.about.vision[lang]}
                </h3>
              </div>
              <p className={`text-slate-500 text-sm leading-relaxed relative z-10 ${
                isUrdu ? 'font-urdu leading-loose' : 'font-sans'
              }`}>
                {DICTIONARY.about.visionText[lang]}
              </p>
            </motion.div>

          </div>
        </div>

        {/* Core Values Section (Hidden until clicked) */}
        <div className="mt-20 pt-14 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto">
            
            {/* Interactive Toggle Button for Core Values */}
            <button
              id="our-core-values-btn"
              onClick={() => setShowValues(!showValues)}
              className={`inline-flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-white hover:bg-emerald-50/80 border-2 ${
                showValues ? 'border-emerald-600 bg-emerald-50/50 shadow-md' : 'border-slate-200 shadow-sm'
              } text-slate-900 transition-all cursor-pointer group active:scale-98`}
            >
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
              </div>

              <div className={isUrdu ? 'text-right' : 'text-left'}>
                <h3 className={`text-lg sm:text-xl font-black ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {DICTIONARY.about.coreValues[lang]}
                </h3>
                <span className={`block text-xs font-semibold text-emerald-800 mt-0.5 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {showValues 
                    ? (isUrdu ? 'بنیادی اقدار چھپانے کے لیے کلک کریں' : 'Click to collapse values') 
                    : (isUrdu ? 'بنیادی اقدار دیکھنے کے لیے کلک کریں' : 'Click to display our core values')}
                </span>
              </div>

              <div className={`p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors ${
                isUrdu ? 'mr-2' : 'ml-2'
              }`}>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showValues ? 'rotate-180' : ''}`} />
              </div>
            </button>
          </div>

          {/* Collapsible Values Grid */}
          <AnimatePresence>
            {showValues && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 pt-2">
                  {DICTIONARY.about.valuesList.map((val, idx) => {
                    const ValIcon = valuesIcons[idx] || CheckCircle2;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.06 }}
                        className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
                      >
                        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl mb-4 border border-emerald-100 shadow-none">
                          <ValIcon className="w-5 h-5 text-emerald-700" />
                        </div>
                        <h4 className={`text-base font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                          {val.title[lang]}
                        </h4>
                        <p className={`text-slate-500 text-xs mt-2 leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                          {val.desc[lang]}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
