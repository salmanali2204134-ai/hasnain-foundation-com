/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Facebook, 
  Youtube, 
  Instagram, 
  Play, 
  Pause, 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  X, 
  ExternalLink,
  Sparkles,
  Video,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReelsModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export interface MultiReelItem {
  id: string;
  platform: 'facebook' | 'youtube' | 'instagram' | 'tiktok';
  title: { en: string; ur: string };
  thumbnail: string;
  youtubeId?: string;
  reelUrl: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  duration: string;
  publishedAt: { en: string; ur: string };
}

export const MULTI_REELS_DATA: MultiReelItem[] = [
  {
    id: "reel-fb-featured-share",
    platform: "facebook",
    title: {
      en: "Official Facebook Video: Hasnain Foundation Ground Relief & Community Drive",
      ur: "خصوصی فیس بک ویڈیو: حسنین فاؤنڈیشن کی باضابطہ فلاحی سرگرمی و آن گراؤنڈ رپورٹ"
    },
    thumbnail: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    reelUrl: "https://www.facebook.com/share/v/1JmqJTgVg6/",
    views: "320K",
    likes: "42K",
    comments: "1.5K",
    shares: "22.8K",
    duration: "1:20",
    publishedAt: { en: "Featured Video", ur: "خصوصی وائرل ویڈیو" }
  },
  {
    id: "reel-yt-school",
    platform: "youtube",
    title: {
      en: "Al-Hasnain Model School & Orphanage Support Official Video Report",
      ur: "الاحسنین ماڈل اسکول اور یتیم خانہ سرپرستی باضابطہ ویڈیو رپورٹ"
    },
    thumbnail: "https://img.youtube.com/vi/wu47tWmw5tk/hqdefault.jpg",
    youtubeId: "wu47tWmw5tk",
    reelUrl: "https://youtu.be/wu47tWmw5tk?si=SXO7WCVVYBr37DHZ",
    views: "310K",
    likes: "45K",
    comments: "2.1K",
    shares: "28.4K",
    duration: "1:30",
    publishedAt: { en: "Just now", ur: "ابھی ابھی" }
  },
  {
    id: "reel-yt-1",
    platform: "youtube",
    title: {
      en: "Powerful Ruqyah for Evil Eye, Black Magic, & Protection",
      ur: "بندش، جادو اور نظرِ بد کے علاج کے لیے طاقتور دم اور شرعی رقیہ"
    },
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    youtubeId: "8uI-_8s8N7Y",
    reelUrl: "https://www.youtube.com/@HasnainFoundation-t8n",
    views: "240K",
    likes: "32K",
    comments: "1.2K",
    shares: "18.5K",
    duration: "0:58",
    publishedAt: { en: "1 day ago", ur: "۱ دن پہلے" }
  },
  {
    id: "reel-fb-1",
    platform: "facebook",
    title: {
      en: "On-Ground Meal Distribution to 500+ Deserving Families in Surjani Town",
      ur: "سرجانی ٹاؤن: ۵۰۰ سے زائد مستحق خاندانوں میں تیار پکے ہوئے کھانے کی تقسیم"
    },
    thumbnail: "https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    reelUrl: "https://www.facebook.com/share/17mpuehs9b/",
    views: "185K",
    likes: "24K",
    comments: "842",
    shares: "15.4K",
    duration: "0:45",
    publishedAt: { en: "2 days ago", ur: "۲ دن پہلے" }
  },
  {
    id: "reel-insta-1",
    platform: "instagram",
    title: {
      en: "Quran Recitation & Spiritual Reflections during Weekly Gathering",
      ur: "ہفتہ وار روحانی اجتماع میں رقت انگیز تلاوتِ قرآنِ پاک اور اصلاحی بیان"
    },
    thumbnail: "https://images.unsplash.com/photo-1585129638847-3bb076dc2ec6?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    reelUrl: "https://www.instagram.com/hasnainfoundation?igsh=ZWtrdHA3a3I1Mndp",
    views: "112K",
    likes: "18.5K",
    comments: "612",
    shares: "8.9K",
    duration: "1:00",
    publishedAt: { en: "5 days ago", ur: "۵ دن پہلے" }
  },
  {
    id: "reel-yt-2",
    platform: "youtube",
    title: {
      en: "Clean Water Well Inauguration in Remote Drought-Affected Village",
      ur: "صحرا اور دور دراز دیہات میں میٹھے پانی کے صاف ویل اور آراو پلانٹ کا افتتاح"
    },
    thumbnail: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    youtubeId: "5_8k3a9Z7f4",
    reelUrl: "https://www.youtube.com/@HasnainFoundation-t8n",
    views: "98K",
    likes: "14.2K",
    comments: "490",
    shares: "6.8K",
    duration: "0:55",
    publishedAt: { en: "1 week ago", ur: "۱ ہفتہ پہلے" }
  },
  {
    id: "reel-tiktok-1",
    platform: "tiktok",
    title: {
      en: "Orphan Education Program: Distributing Backpacks & Books",
      ur: "تعلیمی کفالتِ اطفال: غریب اور یتیم بچوں میں اسکول بیگز اور کتابوں کی تقسیم"
    },
    thumbnail: "https://images.unsplash.com/photo-1559027615-cd9995a0c950?auto=format&fm=webp&fit=crop&q=85&w=800&h=1200",
    reelUrl: "https://www.tiktok.com/@hasnainfoundation",
    views: "145K",
    likes: "21K",
    comments: "930",
    shares: "11.2K",
    duration: "0:52",
    publishedAt: { en: "2 weeks ago", ur: "۲ ہفتے پہلے" }
  }
];

