/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, GalleryItem } from '../types';
import { DICTIONARY, GALLERY_DATA } from '../data';
import { Image as ImageIcon, Play, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryProps {
  lang: Language;
}

export default function Gallery({ lang }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isUrdu = lang === 'ur';

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

  // Filter items
  const filteredGallery = GALLERY_DATA.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const openLightbox = (id: string) => {
    const idx = GALLERY_DATA.findIndex(item => item.id === id);
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
    if (newIdx < 0) newIdx = GALLERY_DATA.length - 1;
    if (newIdx >= GALLERY_DATA.length) newIdx = 0;
    
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
              onClick={() => setActiveCategory(cat.id)}
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
            {filteredGallery.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => openLightbox(item.id)}
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

                {/* Hover Content */}
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
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
                  {lightboxIndex + 1} / {GALLERY_DATA.length}
                </span>
                
                {/* Title */}
                <h3 className={`text-white text-base sm:text-lg font-bold truncate max-w-xl hidden md:block ${
                  isUrdu ? 'font-urdu' : 'font-sans'
                }`}>
                  {GALLERY_DATA[lightboxIndex].title[lang]}
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
                  {GALLERY_DATA[lightboxIndex].type === 'photo' ? (
                    <img
                      src={GALLERY_DATA[lightboxIndex].url}
                      alt={GALLERY_DATA[lightboxIndex].title[lang]}
                      className="max-h-[70vh] max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    // Video render
                    <video
                      src={GALLERY_DATA[lightboxIndex].url}
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
                  {GALLERY_DATA[lightboxIndex].title[lang]}
                </h3>

                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  {DICTIONARY.gallery[`cat${GALLERY_DATA[lightboxIndex].category.charAt(0).toUpperCase() + GALLERY_DATA[lightboxIndex].category.slice(1)}` as any] ? 
                    (DICTIONARY.gallery[`cat${GALLERY_DATA[lightboxIndex].category.charAt(0).toUpperCase() + GALLERY_DATA[lightboxIndex].category.slice(1)}` as any][lang]) : 
                    GALLERY_DATA[lightboxIndex].category}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
