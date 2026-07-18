/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { DICTIONARY } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import AppointmentSystem from './components/AppointmentSystem';
import KnowledgeLibrary from './components/KnowledgeLibrary';
import Projects from './components/Projects';
import Events from './components/Events';
import Gallery from './components/Gallery';
import News from './components/News';
import SuccessStories from './components/SuccessStories';
import SocialFeed from './components/SocialFeed';
import Transparency from './components/Transparency';
import Donate from './components/Donate';
import Volunteer from './components/Volunteer';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DonationTracker from './components/DonationTracker';
import AdminPanel from './components/AdminPanel';
import useMetaTags from './hooks/useMetaTags';
import { Phone, Heart, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [targetProjectId, setTargetProjectId] = useState<string | undefined>(undefined);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const isUrdu = lang === 'ur';

  // Dynamic SEO, Open Graph and Twitter Card tags synchronization hook
  useMetaTags({ lang, activeSection });

  // Synchronize document attributes like direction (RTL/LTR) based on language choice
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (lang === 'ur') {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.setAttribute('lang', 'ur');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.setAttribute('lang', 'en');
    }
  }, [lang]);

  // Handle scroll trigger for Scroll-to-Top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll coordination for homepage scrolling or full page transitions
  useEffect(() => {
    if (activeSection === 'donate' || activeSection === 'transparency' || activeSection === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const scrollToElement = () => {
      const element = document.getElementById(`${activeSection}-section`);
      if (element) {
        // Calculate header offset
        const header = document.getElementById('app-header');
        const headerOffset = header ? header.offsetHeight : 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        return true;
      }
      return false;
    };

    // Try immediately
    if (!scrollToElement()) {
      // If not found, try after a brief delay to allow transition/mounting
      const timer = setTimeout(() => {
        scrollToElement();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  const handleProjectDonate = (projectId?: string) => {
    setTargetProjectId(projectId);
    setActiveSection('donate');
  };

  const handleWhatsAppChat = () => {
    const greeting = encodeURIComponent(
      isUrdu 
        ? "السلام علیکم حسنین فاؤنڈیشن! میں انسانیت کی خدمت کے کاموں میں حصہ لینا چاہتا ہوں۔" 
        : "Assalam-o-Alaikum Hasnain Foundation! I would like to enquire about volunteering and supporting your welfare activities."
    );
    window.open(`https://wa.me/923180202424?text=${greeting}`, '_blank');
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 selection:bg-emerald-600 selection:text-white">
      
      {/* Sticky Header */}
      <Header
        lang={lang}
        setLang={setLang}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Core Body */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeSection === 'donate' ? (
            <motion.div
              key="donate-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <Donate lang={lang} selectedProjectId={targetProjectId} />
            </motion.div>
          ) : activeSection === 'transparency' ? (
            <motion.div
              key="transparency-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <Transparency lang={lang} />
            </motion.div>
          ) : (
            // The stacked, highly interactive multi-section Single Page Layout
            <motion.div
              key="stacked-homepage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 1. Hero Block */}
              <Hero lang={lang} onDonateClick={() => handleProjectDonate()} />

              {/* 2. About Section */}
              <About lang={lang} />

              {/* 3. Services Section */}
              <Services lang={lang} />

              {/* 3.1 Patient Registration / Appointment Booking System */}
              <AppointmentSystem lang={lang} />

              {/* 3.2 Authentic Spiritual Healing Knowledge Library */}
              <KnowledgeLibrary lang={lang} />

              {/* 3.5 Dynamic Donation Goal Tracker */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 -mb-6">
                <DonationTracker lang={lang} onOpenAdmin={() => setIsAdminOpen(true)} />
              </div>

              {/* 4. Projects Section */}
              <Projects lang={lang} onDonateClick={handleProjectDonate} />

              {/* 5. Events Section */}
              <Events lang={lang} />

              {/* 6. Gallery Section */}
              <Gallery lang={lang} />

              {/* 7. News Section */}
              <News lang={lang} />

              {/* 7.2 Success Stories Section (Gemini AI integration) */}
              <SuccessStories lang={lang} />

              {/* 7.3 Real-time Social Media Feed Section */}
              <SocialFeed lang={lang} />

              {/* 7.5 Volunteer Section */}
              <Volunteer lang={lang} />

              {/* 8. Contact Section */}
              <Contact lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky Footer */}
      <Footer 
        lang={lang} 
        setActiveSection={setActiveSection} 
        onOpenAdmin={() => setIsAdminOpen(true)} 
      />

      {/* Admin Panel Modal */}
      <AdminPanel 
        lang={lang} 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />

      {/* FLOATING ACTION TRAYS AT BOTTOM RIGHT/LEFT */}
      <div className={`fixed bottom-6 z-40 flex flex-col gap-3 ${
        isUrdu ? 'left-6 items-start' : 'right-6 items-end'
      }`}>
        
        {/* Sticky Mobile/Desktop Quick Donate Button */}
        {activeSection !== 'donate' && (
          <motion.button
            id="floating-donate-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection('donate')}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 cursor-pointer border border-amber-400"
          >
            <Heart className="w-4 h-4 fill-current text-slate-950" />
            <span className={isUrdu ? 'font-urdu' : ''}>
              {isUrdu ? 'فوری فنڈز عطیہ' : 'Quick Donate'}
            </span>
          </motion.button>
        )}

        {/* Floating WhatsApp Chat Help Button */}
        <motion.button
          id="floating-whatsapp-btn"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWhatsAppChat}
          className="p-4 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 cursor-pointer border border-emerald-400/20"
          title={isUrdu ? 'واٹس ایپ پر مدد' : 'WhatsApp Support'}
        >
          {/* Custom chat indicator icon */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.463L0 24zm6.59-4.846c1.6.95 3.198 1.45 4.793 1.451 5.48-.001 9.938-4.462 9.941-9.945.002-2.656-1.03-5.153-2.903-7.029C16.55 1.758 14.053.724 11.4.724c-5.485 0-9.94 4.46-9.944 9.947-.001 1.772.484 3.5 1.403 5.01L1.817 21.7l6.096-1.597c1.554.846 3.102 1.272 4.734 1.275zm11.455-7.613c-.307-.154-1.817-.897-2.098-.999-.282-.102-.487-.154-.69.154-.204.307-.791.999-.971 1.203-.18.204-.36.229-.667.077-.307-.154-1.3-.48-2.476-1.529-.915-.816-1.533-1.824-1.713-2.131-.18-.307-.019-.473.135-.626.139-.138.307-.359.461-.538.154-.18.205-.307.307-.513.102-.204.051-.384-.026-.538-.077-.154-.69-1.666-.946-2.28-.248-.598-.501-.518-.69-.527-.18-.009-.385-.01-.591-.01s-.538.077-.82.384c-.282.307-1.077 1.051-1.077 2.563 0 1.512 1.097 2.972 1.25 3.177.154.204 2.154 3.29 5.218 4.616.729.316 1.298.505 1.741.646.732.233 1.398.2 1.925.122.587-.088 1.816-.743 2.073-1.461.256-.718.256-1.333.18-1.461-.077-.128-.282-.204-.59-.359z"/>
          </svg>
        </motion.button>

        {/* Scroll To Top Action */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleScrollTop}
              className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white shadow-md cursor-pointer border border-slate-800"
              title={isUrdu ? 'اوپر جائیں' : 'Scroll to Top'}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
