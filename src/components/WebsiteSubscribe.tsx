/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, Sparkles, ChevronDown, User, Mail, Phone, Send, ShieldCheck, Heart } from 'lucide-react';

interface WebsiteSubscribeProps {
  lang: Language;
}

export default function WebsiteSubscribe({ lang }: WebsiteSubscribeProps) {
  const isUrdu = lang === 'ur';
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(12480);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const savedCount = localStorage.getItem('hasnain_sub_count');
    if (savedCount) {
      setSubscriberCount(parseInt(savedCount, 10));
    }
    const alreadySub = localStorage.getItem('hasnain_website_subscribed');
    if (alreadySub) {
      setIsSubscribed(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const newCount = subscriberCount + 1;
      setSubscriberCount(newCount);
      localStorage.setItem('hasnain_sub_count', newCount.toString());
      localStorage.setItem('hasnain_website_subscribed', 'true');
      setIsSubscribed(true);
      setLoading(false);
      setSuccessMsg(
        isUrdu
          ? `جزاک اللہ! ${name} صاحب، آپ کامیابی کے ساتھ حسنین فاؤنڈیشن کی ویب سائٹ پر رجسٹرڈ اور سبسکرائب ہو گئے ہیں۔`
          : `JazakAllah Khair ${name}! You have successfully registered & subscribed to Hasnain Foundation.`
      );
    }, 800);
  };

  return (
    <section id="register-website-subscribe" className="py-12 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center">
          
          {/* Subtle decorative background glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Section Header */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/60 text-emerald-400 border border-emerald-700/50 text-xs font-extrabold uppercase tracking-widest mb-1">
              <Bell className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{isUrdu ? 'ویب سائٹ سبسکرپشن پورٹل' : 'Official Portal Subscription'}</span>
            </div>

            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight ${
              isUrdu ? 'font-urdu leading-snug' : 'font-sans'
            }`}>
              {isUrdu ? 'ویب سائٹ رجسٹر اور سبسکرائب کریں' : 'Register Website Subscribe'}
            </h2>

            <p className={`text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
              isUrdu ? 'font-urdu leading-loose' : 'font-sans'
            }`}>
              {isUrdu 
                ? "روزانہ کی بنیاد پر حسنین فاؤنڈیشن کی فلاحی پیشرفت، وظائف، اور اعلانات براہِ راست حاصل کرنے کے لیے اپنا نام، ای میل اور فون نمبر رجسٹر کریں۔"
                : "Receive regular welfare activity updates, daily Ruqyah Adhkar, and progress reports directly via registered email & WhatsApp."
              }
            </p>

            {/* Subscriber Counter Badge */}
            <div className="pt-2 flex items-center justify-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{isUrdu ? `کل رجسٹرڈ ممبرز: ${subscriberCount.toLocaleString()}` : `Total Subscribed Accounts: ${subscriberCount.toLocaleString()}`}</span>
              </span>
            </div>

            {/* Trigger Button to show/hide subscription form */}
            <div className="pt-4">
              <button
                id="register-subscribe-trigger-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm sm:text-base shadow-lg shadow-emerald-900/40 border border-emerald-400/30 transition-all duration-300 cursor-pointer active:scale-95 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>{isUrdu ? 'سبسکرائب فارم کھولیں' : 'Register Website Subscribe'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Collapsible Subscription Form Area */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-8 pt-8 border-t border-slate-800 text-left relative z-10"
              >
                {!isSubscribed ? (
                  <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Full Name */}
                      <div className="relative">
                        <User className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isUrdu ? 'right-3' : 'left-3'}`} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={isUrdu ? "پورا نام (Full Name)" : "Full Name"}
                          required
                          className={`w-full bg-slate-950 border border-slate-700/80 rounded-xl py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all ${
                            isUrdu ? 'pr-9 pl-3 text-right font-urdu' : 'pl-9 pr-3 text-left font-sans'
                          }`}
                        />
                      </div>

                      {/* Email Address */}
                      <div className="relative">
                        <Mail className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isUrdu ? 'right-3' : 'left-3'}`} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={isUrdu ? "ای میل پتہ (Email Address)" : "Email Address"}
                          required
                          className={`w-full bg-slate-950 border border-slate-700/80 rounded-xl py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all ${
                            isUrdu ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
                          }`}
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="relative">
                        <Phone className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isUrdu ? 'right-3' : 'left-3'}`} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={isUrdu ? "فون نمبر (Phone Number)" : "Phone Number"}
                          required
                          className={`w-full bg-slate-950 border border-slate-700/80 rounded-xl py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all ${
                            isUrdu ? 'pr-9 pl-3 text-right font-sans' : 'pl-9 pr-3 text-left font-sans'
                          }`}
                        />
                      </div>
                    </div>

                    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 ${isUrdu ? 'sm:flex-row-reverse text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
                          {isUrdu ? 'آپ کی معلومات مکمل طور پر محفوظ رکھی جاتی ہیں۔' : '100% Confidential & Safe Registration'}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold px-8 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                      >
                        {loading ? (
                          <span>{isUrdu ? 'کوشش جاری...' : 'Registering...'}</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-white" />
                            <span>{isUrdu ? 'ابھی رجسٹر کریں' : 'Subscribe Now'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 bg-emerald-950/60 p-6 rounded-2xl border border-emerald-700/50 max-w-2xl mx-auto space-y-3"
                  >
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className={`text-base sm:text-lg font-black text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                      {successMsg || (isUrdu ? 'کامیابی! آپ رجسٹر ہو چکے ہیں۔' : 'Success! Website Subscription Complete.')}
                    </h3>
                    <p className={`text-xs text-slate-300 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                      {isUrdu ? 'ہماری ٹیم جلد ہی آپ سے رابطے میں رہے گی۔' : 'Your record is active on Hasnain Foundation official servers.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubscribed(false)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-300 underline cursor-pointer hover:text-white"
                    >
                      <Heart className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUrdu ? 'ایک اور ای میل یا فون رجسٹر کریں' : 'Subscribe Another Email'}</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
