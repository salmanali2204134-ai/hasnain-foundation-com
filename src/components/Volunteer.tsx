/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { Users, Mail, Phone, Calendar, Heart, CheckCircle2, Sparkles, Send, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { submitVolunteerToSupabase } from '../lib/supabase';

interface VolunteerProps {
  lang: Language;
  onOpenForm?: () => void;
}

export interface VolunteerSignUp {
  id: string;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  availability: string;
  timestamp: string;
}

export default function Volunteer({ lang, onOpenForm }: VolunteerProps) {
  const isUrdu = lang === 'ur';

  return (
    <section id="volunteer-section" className="py-20 sm:py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs sm:text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'رضاکار بنیں' : 'Volunteer Program'}
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
            {isUrdu ? 'رضائے الٰہی کے لیے انسانیت کی خدمت میں ہمارا ہاتھ بٹائیں' : 'Serve Humanity with Hasnain Foundation'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-slate-500 text-sm sm:text-base mt-3 leading-relaxed ${
              isUrdu ? 'font-urdu leading-loose text-base text-slate-600' : 'font-sans'
            }`}
          >
            {isUrdu 
              ? 'حسنین فاؤنڈیشن کا کوئی بھی کام رضاکاروں کی انتھک محنت کے بغیر ممکن نہیں۔ آئیے دکھی انسانیت کی خدمت اور معاشرتی اصلاح کی اس بابرکت مہم کا حصہ بنیں۔' 
              : 'Our initiatives are powered by the incredible dedication of our volunteer family. Join us to help support marginalized communities, organize gatherings, and drive direct impact on the ground.'}
          </motion.p>

          {/* TOP BUTTON FOR ONLINE FORM */}
          {onOpenForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 flex justify-center"
            >
              <button
                id="volunteer-top-form-btn"
                onClick={onOpenForm}
                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-900/20 border border-emerald-500/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  isUrdu ? 'font-urdu' : 'font-sans'
                }`}
              >
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>{isUrdu ? '📋 آن لائن رضاکار فارم پر کریں' : '📋 Open Online Volunteer Form'}</span>
                <Send className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Content Splitting Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch ${
          isUrdu ? 'lg:flex-row-reverse' : ''
        }`}>
          
          {/* Volunteer Pitch details: Left (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* Direct Cards for benefits */}
            <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 flex-grow flex flex-col justify-center">
              
              <h3 className={`text-lg sm:text-xl font-bold text-slate-900 mb-2 ${isUrdu ? 'font-urdu text-right' : 'text-left'}`}>
                {isUrdu ? 'آپ فاؤنڈیشن کا حصہ کیوں بنیں؟' : 'Why Join Our Volunteer Network?'}
              </h3>

              {/* Bullet 1 */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex-shrink-0 h-11 w-11 flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm sm:text-base font-bold text-slate-800 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'رضائے الٰہی اور آخرت کا اجر' : 'Earn Islamic & Spiritual Rewards'}
                  </h4>
                  <p className={`text-slate-500 text-xs sm:text-sm leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'رسول اللہ ﷺ نے فرمایا: "تم میں سے بہترین شخص وہ ہے جو لوگوں کو سب سے زیادہ فائدہ پہنچائے۔" خالصتاً نیکی کے لیے وقت دیں۔' 
                      : 'Serve solely for the pleasure of Almighty Allah, putting your faith into motion by comforting the impoverished.'}
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl flex-shrink-0 h-11 w-11 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-amber-600 fill-current" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm sm:text-base font-bold text-slate-800 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'براہِ راست عوامی اثرات' : 'Direct Ground-level Impact'}
                  </h4>
                  <p className={`text-slate-500 text-xs sm:text-sm leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'مستحقین تک خشک راشن کی فراہمی، سڑک پر چلنے والے مسافروں کو گرم کھانا پیش کرنا اور واٹر پلانٹ کی دیکھ بھال میں عملاً حصہ لیں۔' 
                      : 'Distribute monthly ration boxes, organize spiritual conferences, and monitor neighborhood RO filtration units directly.'}
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className={`flex gap-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl flex-shrink-0 h-11 w-11 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm sm:text-base font-bold text-slate-800 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'لچکدار اوقاتِ کار' : 'Highly Flexible Commitments'}
                  </h4>
                  <p className={`text-slate-500 text-xs sm:text-sm leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                    {isUrdu 
                      ? 'چاہے آپ کے پاس ہفتے میں صرف دو گھنٹے ہوں، یا صرف چھٹی کے دن، آپ اپنی سہولت کے مطابق وقت وقف کر سکتے ہیں۔' 
                      : 'Whether you can dedicate 2 hours a week or have availability only on weekends, we map responsibilities to suit your schedule.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Volunteer Stats Visual banner */}
            <div className="bg-emerald-950 rounded-2xl p-5 border border-emerald-900 text-emerald-100 flex items-center justify-between">
              <div className={isUrdu ? 'text-right' : 'text-left'}>
                <span className="block text-[10px] text-emerald-300 font-bold uppercase tracking-widest">{isUrdu ? 'ہمارا رضاکار گروپ' : 'Active Network'}</span>
                <span className={`block font-black text-white text-base sm:text-lg mt-1 ${isUrdu ? 'font-urdu' : ''}`}>
                  {isUrdu ? '۱۵۰+ سرگرم اسلامی بھائی' : '150+ Dedicated Members'}
                </span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl text-amber-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* VOLUNTEER ONLINE CTA CARD: Right (lg:col-span-6) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 rounded-3xl border border-emerald-800/80 p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            
            {/* Background glowing ambient light */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className={`space-y-6 relative z-10 ${isUrdu ? 'text-right' : 'text-left'}`}>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-700 text-emerald-300 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isUrdu ? 'آن لائن اندراج کا نظام' : 'Instant Online Registration'}</span>
              </div>

              <h3 className={`text-2xl sm:text-3xl font-black text-white ${isUrdu ? 'font-urdu leading-snug' : 'font-sans'}`}>
                {isUrdu ? 'آن لائن فارم کے ذریعے ابھی رجسٹر ہوں' : 'Register via Online Application Form'}
              </h3>

              <p className={`text-emerald-100/80 text-sm sm:text-base leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
                {isUrdu 
                  ? 'آن لائن فارم بٹن پر کلک کریں۔ فارم میں اپنا نام، رابطہ نمبر اور اپنی پسند کے فلاحی شعبہ جات منتخب کریں۔ ہماری انتظامیہ فوراً آپ کی درخواست موصول کر کے آپ سے رابطہ کرے گی۔' 
                  : 'Click the button below to launch the online registration form. Enter your contact details and select your welfare focus areas to submit your application directly to our administration.'}
              </p>

              {/* List of volunteer areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span className={`text-xs font-bold text-white ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'راشن و لنگر کی تقسیم' : 'Ration & Food Distribution'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <span className={`text-xs font-bold text-white ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'طبی کیمپ اور فلٹریشن' : 'Medical & Water Welfare'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className={`text-xs font-bold text-white ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'تقاریب و انتظامی امور' : 'Events & Administration'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                  <span className={`text-xs font-bold text-white ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'سوشل میڈیا اور آئی ٹی' : 'Media & Tech Support'}
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Modal Action Button */}
            <div className="pt-8 relative z-10">
              <button
                id="volunteer-online-form-launch-btn"
                onClick={onOpenForm}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all cursor-pointer ${
                  isUrdu ? 'font-urdu' : 'font-sans'
                }`}
              >
                <Send className="w-5 h-5 text-slate-950" />
                <span>{isUrdu ? 'آن لائن رجسٹریشن فارم کھولیں' : 'Open Online Volunteer Form'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
