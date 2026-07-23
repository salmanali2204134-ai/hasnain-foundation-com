/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, GalleryItem } from '../types';
import { DICTIONARY, GALLERY_DATA } from '../data';
import { Image as ImageIcon, Play, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchActivitiesFromSupabase, DailyActivity } from '../lib/supabase';

interface GalleryProps {
  lang: Language;
}

export default function Gallery({ lang }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dbActivities, setDbActivities] = useState<DailyActivity[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isUrdu = lang === 'ur';

  const loadActivities = async () => {
    try {
      const data = await fetchActivitiesFromSupabase();
      setDbActivities(data || []);
    } catch (err) {
      console.error('Error loading gallery activities:', err);
    }
  };

  useEffect(() => {
    loadActivities();
    window.addEventListener('activities_updated', loadActivities);
    return () => window.removeEventListener('activities_updated', loadActivities);
  }, []);

  // Categories mapping
  const categories = [
    { id: 'all', label: DICTIONARY.gallery.all[lang] },
    { id: 'mosque', label: DICTIONARY.gallery.catMosque[lang] },
    { id: 'food', label: DICTIONARY.gallery.catFood[lang] },
    { id: 'education', label: DICTIONARY.gallery.catEducation[lang] },
    { id: 'welfare', label: DICTIONARY.gallery.catWelfare[lang] },
    { id: 'events', label: DICTIONARY.gallery.catEvents[lang] },
    { id: 'spiritual', label: DICTIONARY.gallery.catSpiritual[lang] }
  ];

  // Map activity category to Gallery category
  const mapActivityCategoryToGallery = (cat: string): 'welfare' | 'mosque' | 'food' | 'education' | 'events' | 'spiritual' => {
    switch (cat) {
      case 'راشن تقسیم': return 'food';
      case 'روحانی علاج': return 'spiritual';
      case 'مسجد': return 'mosque';
      case 'مدرسہ': return 'education';
      case 'میڈیکل کیمپ': return 'welfare';
      case 'غریب بچیوں کی شادی': return 'welfare';
      case 'عید کپڑے تقسیم': return 'welfare';
      case 'درود بینک': return 'events';
      default: return 'welfare';
    }
  };

  // Convert dbActivities to dynamic Gallery items
  const dynamicGalleryItems: GalleryItem[] = [];
  dbActivities.forEach((act) => {
    const cat = mapActivityCategoryToGallery(act.category);
    
    // Add images
    if (act.images && act.images.length > 0) {
      act.images.forEach((imgUrl, idx) => {
        dynamicGalleryItems.push({
          id: `act-gallery-img-${act.id}-${idx}`,
          title: { en: act.title, ur: act.title },
          type: 'photo',
          category: cat,
          url: imgUrl,
          thumbnail: imgUrl
        });
      });
    }

    // Add optional video
    if (act.video_url) {
      dynamicGalleryItems.push({
        id: `act-gallery-vid-${act.id}`,
        title: { en: act.title, ur: act.title },
        type: 'video',
        category: cat,
        url: act.video_url,
        thumbnail: act.images && act.images.length > 0 ? act.images[0] : ''
      });
    }
  });

  // Combine dynamic and static gallery items
  const combinedGalleryData = [...dynamicGalleryItems, ...GALLERY_DATA];

  // Filter items
  const filteredGallery = combinedGalleryData.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const openLightbox = (id: string) => {
    const idx = combinedGalleryData.findIndex(item => item.id === id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    let newIdx = direction === 'prev' ? lightboxIndex - 1 : lightboxIndex + 1;
    
    // Cycle wrapping
    if (newIdx < 0) newIdx = combinedGalleryData.length - 1;
    if (newIdx >= combinedGalleryData.length) newIdx = 0;
    
    setLightboxIndex(newIdx);
  };

  return (
    <section id="gallery-section" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs sm:text-xs font-bold uppercase tracking-wider mb-3"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'تصویری جھلکیاں' : 'Media Archive'}
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
            {DICTIONARY.gallery.title[lang]}
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
            {DICTIONARY.gallery.subtitle[lang]}
          </motion.p>
        </div>

        {/* Filter Categories Tabs - scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start md:justify-center px-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setIsExpanded(false);
              }}
              className={`flex-shrink-0 px-5 py-2 rounded-xl font-bold text-xs transition-colors duration-150 cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              } ${isUrdu ? 'font-urdu' : 'font-sans'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {(isExpanded ? filteredGallery : filteredGallery.slice(0, 4)).map((item, idx) => {
              const isFourthItemInCollapsed = !isExpanded && idx === 3 && filteredGallery.length > 4;
              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => {
                    if (isFourthItemInCollapsed) {
                      setIsExpanded(true);
                    } else {
                      openLightbox(item.id);
                    }
                  }}
                  className="group relative h-64 rounded-xl overflow-hidden bg-slate-200 transition-all duration-200 cursor-pointer border border-slate-200 shadow-none"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={item.thumbnail}
                    alt={item.title[lang]}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />

                  {/* Dark Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-5" />

                  {/* Always visible category tag / video indicator */}
                  <div className={`absolute top-4 ${
                    isUrdu ? 'right-4 flex-row-reverse' : 'left-4'
                  } flex gap-2 items-center z-10`}>
                    <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                      {item.type === 'photo' 
                        ? (isUrdu ? 'تصویر' : 'Photo') 
                        : (isUrdu ? 'ویڈیو' : 'Video')}
                    </span>
                    {item.type === 'video' && (
                      <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 animate-pulse">
                        <Play className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* 4th Item Overlay when Collapsed */}
                  {isFourthItemInCollapsed ? (
                    <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 z-20 text-white space-y-2">
                      <div className="p-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Eye className="w-6 h-6" />
                      </div>
                      <span className="text-xl font-black text-amber-300">
                        +{filteredGallery.length - 3} {isUrdu ? 'مزید تصاویر' : 'More Photos'}
                      </span>
                      <span className="text-xs font-bold text-slate-200 opacity-90">
                        {isUrdu ? 'گلیری کھولنے کے لیے کلک کریں' : 'Click to view full gallery'}
                      </span>
                    </div>
                  ) : (
                    /* Hover Content */
                    <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 flex flex-col justify-end text-white">
                      <div className={`p-1.5 bg-black/60 rounded-lg w-8 h-8 flex items-center justify-center mb-2 ${
                        isUrdu ? 'mr-auto' : ''
                      }`}>
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <h3 className={`text-sm font-bold leading-tight ${
                        isUrdu ? 'font-urdu text-right' : 'text-left'
                      }`}>
                        {item.title[lang]}
                      </h3>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View All / Expand Toggle Button */}
        {filteredGallery.length > 4 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-emerald-700/50"
            >
              <Eye className="w-5 h-5 text-amber-400" />
              <span>
                {isExpanded
                  ? (isUrdu ? 'کم تصاویر دیکھیں' : 'Show Fewer Images')
                  : (isUrdu ? `گیلری کی تمام تصاویر دیکھیں (${filteredGallery.length})` : `View All Gallery Photos & Videos (${filteredGallery.length})`)}
              </span>
            </button>
          </div>
        )}

        {/* Fullscreen Responsive Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between p-4"
              onClick={closeLightbox}
            >
              {/* Top Controls */}
              <div className="flex justify-between items-center w-full max-w-7xl mx-auto py-2">
                <span className="text-slate-400 text-xs sm:text-sm font-semibold font-mono">
                  {lightboxIndex + 1} / {combinedGalleryData.length}
                </span>
                
                {/* Title */}
                <h3 className={`text-white text-base sm:text-lg font-bold truncate max-w-xl hidden md:block ${
                  isUrdu ? 'font-urdu' : 'font-sans'
                }`}>
                  {combinedGalleryData[lightboxIndex].title[lang]}
                </h3>

                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Media Core Box */}
              <div 
                className="flex-1 flex items-center justify-center relative max-w-5xl mx-auto w-full px-2 sm:px-8"
                onClick={(e) => e.stopPropagation()} // Prevent close on clicking media
              >
                {/* Left arrow navigation */}
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-0 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 z-10 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Media display */}
                <div className="max-h-[70vh] max-w-full rounded-xl overflow-hidden bg-black/40 flex items-center justify-center shadow-2xl border border-white/5 relative">
                  {combinedGalleryData[lightboxIndex].type === 'photo' ? (
                    <img
                      src={combinedGalleryData[lightboxIndex].url}
                      alt={combinedGalleryData[lightboxIndex].title[lang]}
                      className="max-h-[70vh] max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    // Video render
                    <video
                      src={combinedGalleryData[lightboxIndex].url}
                      controls
                      autoPlay
                      className="max-h-[70vh] max-w-full rounded-xl"
                    />
                  )}
                </div>

                {/* Right arrow navigation */}
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-0 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 z-10 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom Details block */}
              <div className="w-full max-w-4xl mx-auto py-4 text-center">
                {/* Responsive Mobile title */}
                <h3 className={`text-white text-base font-bold md:hidden mb-2 px-4 ${
                  isUrdu ? 'font-urdu' : 'font-sans'
                }`}>
                  {combinedGalleryData[lightboxIndex].title[lang]}
                </h3>

                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  {DICTIONARY.gallery[`cat${combinedGalleryData[lightboxIndex].category.charAt(0).toUpperCase() + combinedGalleryData[lightboxIndex].category.slice(1)}` as any] ? 
                    (DICTIONARY.gallery[`cat${combinedGalleryData[lightboxIndex].category.charAt(0).toUpperCase() + combinedGalleryData[lightboxIndex].category.slice(1)}` as any][lang]) : 
                    combinedGalleryData[lightboxIndex].category}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
