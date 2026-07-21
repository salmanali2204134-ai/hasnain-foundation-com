/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types';
import { DICTIONARY } from '../data';
import { motion } from 'motion/react';
import { 
  Home, 
  Info, 
  HeartHandshake, 
  Calendar, 
  UserCheck, 
  BookOpen, 
  Target, 
  CalendarDays, 
  Image, 
  ShieldCheck, 
  Newspaper, 
  Users, 
  CreditCard, 
  PhoneCall,
  Heart,
  Sparkles
} from 'lucide-react';

interface RightSidebarProps {
  lang: Language;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function RightSidebar({ lang, activeSection, setActiveSection }: RightSidebarProps) {
  const isUrdu = lang === 'ur';

  const navItems = [
    { id: 'home', label: DICTIONARY.nav.home[lang], icon: Home },
    { id: 'about', label: DICTIONARY.nav.about[lang], icon: Info },
    { id: 'services', label: DICTIONARY.nav.services[lang], icon: HeartHandshake },
    { id: 'portal-system', label: isUrdu ? 'ممبر و رضاکار پورٹل' : 'Membership & Volunteer', icon: Users },
    { id: 'appointment', label: DICTIONARY.nav.appointment[lang], icon: Calendar },
    { id: 'patient-portal', label: DICTIONARY.nav.patientPortal[lang], icon: UserCheck },
    { id: 'durood-bank', label: DICTIONARY.nav.duroodBank[lang], icon: Sparkles },
    { id: 'library', label: DICTIONARY.nav.library[lang], icon: BookOpen },
    { id: 'projects', label: DICTIONARY.nav.projects[lang], icon: Target },
    { id: 'events', label: DICTIONARY.nav.events[lang], icon: CalendarDays },
    { id: 'gallery', label: DICTIONARY.nav.gallery[lang], icon: Image },
    { id: 'transparency', label: DICTIONARY.nav.transparency[lang], icon: ShieldCheck },
    { id: 'news', label: DICTIONARY.nav.news[lang], icon: Newspaper },
    { id: 'volunteer', label: DICTIONARY.nav.volunteer[lang], icon: Users },
    { id: 'contact', label: DICTIONARY.nav.contact[lang], icon: PhoneCall },
  ];

  return (
    <aside 
      id="right-navigation-sidebar"
      className="hidden lg:flex fixed right-0 top-0 bottom-0 h-screen w-72 bg-white border-l border-slate-200 z-30 flex-col shadow-xl justify-between pt-32 pb-6 px-4 overflow-y-auto"
    >
      <div className="flex flex-col gap-6">
        {/* Decorative branding/header for sidebar */}
        <div className={`px-2 flex flex-col gap-1.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <span className="text-[10px] font-black tracking-wider text-emerald-700 uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{isUrdu ? 'نیویگیشن پورٹل' : 'Navigation Portal'}</span>
          </span>
          <h3 className={`text-xs font-black text-slate-400 uppercase ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu ? 'حسنین فاؤنڈیشن سروسز' : 'Hasnain Foundation'}
          </h3>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`group relative flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-150 cursor-pointer ${
                  isActive 
                    ? 'text-emerald-800 bg-emerald-50/70 border border-emerald-100' 
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50 border border-transparent'
                } ${isUrdu ? 'flex-row-reverse text-right font-urdu text-sm' : 'flex-row text-left'}`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                }`}>
                  <IconComponent className="w-4 h-4 shrink-0" />
                </div>
                
                <span className="flex-grow tracking-tight leading-none">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className={`absolute w-1.5 h-6 bg-emerald-700 rounded-full ${
                      isUrdu ? 'left-0' : 'right-0'
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Decorative footer inside sidebar */}
      <div className={`mt-8 pt-4 border-t border-slate-100 flex flex-col gap-3 px-2 ${isUrdu ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="text-[11px] font-bold text-slate-500">
            {isUrdu ? 'سسٹم فعال ہے' : 'All Services Active'}
          </span>
        </div>
        <p className={`text-[10px] text-slate-400 font-medium leading-relaxed ${isUrdu ? 'font-urdu' : ''}`}>
          {isUrdu 
            ? 'حسنین فاؤنڈیشن دکھی انسانیت کی خدمت کے لیے ہمہ وقت کوشاں ہے۔'
            : 'Striving for excellence in healthcare, education, and spiritual well-being.'}
        </p>
      </div>
    </aside>
  );
}