export default function ReelsModal({ lang, isOpen, onClose }: ReelsModalProps) {
  const isUrdu = lang === 'ur';
  const [activePlatform, setActivePlatform] = useState<'all' | 'facebook' | 'youtube' | 'instagram' | 'tiktok'>('all');
  const [activeReel, setActiveReel] = useState<MultiReelItem>(MULTI_REELS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredReels = MULTI_REELS_DATA.filter(r => {
    if (activePlatform === 'all') return true;
    return r.platform === activePlatform;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-500" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'tiktok':
        return (
          <span className="w-4 h-4 rounded bg-slate-800 text-cyan-400 font-extrabold text-[10px] flex items-center justify-center">
            TT
          </span>
        );
      default:
        return null;
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'Facebook Reel';
      case 'youtube': return 'YouTube Short';
      case 'instagram': return 'Instagram Reel';
      case 'tiktok': return 'TikTok Reel';
      default: return 'Short Video';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 sm:p-4 backdrop-blur-md font-sans">
        
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] max-h-[820px] overflow-hidden shadow-2xl flex flex-col relative"
        >
          {/* Header Bar */}
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm sm:text-base font-black text-white ${isUrdu ? 'font-urdu' : ''}`}>
                  {isUrdu ? 'ملٹی پلیٹ فارم ریلز اور مختصر ویڈیوز' : 'Multi-Platform Reels & Shorts'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isUrdu ? 'فیس بک، یوٹیوب شارٹس، انسٹاگرام اور ٹک ٹاک ویڈیوز دیکھیں' : 'Watch reels on Facebook, YouTube, Instagram & TikTok'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
              title="Close Reels Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Layout Grid */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            
            {/* LEFT / TOP PLAYER SECTION (7 cols) */}
            <div className="md:col-span-7 bg-black flex flex-col relative overflow-hidden h-full">
              
              {/* If YouTube video ID exists, embed real iframe! */}
              {activeReel.platform === 'youtube' && activeReel.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeReel.youtubeId}?autoplay=1&rel=0`}
                  title={activeReel.title.en}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                /* Simulated Player View for Facebook/Instagram/TikTok with live video thumbnail overlay */
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={activeReel.thumbnail}
                    alt={activeReel.title.en}
                    className="w-full h-full object-cover opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

                  {/* Center Play Button Overlay */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="relative z-10 w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl hover:bg-blue-600 transition-all hover:scale-105 cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-white text-white" />
                    ) : (
                      <Play className="w-7 h-7 fill-white text-white translate-x-0.5" />
                    )}
                  </button>

                  {/* Player Bottom Info */}
                  <div className="absolute bottom-4 left-4 right-16 z-10 text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-black/70 text-emerald-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                        {getPlatformIcon(activeReel.platform)}
                        <span>{getPlatformLabel(activeReel.platform)}</span>
                      </span>
                      <span className="text-[10px] text-slate-300 font-mono">{activeReel.publishedAt[lang]}</span>
                    </div>

                    <h4 className={`text-xs sm:text-sm font-extrabold text-white line-clamp-2 ${isUrdu ? 'font-urdu text-right' : 'text-left'}`}>
                      {activeReel.title[lang]}
                    </h4>
                  </div>

                  {/* Player Right Action Bar */}
                  <div className="absolute right-3 bottom-6 z-10 flex flex-col items-center gap-3 text-white">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2.5 rounded-full bg-black/60 border border-white/10 text-slate-200 hover:bg-black cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <div className="flex flex-col items-center">
                      <div className="p-2.5 rounded-full bg-black/60 border border-white/10 text-rose-500">
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </div>
                      <span className="text-[9px] font-mono mt-0.5">{activeReel.likes}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="p-2.5 rounded-full bg-black/60 border border-white/10 text-blue-400">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono mt-0.5">{activeReel.comments}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Link Action Ribbon inside Player */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isUrdu ? 'اصل پلیٹ فارم پر دیکھیں:' : 'Watch on platform:'}</span>
                </span>

                <a
                  href={activeReel.reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  {getPlatformIcon(activeReel.platform)}
                  <span>
                    {activeReel.platform === 'youtube' 
                      ? (isUrdu ? 'یوٹیوب پر دیکھیں' : 'Watch on YouTube')
                      : activeReel.platform === 'facebook'
                        ? (isUrdu ? 'فیس بک پر دیکھیں' : 'Watch on Facebook')
                        : activeReel.platform === 'instagram'
                          ? (isUrdu ? 'انسٹاگرام پر دیکھیں' : 'Watch on Instagram')
                          : (isUrdu ? 'ٹک ٹاک پر دیکھیں' : 'Watch on TikTok')}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

            {/* RIGHT REELS SELECTOR PLAYLIST (5 cols) */}
            <div className="md:col-span-5 bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden">
              
              {/* Filter Tabs */}
              <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
                {(['all', 'facebook', 'youtube', 'instagram', 'tiktok'] as const).map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setActivePlatform(plat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
                      activePlatform === plat
                        ? 'bg-emerald-700 text-white border-emerald-600'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {plat === 'all' ? (isUrdu ? 'تمام ریلز' : 'All') : plat}
                  </button>
                ))}
              </div>

              {/* Reels Playlist Grid */}
              <div className="flex-grow p-3 overflow-y-auto space-y-2.5">
                {filteredReels.map((reel) => {
                  const isSelected = reel.id === activeReel.id;

                  return (
                    <div
                      key={reel.id}
                      onClick={() => {
                        setActiveReel(reel);
                        setIsPlaying(true);
                      }}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center group ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-black">
                        <img
                          src={reel.thumbnail}
                          alt={reel.title.en}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`p-1.5 rounded-full ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-black/60 text-white'}`}>
                            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-white">
                          {reel.duration}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          {getPlatformIcon(reel.platform)}
                          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                            {getPlatformLabel(reel.platform)}
                          </span>
                        </div>

                        <h4 className={`text-xs font-bold text-white line-clamp-2 ${isUrdu ? 'font-urdu text-right' : 'text-left'}`}>
                          {reel.title[lang]}
                        </h4>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-3 h-3 text-blue-400" />
                            {reel.views}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Heart className="w-3 h-3 text-rose-400" />
                            {reel.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
