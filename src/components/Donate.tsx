/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { DICTIONARY } from '../data';
import DonationTracker from './DonationTracker';
import { Landmark, Smartphone, Copy, Check, Send, Award, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DonateProps {
  lang: Language;
  selectedProjectId?: string;
}

export default function Donate({ lang, selectedProjectId }: DonateProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Pledge interactive panel state
  const [pledgeName, setPledgeName] = useState('');
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [pledgeCategory, setPledgeCategory] = useState('general');
  const [showThankYou, setShowThankYou] = useState(false);

  const isUrdu = lang === 'ur';

  const bankDetails = {
    bankName: "UBL Ameen Islamic Banking",
    title: "HASNAIN FOUNDATION",
    account: "0109000363312688",
    iban: "PK62UNIL0109000363312688",
    branch: isUrdu ? "محمود آباد برانچ، کراچی، پاکستان" : "Mahmoodabad Branch, Karachi, Pakistan"
  };

  const walletDetails = [
    { name: "Easypaisa", number: "03152204134", color: "bg-emerald-600 text-white" },
    { name: "JazzCash", number: "03202628645", color: "bg-amber-600 text-white" },
    { name: "SadaPay", number: "03180202424", color: "bg-teal-600 text-white" },
    { name: "NayaPay", number: "03180202424", color: "bg-orange-500 text-white" }
  ];

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedKey(key);
          setTimeout(() => setCopiedKey(null), 2000);
        })
        .catch(() => {
          setCopiedKey(key);
          setTimeout(() => setCopiedKey(null), 2000);
        });
    } else {
      // Fallback
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName || !pledgeAmount) return;
    setShowThankYou(true);
  };

  const handleResetPledge = () => {
    setPledgeName('');
    setPledgeAmount('');
    setPledgeCategory('general');
    setShowThankYou(false);
  };

  // Vector QR Code representation
  const renderVectorQrCode = () => (
    <div className="relative w-44 h-44 bg-white rounded-2xl border-4 border-emerald-600 p-2 flex items-center justify-center shadow-md">
      {/* Authentic QR pattern using SVG grids */}
      <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
        {/* Top Left Finder pattern */}
        <rect x="0" y="0" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
        <rect x="8" y="8" width="14" height="14" fill="currentColor" />
        
        {/* Top Right Finder pattern */}
        <rect x="70" y="0" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
        <rect x="78" y="8" width="14" height="14" fill="currentColor" />
        
        {/* Bottom Left Finder pattern */}
        <rect x="0" y="70" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
        <rect x="8" y="78" width="14" height="14" fill="currentColor" />

        {/* Dynamic tiny dots matching a real QR code */}
        <rect x="40" y="5" width="6" height="6" />
        <rect x="52" y="12" width="6" height="6" />
        <rect x="45" y="24" width="6" height="12" />
        
        <rect x="5" y="45" width="12" height="6" />
        <rect x="22" y="40" width="6" height="6" />
        <rect x="15" y="55" width="6" height="10" />

        <rect x="45" y="45" width="10" height="10" fill="#059669" /> {/* Emerald Center Anchor */}
        
        <rect x="75" y="45" width="12" height="6" />
        <rect x="85" y="55" width="8" height="8" />
        <rect x="70" y="65" width="10" height="6" />
        
        <rect x="40" y="75" width="12" height="12" />
        <rect x="58" y="85" width="15" height="6" />
        <rect x="85" y="85" width="10" height="10" />
      </svg>
      {/* Overlay Hasnain Foundation Emblem inside QR */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 bg-white rounded-full border-2 border-amber-500 flex items-center justify-center shadow-sm">
          <Heart className="w-5 h-5 text-emerald-600 fill-current" />
        </div>
      </div>
    </div>
  );

  return (
    <section id="donate-section" className="py-20 sm:py-24 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-100 text-xs sm:text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Heart className="w-3.5 h-3.5 text-amber-700 fill-current" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'صدقہ اور عطیات' : 'Sadaqah & Zakat'}
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
            {DICTIONARY.donate.subtitle[lang]}
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
            {DICTIONARY.donate.appealText[lang]}
          </motion.p>
        </div>

        {/* Dynamic Donation Goal Tracker */}
        <div className="mb-14">
          <DonationTracker lang={lang} />
        </div>

        {/* Main Content Box: Payment Channels vs interactive Pledge */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start ${
          isUrdu ? 'lg:flex-row-reverse' : ''
        }`}>
          
          {/* PAYMENT DETAILS: Left (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* BANK DETAILS CARD */}
            <motion.div
              initial={{ opacity: 0, x: isUrdu ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 relative overflow-hidden shadow-none"
            >
              <div className={`flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200/80 ${
                isUrdu ? 'flex-row-reverse text-right' : 'text-left'
              }`}>
                <div className="p-2.5 bg-amber-50 text-amber-800 border border-amber-100 rounded-lg">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {DICTIONARY.donate.bankSection[lang]}
                  </h3>
                  <p className="text-xs text-amber-700 font-bold tracking-wider uppercase font-sans mt-0.5">
                    {bankDetails.bankName}
                  </p>
                </div>
              </div>

              {/* Bank credentials lines */}
              <div className="space-y-4 font-sans text-sm">
                
                {/* Account Title */}
                <div className={`flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-slate-400 font-bold text-xs uppercase tracking-wider ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'اکاؤنٹ کا نام' : 'Account Title'}
                  </span>
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {bankDetails.title}
                  </span>
                </div>

                {/* Account Number */}
                <div className={`flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-slate-400 font-bold text-xs uppercase tracking-wider ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'اکاؤنٹ نمبر' : 'Account Number'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 tracking-wider text-sm sm:text-base">
                      {bankDetails.account}
                    </span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.account, 'acc')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-50 cursor-pointer"
                      title="Copy"
                    >
                      {copiedKey === 'acc' ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* IBAN */}
                <div className={`flex justify-between items-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-slate-400 font-bold text-xs uppercase tracking-wider ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'آئی بی اے این (IBAN)' : 'IBAN'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm tracking-wider">
                      {bankDetails.iban}
                    </span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.iban, 'iban')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-50 cursor-pointer"
                      title="Copy"
                    >
                      {copiedKey === 'iban' ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Branch Details */}
                <div className={`flex justify-between items-center gap-4 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
                  <span className={`text-slate-400 font-bold text-xs uppercase tracking-wider ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? 'برانچ' : 'Branch'}
                  </span>
                  <span className={`font-bold text-slate-800 text-xs sm:text-sm ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {bankDetails.branch}
                  </span>
                </div>

              </div>

              {/* Copy Bank Pack Row */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-2.5">
                <button
                  onClick={() => copyToClipboard(bankDetails.account, 'acc')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:text-emerald-700 hover:border-emerald-300 hover:bg-slate-50 cursor-pointer ${
                    isUrdu ? 'font-urdu' : ''
                  }`}
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{DICTIONARY.donate.copyAccount[lang]}</span>
                </button>
                <button
                  onClick={() => copyToClipboard(bankDetails.iban, 'iban')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:text-emerald-700 hover:border-emerald-300 hover:bg-slate-50 cursor-pointer ${
                    isUrdu ? 'font-urdu' : ''
                  }`}
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{DICTIONARY.donate.copyIban[lang]}</span>
                </button>
              </div>
            </motion.div>

            {/* MOBILE WALLETS CARD */}
            <motion.div
              initial={{ opacity: 0, x: isUrdu ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 relative overflow-hidden shadow-none"
            >
              <div className={`flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200/80 ${
                isUrdu ? 'flex-row-reverse text-right' : 'text-left'
              }`}>
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {DICTIONARY.donate.walletSection[lang]}
                  </h3>
                  <p className="text-xs text-emerald-700 font-bold tracking-wider uppercase font-sans mt-0.5">
                    {isUrdu ? 'آسان پیسہ اور جیز کیش والٹس' : 'Instant Easy Transfer'}
                  </p>
                </div>
              </div>

              {/* Wallets mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {walletDetails.map((wallet) => (
                  <div
                    key={wallet.name}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between items-center text-center relative"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{wallet.name}</span>
                    <span className="font-mono font-bold text-slate-900 text-sm sm:text-base tracking-wider mt-2.5">
                      {wallet.number}
                    </span>
                    
                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(wallet.number, wallet.name)}
                      className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-slate-700 hover:text-emerald-700 text-[11px] font-bold border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer shadow-sm"
                    >
                      {copiedKey === wallet.name ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{DICTIONARY.general.copied[lang]}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isUrdu ? 'کاپی کریں' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* WhatsApp reporting link */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className={`flex items-start gap-2.5 text-xs text-slate-500 max-w-md ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                  <AlertCircle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <p className={isUrdu ? 'font-urdu leading-loose' : 'font-sans'}>
                    {isUrdu 
                      ? "رقم کی منتقلی کے بعد، براہ کرم اسکرین شاٹ یا رسید نمبر نیچے دیئے گئے بٹن پر کلک کر کے اپنے نام کے ساتھ واٹس ایپ پر ضرور بھیجیں تاکہ باقاعدہ رسید جاری کی جا سکے۔"
                      : "After making the transfer, please send a screenshot of the receipt or reference code via WhatsApp with your name for confirmation."}
                  </p>
                </div>
                
                <a
                  href={`https://wa.me/923180202424?text=${encodeURIComponent(
                    isUrdu
                      ? "السلام علیکم! میں نے حسنین فاؤنڈیشن کو عطیہ کی رقم منتقل کر دی ہے، برائے مہربانی رسید تصدیق فرما دیں۔"
                      : "Assalam-o-Alaikum! I have transferred my donation to Hasnain Foundation. Here is my payment receipt for verification."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors duration-150 shadow-none ${
                    isUrdu ? 'font-urdu' : ''
                  }`}
                >
                  <Send className="w-4 h-4 rotate-45 sm:rotate-0" />
                  <span>{DICTIONARY.donate.whatsappReceipt[lang]}</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* INTERACTIVE PLEDGE FORM: Right (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct QR Visual Box */}
            <div className="bg-emerald-950 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center text-emerald-100 border border-emerald-900 shadow-none">
              <div className="relative w-44 h-44 bg-white rounded-lg border border-emerald-800 p-2.5 flex items-center justify-center">
                {/* Authentic QR pattern using SVG grids */}
                <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                  {/* Top Left Finder pattern */}
                  <rect x="0" y="0" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="8" y="8" width="14" height="14" fill="currentColor" />
                  
                  {/* Top Right Finder pattern */}
                  <rect x="70" y="0" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="78" y="8" width="14" height="14" fill="currentColor" />
                  
                  {/* Bottom Left Finder pattern */}
                  <rect x="0" y="70" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="8" y="78" width="14" height="14" fill="currentColor" />

                  {/* Dynamic tiny dots matching a real QR code */}
                  <rect x="40" y="5" width="6" height="6" />
                  <rect x="52" y="12" width="6" height="6" />
                  <rect x="45" y="24" width="6" height="12" />
                  
                  <rect x="5" y="45" width="12" height="6" />
                  <rect x="22" y="40" width="6" height="6" />
                  <rect x="15" y="55" width="6" height="10" />

                  <rect x="45" y="45" width="10" height="10" fill="#047857" /> {/* Emerald Center Anchor */}
                  
                  <rect x="75" y="45" width="12" height="6" />
                  <rect x="85" y="55" width="8" height="8" />
                  <rect x="70" y="65" width="10" height="6" />
                  
                  <rect x="40" y="75" width="12" height="12" />
                  <rect x="58" y="85" width="15" height="6" />
                  <rect x="85" y="85" width="10" height="10" />
                </svg>
                {/* Overlay Hasnain Foundation Emblem inside QR */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 bg-white rounded-lg border border-amber-500 flex items-center justify-center shadow-sm">
                    <Heart className="w-4 h-4 text-emerald-700 fill-current" />
                  </div>
                </div>
              </div>
              <h4 className={`text-base font-bold text-white mt-4 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                {DICTIONARY.donate.qrPlaceholder[lang]}
              </h4>
              <p className="text-xs text-emerald-300 max-w-xs mt-2 font-medium leading-relaxed">
                {isUrdu 
                  ? "آسان پیسہ / جیز کیش / نیا پے / بینک ایپ کا اسکینر کھولیں اور براہِ راست فنڈز منتقل کرنے کے لیے اسکین کریں۔" 
                  : "Open your Easypaisa / JazzCash / SadaPay / NayaPay / Mobile Banking QR scanner and scan to transfer funds directly."}
              </p>
            </div>

            {/* Interactive Donation Pledge Panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!showThankYou ? (
                  <motion.form
                    key="pledge-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handlePledgeSubmit}
                    className="space-y-4"
                  >
                    <div className={`flex items-center gap-2 mb-4 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <Heart className="w-5 h-5 text-emerald-700 fill-current" />
                      <h3 className={`text-base font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'آن لائن ریکارڈ کی تیاری' : 'Mock Donation Pledge'}
                      </h3>
                    </div>

                    <p className={`text-xs text-slate-500 leading-relaxed ${isUrdu ? 'font-urdu text-right leading-loose' : 'font-sans'}`}>
                      {isUrdu 
                        ? "عطیہ کی نیت درج کریں اور آن لائن ڈیجیٹل سرٹیفکیٹ حاصل کریں۔ یہ صرف ایک تعلیمی اور آزمائشی عمل ہے۔"
                        : "Enter your mock donation pledge here to see the interactive digital certificate generated for you. Playable & realistic!"}
                    </p>

                    {/* Donor Name */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'عطیہ دہندہ کا نام' : 'Donor Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={pledgeName}
                        onChange={(e) => setPledgeName(e.target.value)}
                        placeholder={isUrdu ? "مثال: احمد علی" : "e.g. Ahmed Ali"}
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-700 text-xs ${
                          isUrdu ? 'text-right font-urdu' : ''
                        }`}
                      />
                    </div>

                    {/* Pledge Amount */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'عطیہ کی رقم (PKR)' : 'Pledge Amount (PKR)'}
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={pledgeAmount}
                        onChange={(e) => setPledgeAmount(e.target.value)}
                        placeholder="e.g. 5000"
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-700 font-mono text-xs ${
                          isUrdu ? 'text-right' : ''
                        }`}
                      />
                    </div>

                    {/* Cause */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'مخصوص فنڈ / مقصد' : 'Designated Cause'}
                      </label>
                      <select
                        value={pledgeCategory}
                        onChange={(e) => setPledgeCategory(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-700 text-xs cursor-pointer ${
                          isUrdu ? 'font-urdu text-right' : ''
                        }`}
                      >
                        <option value="general">{isUrdu ? "عمومی عطیہ (جنرل فنڈ)" : "General Donation"}</option>
                        <option value="masjid">{isUrdu ? "جامع مسجد تعمیراتی فنڈ" : "Jamia Masjid Construction"}</option>
                        <option value="food">{isUrdu ? "راشن اور کھانا فنڈ" : "Food Security Drive"}</option>
                        <option value="education">{isUrdu ? "یتیم بچوں کا تعلیمی فنڈ" : "Orphan Education Support"}</option>
                        <option value="water">{isUrdu ? "آر او پلانٹ / صاف پانی فنڈ" : "Community RO Water Plant"}</option>
                      </select>
                    </div>

                    {/* Submit Pledge */}
                    <button
                      type="submit"
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer ${
                        isUrdu ? 'font-urdu' : ''
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>{isUrdu ? 'عطیہ کا عہد درج کریں' : 'Submit Mock Pledge'}</span>
                    </button>
                  </motion.form>
                ) : (
                  // Thank You screen and customized PDF receipt lookalike!
                  <motion.div
                    key="thankyou-receipt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 text-center"
                  >
                    <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg w-14 h-14 flex items-center justify-center mx-auto">
                      <Award className="w-8 h-8 text-emerald-700" />
                    </div>

                    <div className="space-y-2">
                      <h3 className={`text-xl font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {DICTIONARY.donate.thankYouTitle[lang]}
                      </h3>
                      <p className={`text-xs text-slate-500 leading-relaxed ${
                        isUrdu ? 'font-urdu leading-loose' : 'font-sans'
                      }`}>
                        {DICTIONARY.donate.thankYouMsg[lang]}
                      </p>
                    </div>

                    {/* Highly Polished Certificate Vector representation */}
                    <div className="p-5 rounded-xl bg-slate-50 border border-dashed border-amber-500 text-slate-800 space-y-4 text-xs font-sans relative overflow-hidden">
                      <span className="block text-amber-700 font-extrabold tracking-widest uppercase text-[10px]">
                        {isUrdu ? 'عطیہ کا سرٹیفکیٹ' : 'Certificate of Appreciation'}
                      </span>

                      <div className="space-y-1.5 relative z-10">
                        <p className="text-slate-400 text-[10px]">{isUrdu ? 'یہ سرٹیفکیٹ انتہائی عزت سے پیش کیا جاتا ہے برائے:' : 'Presented with gratitude to:'}</p>
                        <p className={`text-base font-bold text-slate-900 ${isUrdu ? 'font-urdu leading-none' : ''}`}>
                          {pledgeName}
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-3 flex justify-between items-center relative z-10 text-[10px] sm:text-[11px]">
                        <div className="text-left">
                          <span className="block text-slate-400 text-[9px]">{isUrdu ? 'رقم' : 'Amount pledged'}</span>
                          <span className="font-bold text-slate-900 font-mono">PKR {Number(pledgeAmount).toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-slate-400 text-[9px]">{isUrdu ? 'مقصد' : 'Allocated for'}</span>
                          <span className={`font-bold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
                            {pledgeCategory === 'general' ? (isUrdu ? 'عمومی صدقات' : 'General Sadaqah') : 
                             pledgeCategory === 'masjid' ? (isUrdu ? 'تعمیرِ مسجد' : 'Masjid Construction') : 
                             pledgeCategory === 'food' ? (isUrdu ? 'راشن تقسیم' : 'Food Support') : 
                             pledgeCategory === 'education' ? (isUrdu ? 'تعلیمِ اطفال' : 'Orphan Education') : 
                             (isUrdu ? 'آر او پلانٹ' : 'Clean Water')}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[8px] text-slate-400 border-t border-slate-200 pt-3 font-mono">
                        <span>ID: HF-2026-{Math.floor(Math.random() * 89999 + 10000)}</span>
                        <span>DATE: 2026-07-16</span>
                      </div>
                    </div>

                    <button
                      onClick={handleResetPledge}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer bg-white"
                    >
                      {isUrdu ? 'ایک اور عطیہ درج کریں' : 'Make Another Mock Pledge'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
