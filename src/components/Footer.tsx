/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types';
import { DICTIONARY } from '../data';
import Logo from './Logo';
import { Facebook, Youtube, Instagram, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  lang: Language;
  setActiveSection: (section: string) => void;
  onOpenAdmin?: () => void;
  onOpenComplaint?: () => void;
}

export default function Footer({ lang, setActiveSection, onOpenAdmin, onOpenComplaint }: FooterProps) {
  const isUrdu = lang === 'ur';

  const handleNavClick = (id: string) => {
    setActiveSection(id);
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/hasnainfoundation', color: 'hover:text-royal-500' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@HasnainFoundation-t8n', color: 'hover:text-red-500' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/hasnainfoundation?igsh=ZWtrdHA3a3I1Mndp', color: 'hover:text-pink-500' },
    { name: 'WhatsApp', icon: Phone, url: 'https://wa.me/923180202424', color: 'hover:text-emerald-500' }
  ];

  const quickLinks = [
    { id: 'home', label: DICTIONARY.nav.home[lang] },
    { id: 'about', label: DICTIONARY.nav.about[lang] },
    { id: 'services', label: DICTIONARY.nav.services[lang] },
    { id: 'projects', label: DICTIONARY.nav.projects[lang] }
  ];

  const secondaryLinks = [
    { id: 'events', label: DICTIONARY.nav.events[lang] },
    { id: 'gallery', label: DICTIONARY.nav.gallery[lang] },
    { id: 'transparency', label: DICTIONARY.nav.transparency[lang] },
    { id: 'news', label: DICTIONARY.nav.news[lang] }
  ];

  const handleLegalAlert = (type: string) => {
    alert(
      isUrdu
        ? `آپ کی فرمائش کردہ "${type}" کی قانونی دستاویز کا نمونہ یہاں کھلے گا۔`
        : `Opening legal draft for "${type}".`
    );
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 relative overflow-hidden">
      
      {/* Clean Flat Accent Stripe */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900 ${
          isUrdu ? 'md:flex-row-reverse text-right' : 'text-left'
        }`}>
          
          {/* BRAND COLUMN: md:col-span-5 */}
          <div className="md:col-span-5 space-y-6">
            <Logo lang={lang} variant="footer" />
            <p className={`text-slate-500 text-xs leading-relaxed max-w-sm ${
              isUrdu ? 'font-urdu leading-loose text-sm' : 'font-sans'
            }`}>
              {DICTIONARY.footer.tagline[lang]}
            </p>
            
            {/* Social media flat icons */}
            <div className={`flex gap-3 items-center ${isUrdu ? 'justify-end' : 'justify-start'}`}>
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 transition-colors ${link.color} hover:border-slate-700`}
                    aria-label={link.name}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* QUICK LINKS: md:col-span-3 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className={`text-white text-xs font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu' : ''}`}>
              {DICTIONARY.footer.quickLinks[lang]}
            </h4>
            
            <div className={`grid grid-cols-2 gap-2 text-xs ${isUrdu ? 'font-urdu' : ''}`}>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              
              <ul className="space-y-2">
                {secondaryLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CONTACT BRIEF: md:col-span-4 */}
          <div className="md:col-span-4 space-y-4 text-xs">
            <h4 className={`text-white text-xs font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu ? 'رابطہ فاؤنڈیشن' : 'Contact Support'}
            </h4>
            
            <ul className="space-y-3">
              <li className={`flex gap-2.5 items-start ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className={`text-xs text-slate-500 ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                  {isUrdu 
                    ? "جامع مسجد عبدالقادر جیلانی، سرجانی ٹاؤن، کراچی" 
                    : "Jamia Masjid Abdul Qadir Jilani, Surjani Town, Karachi"}
                </span>
              </li>
              <li className={`flex gap-2.5 items-center ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="font-mono text-xs font-semibold">03180202424</span>
              </li>
              <li className={`flex gap-2.5 items-center ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <Mail className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="font-mono text-xs">info@hasnainfoundation.org</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM METADATA & LEGAL COLUMN */}
        <div className={`pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 ${
          isUrdu ? 'md:flex-row-reverse font-urdu' : ''
        }`}>
          {/* Trademark text */}
          <p className="text-center md:text-left max-w-lg leading-relaxed">
            {DICTIONARY.footer.allRightsReserved[lang]}
            <br />
            <span className="font-sans font-semibold mt-1 block">Copyright © 2026 Hasnain Foundation.</span>
          </p>

          {/* Legal references */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() => handleLegalAlert(DICTIONARY.footer.privacy[lang])}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
            >
              {DICTIONARY.footer.privacy[lang]}
            </button>
            <span className="text-slate-800">|</span>
            <button
              onClick={() => handleLegalAlert(DICTIONARY.footer.terms[lang])}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
            >
              {DICTIONARY.footer.terms[lang]}
            </button>
            {onOpenComplaint && (
              <>
                <span className="text-slate-800">|</span>
                <button
                  onClick={onOpenComplaint}
                  className="hover:text-rose-400 text-rose-500 font-extrabold transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <span>{isUrdu ? 'شکایت درج کریں' : 'File Complaint'}</span>
                </button>
              </>
            )}
            {onOpenAdmin && (
              <>
                <span className="text-slate-800">|</span>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-amber-400 text-amber-500 font-extrabold transition-colors cursor-pointer text-left font-sans flex items-center gap-1"
                >
                  <span>{isUrdu ? 'ایڈمن پینل' : 'Admin Portal'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
