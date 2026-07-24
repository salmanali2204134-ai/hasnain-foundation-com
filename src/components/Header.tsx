/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { DICTIONARY } from '../data';
import Logo from './Logo';
import NotificationBell from './NotificationBell';
import { Menu, X, Globe, Heart, Phone, Lock, Facebook, Youtube, Instagram, MessageCircle, Video, Clock } from 'lucide-react';
import { CITIES_LIST, getFullPrayerList } from '../lib/prayerTimes';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenAdmin?: () => void;
  onReelsClick?: () => void;
}

export default function Header({ lang, setLang, activeSection, setActiveSection, onOpenAdmin, onReelsClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const isUrdu = lang === 'ur';

  // Live timer tick every 10 seconds for prayer calculation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const timer = setInterval(() => {
      setNow(new Date());
    }, 10000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  // Compute live prayer times for top header button
  const { prayers, currentActivePrayerId, timeRemainingStr } = getFullPrayerList(CITIES_LIST[0], now);
  const activePrayer = prayers.find(p => p.id === currentActivePrayerId) || prayers[0];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    
    if (id === 'prayer-times') {
      window.dispatchEvent(new CustomEvent('show-prayer-times'));
      setTimeout(() => {
        const el = document.getElementById('prayer-times-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ur' : 'en');
  };

  const navItems = [
    { id: 'home', label: DICTIONARY.nav.home[lang] },
    { id: 'prayer-times', label: isUrdu ? 'اوقاتِ نماز (Prayer Schedule)' : 'Prayer Times & Adhan' },
    { id: 'services', label: DICTIONARY.nav.services[lang] },
    { id: 'about', label: DICTIONARY.nav.about[lang] },
    { id: 'portal-system', label: isUrdu ? 'رکنیت و رضاکار پورٹل' : 'Membership & Volunteer Portal' },
    { id: 'appointment', label: DICTIONARY.nav.appointment[lang] },
    { id: 'patient-portal', label: DICTIONARY.nav.patientPortal[lang] },
    { id: 'durood-bank', label: DICTIONARY.nav.duroodBank[lang] },
    { id: 'library', label: DICTIONARY.nav.library[lang] },
    { id: 'projects', label: DICTIONARY.nav.projects[lang] },
    { id: 'events', label: DICTIONARY.nav.events[lang] },
    { id: 'gallery', label: DICTIONARY.nav.gallery[lang] },
    { id: 'transparency', label: DICTIONARY.nav.transparency[lang] },
    { id: 'news', label: DICTIONARY.nav.news[lang] },
    { id: 'volunteer', label: DICTIONARY.nav.volunteer[lang] },
    { id: 'contact', label: DICTIONARY.nav.contact[lang] },
  ];

  return (
    <>
      {/* Top micro-bar for emergency phone, live prayer widget & social channels */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-3 sm:px-4 font-sans border-b border-slate-800">
        <div className={`max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* Phone & Helpline */}
          <div className={`flex gap-2 sm:gap-4 items-center ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
            <a href="tel:03180202424" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-mono font-bold">03180202424</span>
            </a>
            <span className="hidden sm:inline opacity-75">
              {isUrdu ? "جامع مسجد عبدالقادر جیلانی، کراچی" : "Jamia Masjid Abdul Qadir Jilani, Karachi"}
            </span>
          </div>

          {/* PRAYER TIMES BUTTON IN TOP BAR */}
          <div className="flex items-center gap-2">
            <button
              id="top-bar-prayer-btn"
              onClick={() => handleNavClick('prayer-times')}
              className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/80 text-emerald-300 hover:bg-emerald-900 transition-all text-[10px] font-extrabold cursor-pointer active:scale-95 shadow-sm"
              title={isUrdu ? 'مکمل اوقاتِ نماز دیکھنے کے لیے کلک کریں' : 'Click to view full Prayer Times Schedule'}
            >
              <Clock className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
              <span>
                {isUrdu ? 'اوقاتِ نماز پورٹل' : 'Prayer Times Schedule'}
              </span>
            </button>
          </div>

          {/* TOP CORNER DIRECT SOCIAL MEDIA LINKS */}
          <div className={`hidden lg:flex items-center gap-1.5 sm:gap-2 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              {isUrdu ? 'سوشل میڈیا:' : 'Official Socials:'}
            </span>

            <a
              href="https://facebook.com/hasnainfoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 sm:px-2 sm:py-0.5 rounded bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-400 border border-slate-700/80 transition-all flex items-center gap-1 text-[10px] font-bold cursor-pointer"
            >
              <Facebook className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Facebook</span>
            </a>

            <a
              href="https://wa.me/923180202424"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 sm:px-2 sm:py-0.5 rounded bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-400 border border-slate-700/80 transition-all flex items-center gap-1 text-[10px] font-bold cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main sticky glass header */}
      <header
        id="app-header"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white border-b border-slate-200 py-2.5 sm:py-3 shadow-sm' 
            : 'bg-white/95 backdrop-blur-md py-3 sm:py-4 border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-between gap-1.5 sm:gap-3 w-full">
          
          {/* Logo Brand (Scales nicely without pushing header icons off-screen) */}
          <button onClick={() => handleNavClick('home')} className="cursor-pointer focus:outline-none min-w-0 flex-1 sm:flex-initial text-left">
            <Logo lang={lang} variant="header" />
          </button>

          {/* Action Area - Carefully constrained so Mobile Menu (3 lines) is NEVER cut off */}
          <div className={`flex items-center gap-1 sm:gap-2 shrink-0 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* Header Prayer Button */}
            <button
              id="header-prayer-badge-btn"
              onClick={() => handleNavClick('prayer-times')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-[11px] sm:text-xs transition-all cursor-pointer shadow-sm shrink-0 active:scale-95"
              title={isUrdu ? 'نماز کے اوقات کی تفصیلات کھولیں' : 'Open Prayer Times Schedule'}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-700 animate-pulse shrink-0" />
              <span>
                {isUrdu ? 'اوقاتِ نماز' : 'Prayer Times'}
              </span>
            </button>

            {/* Notification Bell */}
            <NotificationBell lang={lang} onNavigateSection={(sec) => handleNavClick(sec)} />

            {/* Reels Button at top header */}
            <button
              id="header-reels-btn"
              onClick={onReelsClick}
              className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-extrabold text-[11px] sm:text-xs shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
              title={isUrdu ? 'ملٹی پلیٹ فارم لائیو ریلز دیکھیں' : 'Watch Reels on Facebook, YouTube & Instagram'}
            >
              <Video className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>{isUrdu ? 'ریلز' : 'Reels'}</span>
            </button>

            {/* Language Switcher Button */}
            <button
              id="lang-toggle"
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-800 hover:border-emerald-600 hover:text-emerald-700 transition-all duration-200 text-[11px] sm:text-xs font-bold cursor-pointer bg-white shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{lang === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Admin Portal Button */}
            {onOpenAdmin && (
              <button
                id="header-admin-btn"
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-xl border border-amber-200 text-amber-700 hover:border-amber-500 hover:text-amber-800 transition-all duration-200 text-[11px] sm:text-xs font-bold cursor-pointer bg-amber-50 shrink-0"
                title={isUrdu ? 'ایڈمن پورٹل' : 'Admin CRM Portal'}
              >
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{isUrdu ? 'ایڈمن' : 'Admin'}</span>
              </button>
            )}

            {/* Direct Donate Button (Desktop) */}
            <button
              id="header-donate-btn"
              onClick={() => handleNavClick('donate')}
              className={`hidden lg:flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-colors duration-150 cursor-pointer active:scale-95 border ${
                activeSection === 'donate'
                  ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800'
              } ${isUrdu ? 'font-urdu' : 'font-sans'}`}
            >
              <Heart className="w-3.5 h-3.5 fill-current text-white/90" />
              <span>{DICTIONARY.nav.donate[lang]}</span>
            </button>

            {/* Mobile Menu Hamburger (Three Lines Icon) - ALWAYS VISIBLE AND NEVER CUT OFF */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-900 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 border border-slate-300 focus:outline-none cursor-pointer shrink-0 shadow-sm active:scale-95 ml-0.5"
              aria-label="Toggle Navigation Menu"
              title={isUrdu ? 'نیویگیشن مینو کھولیں' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white border-t border-slate-200 overflow-hidden shadow-xl"
            >
              <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
                {/* Mobile Top Social Bar */}
                <div className="mb-3 pb-3 border-b border-slate-100">
                  <span className={`block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
                    {isUrdu ? 'سوشل میڈیا لنکس (براہ راست وزٹ کریں)' : 'Official Social Media Channels'}
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <a
                      href="https://facebook.com/hasnainfoundation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200"
                    >
                      <Facebook className="w-5 h-5 text-blue-600 mb-0.5" />
                      <span className="text-[10px] font-bold">Facebook</span>
                    </a>
                    <a
                      href="https://wa.me/923180202424"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors border border-emerald-200"
                    >
                      <MessageCircle className="w-5 h-5 text-emerald-600 mb-0.5" />
                      <span className="text-[10px] font-bold">WhatsApp</span>
                    </a>
                    <a
                      href="https://www.instagram.com/hasnainfoundation?igsh=ZWtrdHA3a3I1Mndp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors border border-pink-200"
                    >
                      <Instagram className="w-5 h-5 text-pink-600 mb-0.5" />
                      <span className="text-[10px] font-bold">Instagram</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@HasnainFoundation-t8n"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-colors border border-red-200"
                    >
                      <Youtube className="w-5 h-5 text-red-600 mb-0.5" />
                      <span className="text-[10px] font-bold">YouTube</span>
                    </a>
                  </div>
                </div>

                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`block w-full py-2.5 px-4 rounded-xl text-[14px] font-bold text-left transition-all duration-200 cursor-pointer ${
                      activeSection === item.id
                        ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                    } ${isUrdu ? 'font-urdu text-right border-l-0 border-r-4 border-emerald-700' : 'font-sans'}`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Mobile direct donate block */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    id="mobile-donate-btn"
                    onClick={() => handleNavClick('donate')}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 text-white font-bold text-sm cursor-pointer hover:bg-emerald-800 transition-colors ${
                      isUrdu ? 'font-urdu' : 'font-sans'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current text-white/90" />
                    <span>{DICTIONARY.nav.donate[lang]}</span>
                  </button>

                  {onOpenAdmin && (
                    <button
                      id="mobile-admin-btn"
                      onClick={() => {
                        onOpenAdmin();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm cursor-pointer hover:bg-amber-100 transition-colors ${
                        isUrdu ? 'font-urdu' : 'font-sans'
                      }`}
                    >
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span>{isUrdu ? 'ایڈمن CRM پورٹل' : 'Admin CRM Portal'}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
