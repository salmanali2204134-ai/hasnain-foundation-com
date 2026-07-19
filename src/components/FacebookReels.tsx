/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Facebook, 
  Play, 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ExternalLink,
  Sparkles,
  Eye,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FacebookReelsProps {
  lang: Language;
}

interface ReelItem {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  thumbnail: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  duration: string;
  publishedAt: {
    en: string;
    ur: string;
  };
  reelUrl: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: "reel-1",
    title: {
      en: "Powerful Ruqyah for Evil Eye, Black Magic, & Jealousy Protection",
      ur: "بندش، جادو اور نظرِ بد کے علاج کے لیے طاقتور دم اور شرعی رقیہ"
    },
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    views: "185K",
    likes: "24K",
    comments: "842",
    shares: "15.4K",
    duration: "0:58",
    publishedAt: {
      en: "2 days ago",
      ur: "۲ دن پہلے"
    },
    reelUrl: "https://www.facebook.com/share/17mpuehs9b/"
  },
  {
    id: "reel-2",
    title: {
      en: "On-Ground Distribution: Serving Hot Meals to 500+ Deserving Families",
      ur: "سرجانی ٹاؤن: ۵۰۰ سے زائد مستحق خاندانوں میں تیار پکے ہوئے کھانے کی تقسیم"
    },
    thumbnail: "https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    views: "112K",
    likes: "18.5K",
    comments: "612",
    shares: "8.9K",
    duration: "0:45",
    publishedAt: {
      en: "5 days ago",
      ur: "۵ دن پہلے"
    },
    reelUrl: "https://www.facebook.com/share/17mpuehs9b/"
  },
  {
    id: "reel-3",
    title: {
      en: "Quran Recitation & Spiritual Reflections during Weekly Gathering",
      ur: "ہفتہ وار روحانی اجتماع میں رقت انگیز تلاوتِ قرآنِ پاک اور اصلاحی بیان"
    },
    thumbnail: "https://images.unsplash.com/photo-1585129638847-3bb076dc2ec6?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    views: "94K",
    likes: "15.2K",
    comments: "504",
    shares: "6.4K",
    duration: "1:00",
    publishedAt: {
      en: "1 week ago",
      ur: "۱ ہفتہ پہلے"
    },
    reelUrl: "https://www.facebook.com/share/17mpuehs9b/"
  },
  {
    id: "reel-4",
    title: {
      en: "Orphan Education Program: Distributing School Kits & Backpacks",
      ur: "تعلیمی کفالتِ اطفال: غریب اور یتیم بچوں میں اسکول بیگز اور اسٹیشنری کی تقسیم"
    },
    thumbnail: "https://images.unsplash.com/photo-1559027615-cd9995a0c950?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    views: "64K",
    likes: "9.8K",
    comments: "318",
    shares: "4.2K",
    duration: "0:52",
    publishedAt: {
      en: "2 weeks ago",
      ur: "۲ ہفتے پہلے"
    },
    reelUrl: "https://www.facebook.com/share/17mpuehs9b/"
  }
];

