/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { EVENTS_DATA, NEWS_DATA } from '../data';
import { Bell, X, Calendar, Megaphone, Check, Sparkles, ExternalLink, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationBellProps {
  lang: Language;
  onNavigateSection: (sectionId: string) => void;
}

export interface NotificationItem {
  id: string;
  type: 'event' | 'news';
  title: { en: string; ur: string };
  date: string;
  description: { en: string; ur: string };
  isNew: boolean;
  sectionId: string;
}

export default function NotificationBell({ lang, onNavigateSection }: NotificationBellProps) {
  const isUrdu = lang === 'ur';
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(3);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [browserAlertsEnabled, setBrowserAlertsEnabled] = useState(false);

  useEffect(() => {
    // Generate initial notifications list from upcoming events and news
    const upcomingEvents = EVENTS_DATA.slice(0, 2).map((ev, i) => ({
      id: `notif-event-${ev.id}`,
      type: 'event' as const,
      title: ev.title,
      date: ev.date,
      description: ev.description,
      isNew: i === 0,
      sectionId: 'events'
    }));

    const latestNews = NEWS_DATA.slice(0, 2).map((nw, i) => ({
      id: `notif-news-${nw.id}`,
      type: 'news' as const,
      title: nw.title,
      date: nw.date,
      description: nw.excerpt,
      isNew: true,
      sectionId: 'news'
    }));

    setNotifications([...upcomingEvents, ...latestNews]);
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
  };

  const handleItemClick = (item: NotificationItem) => {
    if (item.isNew) {
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isNew: false } : n));
    }
    setIsOpen(false);
    onNavigateSection(item.sectionId);
  };

  const handleToggleBrowserAlerts = () => {
    if (!browserAlertsEnabled) {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setBrowserAlertsEnabled(true);
            new Notification(
              isUrdu ? 'حسنین فاؤنڈیشن اعلانات' : 'Hasnain Foundation Alerts',
              {
                body: isUrdu ? 'آپ کو نئی تقاریب اور لائیو خبروں کے نوٹیفکیشن موصول ہوں گے!' : 'You are now subscribed to upcoming events and news alerts!',
                icon: '/icon.png'
              }
            );
          }
        });
      } else {
        setBrowserAlertsEnabled(true);
      }
    } else {
      setBrowserAlertsEnabled(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 transition-all duration-200 cursor-pointer shrink-0 active:scale-95 flex items-center justify-center"
        title={isUrdu ? 'اعلانات اور نئی تقاریب' : 'Notifications & Upcoming Events'}
        aria-label="Toggle Notifications"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-amber-600 animate-bounce' : 'text-slate-600'}`} />

        {/* Animated Red Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Popover Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div 
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-12 ${
                isUrdu ? 'left-0 sm:-left-4' : 'right-0 sm:-right-4'
              } z-50 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden font-sans text-left`}
            >
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-black tracking-wide ${isUrdu ? 'font-urdu' : ''}`}>
                      {isUrdu ? 'تازہ ترین اعلانات اور تقاریب' : 'News & Upcoming Events'}
                    </h3>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {unreadCount > 0 
                        ? (isUrdu ? `${unreadCount} نئے نوٹیفکیشن موصول ہوئے` : `${unreadCount} unread updates`)
                        : (isUrdu ? 'تمام نوٹیفکیشن دیکھ لیے گئے' : 'All caught up')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                      title={isUrdu ? 'تمام پڑھے ہوئے نشان زد کریں' : 'Mark all read'}
                    >
                      <Check className="w-3 h-3 text-emerald-400 inline mr-0.5" />
                      {isUrdu ? 'پڑھے گئے' : 'Read'}
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start relative ${
                        item.isNew ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Left Icon Badge */}
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        item.type === 'event'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.type === 'event' ? <Calendar className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            item.type === 'event' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.type === 'event' 
                              ? (isUrdu ? 'تقریب' : 'Upcoming Event')
                              : (isUrdu ? 'اہم خبر' : 'News Alert')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                        </div>

                        <h4 className={`text-xs font-bold text-slate-900 line-clamp-1 ${isUrdu ? 'font-urdu text-right' : 'text-left'}`}>
                          {item.title[lang]}
                        </h4>

                        <p className={`text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight ${isUrdu ? 'font-urdu text-right' : 'text-left'}`}>
                          {item.description[lang]}
                        </p>
                      </div>

                      {/* New Dot */}
                      {item.isNew && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {isUrdu ? 'کوئی نیا نوٹیفکیشن موجود نہیں ہے' : 'No new notifications'}
                  </div>
                )}
              </div>

              {/* Footer Subscription Toggle */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`text-[11px] font-bold text-slate-600 ${isUrdu ? 'font-urdu' : ''}`}>
                  {isUrdu ? 'براؤزر نوٹیفکیشن الرٹس:' : 'Instant Browser Alerts:'}
                </span>

                <button
                  onClick={handleToggleBrowserAlerts}
                  className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                    browserAlertsEnabled
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {browserAlertsEnabled 
                    ? (isUrdu ? 'فعال ہیں ✓' : 'Enabled ✓') 
                    : (isUrdu ? 'آن کریں' : 'Enable')}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
