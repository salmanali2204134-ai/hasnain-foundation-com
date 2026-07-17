/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, Event } from '../types';
import { DICTIONARY, EVENTS_DATA } from '../data';
import { Calendar, Clock, MapPin, Sparkles, Send, FlameKindling, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventsProps {
  lang: Language;
}

export default function Events({ lang }: EventsProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const isUrdu = lang === 'ur';

  // Filter events
  const filteredEvents = EVENTS_DATA.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const handleEnquire = (title: string) => {
    const text = encodeURIComponent(
      isUrdu 
        ? `السلام علیکم! میں حسنین فاؤنڈیشن کی تقریب "${title}" کے بارے میں معلومات حاصل کرنا چاہتا ہوں۔` 
        : `Assalam-o-Alaikum! I would like to get information regarding the event: "${title}".`
    );
    window.open(`https://wa.me/923180202424?text=${text}`, '_blank');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conference': return 'bg-amber-550 text-amber-700 bg-amber-50 border-amber-200';
      case 'gathering': return 'bg-emerald-550 text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'naat': return 'bg-royal-550 text-royal-700 bg-royal-50 border-royal-200';
      case 'welfare': return 'bg-rose-550 text-rose-700 bg-rose-50 border-rose-200';
      default: return 'bg-slate-550 text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    if (isUrdu) {
      switch (category) {
        case 'conference': return 'خصوصی کانفرنس';
        case 'gathering': return 'مذہبی اجتماع';
        case 'naat': return 'محفلِ نعت';
        case 'welfare': return 'فلاحی مہم';
        default: return 'تقریب';
      }
    } else {
      switch (category) {
        case 'conference': return 'Spiritual Conference';
        case 'gathering': return 'Weekly Gathering';
        case 'naat': return 'Naat Mehfil';
        case 'welfare': return 'Welfare Event';
        default: return 'Event';
      }
    }
  };

  return (
    <section id="events-section" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs sm:text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'مذہبی و فلاحی اجتماعات' : 'Spiritual & Welfare Gatherings'}
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
            {DICTIONARY.events.title[lang]}
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
            {DICTIONARY.events.subtitle[lang]}
          </motion.p>
        </div>

        {/* Filters Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {[
            { id: 'all', label: DICTIONARY.gallery.all[lang] },
            { id: 'upcoming', label: DICTIONARY.events.upcoming[lang] },
            { id: 'completed', label: DICTIONARY.events.past[lang] }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-5 py-2 rounded-xl font-bold text-xs transition-colors duration-150 cursor-pointer border ${
                filter === tab.id
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              } ${isUrdu ? 'font-urdu' : 'font-sans'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events Layout Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                layout
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col sm:flex-row transition-all duration-200 shadow-none hover:border-slate-300"
              >
                {/* Event Cover Image */}
                <div className="relative w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden bg-slate-100">
                  <img
                    src={event.image}
                    alt={event.title[lang]}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category badge over image */}
                  <span className={`absolute top-3 ${
                    isUrdu ? 'right-3 font-urdu' : 'left-3 font-sans'
                  } px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryColor(event.category)}`}>
                    {getCategoryLabel(event.category)}
                  </span>
                </div>

                {/* Event Body */}
                <div className={`p-6 sm:p-8 flex-1 flex flex-col justify-between ${
                  isUrdu ? 'text-right' : 'text-left'
                }`}>
                  <div>
                    {/* Status badge */}
                    <div className={`mb-3 flex items-center gap-1.5 text-[11px] font-bold ${
                      isUrdu ? 'flex-row-reverse text-right' : 'text-left'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        event.status === 'upcoming' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`} />
                      <span className={event.status === 'upcoming' ? 'text-emerald-700' : 'text-slate-500'}>
                        {event.status === 'upcoming' 
                          ? (isUrdu ? 'آنے والا پروگرام' : 'Upcoming Program') 
                          : (isUrdu ? 'کامیابی سے مکمل' : 'Successfully Completed')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-lg sm:text-lg font-bold text-slate-900 leading-tight ${
                      isUrdu ? 'font-urdu' : 'font-sans'
                    }`}>
                      {event.title[lang]}
                    </h3>

                    {/* Mini particulars */}
                    <div className={`mt-4 space-y-2 text-xs sm:text-xs text-slate-500 ${
                      isUrdu ? 'font-urdu leading-none' : 'font-sans'
                    }`}>
                      {/* Date */}
                      <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>
                          <span className="font-semibold text-slate-700">{DICTIONARY.events.date[lang]}:</span>{' '}
                          <span className="font-mono">{event.date}</span>
                        </span>
                      </div>
                      
                      {/* Time */}
                      <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                        <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>
                          <span className="font-semibold text-slate-700">{DICTIONARY.events.time[lang]}:</span>{' '}
                          <span>{event.time[lang]}</span>
                        </span>
                      </div>

                      {/* Venue */}
                      <div className={`flex items-start gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <span className="font-semibold text-slate-700">{DICTIONARY.events.venue[lang]}:</span>{' '}
                          <span>{event.location[lang]}</span>
                        </span>
                      </div>
                    </div>

                    {/* Brief description */}
                    <p className={`text-slate-500 text-xs mt-4 leading-relaxed ${
                      isUrdu ? 'font-urdu leading-loose text-slate-600' : 'font-sans'
                    }`}>
                      {event.description[lang]}
                    </p>
                  </div>

                  {/* Call to action */}
                  <div className={`mt-6 pt-4 border-t border-slate-100 flex ${
                    isUrdu ? 'justify-end' : 'justify-start'
                  }`}>
                    <button
                      onClick={() => handleEnquire(event.title[lang])}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors duration-150 cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                      <span>{isUrdu ? 'تفصیلات و رہنمائی' : 'Enquire & Join'}</span>
                      <Send className={`w-3 h-3 ${isUrdu ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
