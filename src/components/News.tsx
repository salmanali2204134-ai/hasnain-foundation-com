/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, NewsArticle } from '../types';
import { DICTIONARY, NEWS_DATA } from '../data';
import { Megaphone, Calendar, ArrowRight, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchActivitiesFromSupabase, DailyActivity } from '../lib/supabase';

interface NewsProps {
  lang: Language;
}

export default function News({ lang }: NewsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dbActivities, setDbActivities] = useState<DailyActivity[]>([]);
  const isUrdu = lang === 'ur';

  const loadActivities = async () => {
    try {
      const data = await fetchActivitiesFromSupabase();
      setDbActivities(data || []);
    } catch (err) {
      console.error('Error loading news activities:', err);
    }
  };

  useEffect(() => {
    loadActivities();
    window.addEventListener('activities_updated', loadActivities);
    return () => window.removeEventListener('activities_updated', loadActivities);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const mapCategoryToTag = (cat: string) => {
    const mapping: Record<string, string> = {
      'راشن تقسیم': 'Ration Distribution',
      'روحانی علاج': 'Spiritual Therapy',
      'مسجد': 'Masjid Project',
      'مدرسہ': 'Madrasah',
      'میڈیکل کیمپ': 'Medical Camp',
      'غریب بچیوں کی شادی': 'Marriage Support',
      'عید کپڑے تقسیم': 'Eid Clothes',
      'درود بینک': 'Durood Bank',
      'دیگر': 'Welfare Activity'
    };
    return mapping[cat] || cat;
  };

  const dynamicNewsArticles: NewsArticle[] = dbActivities.map((act) => ({
    id: `act-news-${act.id}`,
    title: { en: act.title, ur: act.title },
    date: act.date,
    excerpt: { en: act.urdu_description, ur: act.urdu_description },
    content: {
      en: [
        act.urdu_description,
        `Activity logged by: ${act.admin_name} at ${act.time}`,
        act.video_url ? `Video Link: ${act.video_url}` : ''
      ].filter(Boolean),
      ur: [
        act.urdu_description,
        `انتظامیہ نشر کردہ: ${act.admin_name} بوقت ${act.time}`,
        act.video_url ? `ویڈیو لنک: ${act.video_url}` : ''
      ].filter(Boolean)
    },
    image: act.images && act.images.length > 0 ? act.images[0] : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=85',
    tag: { en: mapCategoryToTag(act.category), ur: act.category }
  }));

  const combinedNewsData = [...dynamicNewsArticles, ...NEWS_DATA];

  return (
    <section id="news-section" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs sm:text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Megaphone className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'خبریں اور اعلانات' : 'Latest Feed'}
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
            {DICTIONARY.news.title[lang]}
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
            {DICTIONARY.news.subtitle[lang]}
          </motion.p>
        </div>

        {/* News layout grid - masonry-like or balanced flex column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {combinedNewsData.map((article, index) => {
            const isExpanded = expandedId === article.id;
            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all duration-200 shadow-none ${
                  isUrdu ? 'text-right' : 'text-left'
                }`}
              >
                {/* Image and floating tag */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={article.image}
                    alt={article.title[lang]}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Tag */}
                  <span className={`absolute top-4 ${
                    isUrdu ? 'right-4 font-urdu' : 'left-4 font-sans'
                  } px-2.5 py-1 rounded-lg bg-slate-900/90 text-amber-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 z-10 shadow-sm`}>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {article.tag[lang]}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Published Date */}
                    <div className={`flex items-center gap-2 text-xs text-slate-400 mb-3 ${
                      isUrdu ? 'flex-row-reverse' : ''
                    }`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        <span className={isUrdu ? 'font-urdu' : 'font-sans'}>{DICTIONARY.news.published[lang]}</span>{' '}
                        <span className="font-mono">{article.date}</span>
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className={`text-base font-bold text-slate-900 leading-tight mb-2 hover:text-emerald-800 transition-colors duration-150 ${
                      isUrdu ? 'font-urdu' : 'font-sans'
                    }`}>
                      {article.title[lang]}
                    </h3>

                    {/* Excerpt / Short text */}
                    <p className={`text-slate-500 text-xs sm:text-xs leading-relaxed ${
                      isUrdu ? 'font-urdu leading-loose text-slate-600' : 'font-sans'
                    }`}>
                      {article.excerpt[lang]}
                    </p>

                    {/* Expanded complete details inside container */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-200 space-y-3"
                        >
                          {article.content[lang].map((pText, pIdx) => (
                            <p key={pIdx} className={`text-xs sm:text-xs text-slate-600 leading-relaxed ${
                              isUrdu ? 'font-urdu leading-loose' : 'font-sans'
                            }`}>
                              {pText}
                            </p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Actions Toggle */}
                  <div className={`mt-6 pt-4 border-t border-slate-100 flex ${
                    isUrdu ? 'justify-end' : 'justify-start'
                  }`}>
                    <button
                      onClick={() => toggleExpand(article.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>
                        {isExpanded ? DICTIONARY.general.showLess[lang] : DICTIONARY.general.readMore[lang]}
                      </span>
                      {isUrdu ? (
                        isExpanded ? <ArrowRight className="w-3.5 h-3.5 rotate-90" /> : <ArrowLeft className="w-3.5 h-3.5" />
                      ) : (
                        isExpanded ? <ArrowRight className="w-3.5 h-3.5 rotate-90" /> : <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