export default function FacebookReels({ lang }: FacebookReelsProps) {
  const isUrdu = lang === 'ur';
  const [selectedReel, setSelectedReel] = useState<ReelItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleOpenReel = (reel: ReelItem) => {
    setSelectedReel(reel);
    setIsPlaying(true);
  };

  const handleCloseReel = () => {
    setSelectedReel(null);
    setIsPlaying(false);
  };

  return (
    <section id="facebook-reels-section" className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      
      {/* Background ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10 pointer-events-none translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className={isUrdu ? 'text-right md:order-2' : 'text-left md:order-1'}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Facebook className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'تازہ ترین فیس بک ریلز' : 'LATEST FACEBOOK REELS'}</span>
            </span>
            <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
              {isUrdu ? 'سوشل میڈیا ریلز اور لائیو اپ ڈیٹس' : 'Watch Our Latest Reels'}
            </h2>
            <p className={`mt-3 text-slate-400 max-w-2xl text-sm leading-relaxed ${isUrdu ? 'font-urdu leading-loose text-base' : 'font-sans'}`}>
              {isUrdu 
                ? 'ہمارے آفیشل فیس بک اکاؤنٹ پر روزانہ کی بنیاد پر اپ لوڈ کی جانے والی معلوماتی اور اصلاحی مختصر ویڈیوز دیکھیں۔ دم، دعائیں اور فلاحی کاموں کا آن گراؤنڈ احوال۔'
                : 'Stay engaged with our daily video updates uploaded straight to Facebook. Experience live clips from our welfare programs, spiritual recitations, and community projects.'}
            </p>
          </div>

          <div className={`shrink-0 ${isUrdu ? 'md:order-1' : 'md:order-2'}`}>
            <a 
              href="https://www.facebook.com/share/17mpuehs9b/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-900/30 transition-all cursor-pointer group"
            >
              <Facebook className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>{isUrdu ? 'ہمارا فیس بک پیج وزٹ کریں' : 'Follow on Facebook'}</span>
              <ExternalLink className="w-4 h-4 shrink-0 opacity-70" />
            </a>
          </div>
        </div>

        {/* Reels Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REELS_DATA.map((reel, idx) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => handleOpenReel(reel)}
              className="group aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-md relative cursor-pointer"
            >
              {/* Media Thumbnail Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={reel.thumbnail} 
                  alt={isUrdu ? reel.title.ur : reel.title.en} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/35 group-hover:from-black/100 transition-all" />
              </div>

              {/* Top Bar Indicators */}
              <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs border border-white/10 text-[9px] font-black tracking-widest text-emerald-400 uppercase font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live
                </span>
                <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-white/10 text-[9px] font-bold font-mono text-slate-300">
                  {reel.duration}
                </span>
              </div>

              {/* Play Icon Indicator Center */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.div 
                  whileHover={{ scale: 1.15 }}
                  className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-all scale-95 group-hover:scale-100"
                >
                  <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
                </motion.div>
              </div>

              {/* Bottom Info Section */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-10 space-y-3.5">
                <p className={`text-xs sm:text-sm font-bold text-white tracking-wide line-clamp-3 group-hover:text-blue-300 transition-colors ${
                  isUrdu ? 'font-urdu text-right leading-relaxed text-sm' : 'text-left font-sans'
                }`}>
                  {isUrdu ? reel.title.ur : reel.title.en}
                </p>

                {/* Metrics Row */}
                <div className={`flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold pt-3 border-t border-slate-800/60 ${
                  isUrdu ? 'flex-row-reverse' : ''
                }`}>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>{reel.views} {isUrdu ? 'دیکھا گیا' : 'views'}</span>
                  </span>
                  
                  <div className={`flex items-center gap-3 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>{reel.likes}</span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="w-3 h-3 text-blue-400" />
                      <span>{reel.comments}</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore More Row */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col items-center justify-center gap-3.5 max-w-md mx-auto p-5 rounded-2xl bg-slate-800/40 border border-slate-800 backdrop-blur-xs">
            <span className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 animate-pulse">
              <Video className="w-5 h-5" />
            </span>
            <div className="space-y-1">
              <h4 className={`text-sm font-bold text-white ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'تمام معلوماتی ریلز اور لائیو نشریات' : 'All Video Reels Available Online'}
              </h4>
              <p className={`text-xs text-slate-400 leading-relaxed ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu 
                  ? 'ہمارے آفیشل پیج پر جا کر تمام فلاحی مہم اور روحانی دم کی ویڈیوز دیکھیں۔'
                  : 'Check out the entire history of our reels and live clips on the official Facebook hub.'}
              </p>
            </div>
            
            <a
              href="https://www.facebook.com/share/17mpuehs9b/"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Facebook className="w-4 h-4 shrink-0 text-blue-400" />
              <span>{isUrdu ? 'تمام ریلز فیس بک پر دیکھیں' : 'Watch All Reels'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* SIMULATED REELS PLAYER MODAL */}
      <AnimatePresence>
        {selectedReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[85vh] max-h-[750px]"
            >
              {/* Left video preview panel (Simulated player) */}
              <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedReel.thumbnail} 
                  alt={selectedReel.title.en}
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                
                {/* Simulated play animation / overlay overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                {/* Simulated progress slider bar */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-800">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: isPlaying ? "100%" : "35%" }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="h-full bg-blue-500"
                  />
                </div>

                {/* Bottom Left controls inside player */}
                <div className="absolute bottom-4 left-4 right-14 z-10 text-left space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white font-mono">
                      H
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">Hasnain Foundation</h4>
                      <span className="text-[9px] text-slate-300 font-medium">{selectedReel.publishedAt[lang]}</span>
                    </div>
                  </div>
                  <p className={`text-xs text-white line-clamp-2 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? selectedReel.title.ur : selectedReel.title.en}
                  </p>
                </div>

                {/* Right side overlays: Like, share buttons inside screen */}
                <div className="absolute right-4 bottom-8 z-10 flex flex-col items-center gap-4 text-white">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <Play className={`w-4 h-4 ${isPlaying ? 'fill-white' : ''}`} />
                  </button>

                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <div className="flex flex-col items-center">
                    <button className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-rose-500 hover:bg-black/80 transition-colors">
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>
                    <span className="text-[9px] font-mono font-bold mt-1">{selectedReel.likes}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <button className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-blue-400 hover:bg-black/80 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <span className="text-[9px] font-mono font-bold mt-1">{selectedReel.comments}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <button className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-emerald-400 hover:bg-black/80 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <span className="text-[9px] font-mono font-bold mt-1">{selectedReel.shares}</span>
                  </div>
                </div>

                {/* Modal close button */}
                <button
                  onClick={handleCloseReel}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                  title="Close player"
                >
                  <span className="text-lg font-bold leading-none">&times;</span>
                </button>
              </div>

              {/* Bottom descriptive action call panel */}
              <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col justify-between shrink-0 space-y-4">
                <div className={isUrdu ? 'text-right' : 'text-left'}>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono flex items-center gap-1 justify-start">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    {isUrdu ? 'حقیقی ویڈیو فیس بک پر ملاحظہ کریں' : 'Watch Original Reel'}
                  </span>
                  <h3 className={`text-sm font-extrabold text-white mt-1 leading-snug line-clamp-2 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? selectedReel.title.ur : selectedReel.title.en}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCloseReel}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    {isUrdu ? 'بند کریں' : 'Close'}
                  </button>
                  <a
                    href={selectedReel.reelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Facebook className="w-4 h-4 text-white fill-white" />
                    <span>{isUrdu ? 'فیس بک پر دیکھیں' : 'Watch on Facebook'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
