/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { DICTIONARY } from '../data';
import DonationTracker from './DonationTracker';
import MonthlyDonationReminderModal from './MonthlyDonationReminderModal';
import { Landmark, Smartphone, Copy, Check, Send, Award, Heart, Sparkles, AlertCircle, Printer, Download, Share2, ExternalLink, QrCode, RefreshCw, Bell, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getHasnainFoundationLink } from '../lib/utils';
import easypaisaQrImg from '../assets/images/easypaisa_qr_code_1784809863512.jpg';

interface DonateProps {
  lang: Language;
  selectedProjectId?: string;
}

export default function Donate({ lang, selectedProjectId }: DonateProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Real Donation Receipt System State
  const [donorName, setDonorName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('EasyPaisa');
  const [purpose, setPurpose] = useState(selectedProjectId || 'general');
  const [category, setCategory] = useState<'zakat' | 'fitrat' | 'sadaqat' | 'general'>('zakat');
  const [transactionId, setTransactionId] = useState('');
  const [monthlyReminderOptIn, setMonthlyReminderOptIn] = useState(true);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showThankYou, setShowThankYou] = useState(false);
  const [receipt, setReceipt] = useState<any | null>(null);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !mobile || !amount || !paymentMethod || !purpose || !transactionId) {
      setError(isUrdu ? 'براہ کرم تمام لازمی فیلڈز پُر کریں۔' : 'Please fill in all required fields.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donorName,
          email,
          mobile,
          whatsapp: mobile,
          amount: Number(amount),
          paymentMethod,
          purpose,
          category,
          transactionId,
          monthlyReminder: monthlyReminderOptIn
        })
      });

      const data = await res.json();
      if (data.success && data.donation) {
        setReceipt(data.donation);
        setShowThankYou(true);
      } else {
        setError(data.error || (isUrdu ? 'جمع کرانے میں خرابی پیش آئی۔' : 'Failed to submit donation receipt.'));
      }
    } catch (err: any) {
      setError(isUrdu ? 'نیٹ ورک کا مسئلہ ہے۔ دوبارہ کوشش کریں۔' : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setDonorName('');
    setMobile('');
    setEmail('');
    setAmount('');
    setPaymentMethod('EasyPaisa');
    setPurpose('general');
    setTransactionId('');
    setError(null);
    setReceipt(null);
    setShowThankYou(false);
  };

  const formatCategory = (cat?: string, pur?: string) => {
    const finalCat = cat || (pur === 'zakat' ? 'zakat' : pur === 'fitrat' ? 'fitrat' : pur === 'sadaqat' ? 'sadaqat' : 'general');
    switch (finalCat) {
      case 'zakat': return isUrdu ? '🕋 زکوۃ (فرض شرعی)' : '🕋 Zakat Fund';
      case 'fitrat': return isUrdu ? '🌙 فطرانہ (واجب عید)' : '🌙 Fitra / Fitrat';
      case 'sadaqat': return isUrdu ? '📿 صدقات (نفلی رفاہ)' : '📿 Sadaqat / Sadaqah';
      default: return isUrdu ? '🏛️ عمومی عطیہ (جنرل فنڈ)' : '🏛️ General Charity';
    }
  };

  const formatPurpose = (pur: string) => {
    switch (pur) {
      case 'zakat': return isUrdu ? 'زکوۃ فنڈ (مستحقین)' : 'Zakat (Mustahiq Support)';
      case 'fitrat': return isUrdu ? 'فطرانہ فنڈ (عید الراحت)' : 'Fitra / Fitrat (Eid Relief)';
      case 'sadaqat': return isUrdu ? 'نفلی صدقہ و خیرات' : 'Sadaqah (General Welfare)';
      case 'general': return isUrdu ? 'عمومی فنڈ (مسجد و عمومی)' : 'General Charity / Operations';
      case 'masjid': return isUrdu ? 'جامع مسجد تعمیراتی فنڈ' : 'Jamia Masjid Construction';
      case 'food': return isUrdu ? 'راشن اور کھانا فنڈ' : 'Food Security Drive';
      case 'education': return isUrdu ? 'یتیم بچوں کا تعلیمی فنڈ' : 'Orphan Education Support';
      case 'water': return isUrdu ? 'آر او پلانٹ / صاف پانی فنڈ' : 'Community RO Water Plant';
      default: return pur;
    }
  };

  // Export & Sharing actions
  const triggerDownload = () => {
    if (receipt?.receiptUrl) {
      window.open(receipt.receiptUrl, '_blank');
    }
  };

  const triggerPrint = () => {
    if (receipt?.receiptUrl) {
      window.open(receipt.receiptUrl, '_blank');
    }
  };

  const triggerWhatsAppShare = () => {
    if (!receipt) return;
    const verifyUrl = getHasnainFoundationLink(receipt.id, 'receipt');
    const catText = formatCategory(receipt.category, receipt.purpose);
    const purText = formatPurpose(receipt.purpose);
    const textMsg = `*Hasnain Foundation - Official Donation Receipt* 🌟\n\nDear *${receipt.donorName}*,\nThank you for your generous contribution of *PKR ${receipt.amount.toLocaleString()}* towards *${catText} (${purText})*.\n\n*Receipt details:*\n- *Receipt No:* ${receipt.id}\n- *Sharia Account:* ${catText}\n- *Purpose / Cause:* ${purText}\n- *Transaction ID:* ${receipt.transactionId}\n- *Date:* ${receipt.donationDate} (${receipt.donationTime || ''})\n- *Status:* ${receipt.status.toUpperCase()}\n\n*Verify authenticity online:*\n${verifyUrl}\n\nMay Allah reward you abundantly. Ameen.\nOfficial Email: hasnainfoundation225@gmail.com`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`, '_blank');
  };

  const triggerEmailShare = () => {
    if (!receipt) return;
    const verifyUrl = getHasnainFoundationLink(receipt.id, 'receipt');
    const catText = formatCategory(receipt.category, receipt.purpose);
    const purText = formatPurpose(receipt.purpose);
    const subject = `Official Donation Receipt - Hasnain Foundation (${receipt.id})`;
    const bodyText = `Dear ${receipt.donorName},\n\nAssalam-o-Alaikum,\n\nThank you for your generous donation to the Hasnain Foundation.\n\nReceipt Details:\n-------------------------------\nReceipt ID: ${receipt.id}\nAmount: PKR ${receipt.amount.toLocaleString()}\nSharia Fund Account: ${catText}\nDonation Purpose: ${purText}\nDate: ${receipt.donationDate}\nTransaction Ref: ${receipt.transactionId}\n-------------------------------\n\nVerify this receipt online here:\n${verifyUrl}\n\nOfficial Email: hasnainfoundation225@gmail.com\nHasnain Foundation Trust\nKarachi, Pakistan`;
    window.open(`mailto:${receipt.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`, '_blank');
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

          {/* Monthly Reminder Action Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-2 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl border border-emerald-700/50 shadow-md"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-sm">
              <Bell className="w-4 h-4 text-emerald-950" />
              <span>{isUrdu ? 'ماہانہ باقاعدگی سروس' : 'Monthly Recurring Sadaqah'}</span>
            </div>

            <p className={`text-xs text-emerald-100 px-2 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
              {isUrdu 
                ? 'عطیہ کرنے کے ۱ ماہ بعد یاد دہانی حاصل کریں تاکہ نیکی کا سلسلہ جاری رہے۔' 
                : 'Get a polite reminder 1 month after donating so your Sadaqah stays continuous.'}
            </p>

            <button
              onClick={() => setIsReminderModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              <Calendar className="w-4 h-4 text-emerald-950" />
              <span>{isUrdu ? 'ماہانہ عطیہ کی یاد دہانی سیٹ کریں' : 'Set Monthly Donation Reminder'}</span>
            </button>
          </motion.div>
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
            <div className="bg-emerald-950 rounded-xl p-5 sm:p-7 flex flex-col items-center justify-center text-center text-emerald-100 border border-emerald-900 shadow-none">
              <div className="flex items-center gap-2 mb-3.5 bg-emerald-900/80 border border-emerald-700/80 px-3.5 py-1 rounded-full text-xs font-extrabold text-emerald-200">
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isUrdu ? 'آفیشل کیو آر کوڈ (ایزی پیسہ)' : 'Official EasyPaisa Payment QR'}</span>
              </div>

              <div className="bg-white rounded-2xl border-2 border-emerald-500/60 p-3 shadow-xl max-w-[260px] w-full flex flex-col items-center overflow-hidden">
                <img 
                  src={easypaisaQrImg} 
                  alt="SALMAN ALI Easypaisa QR Code" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto rounded-xl object-contain bg-white"
                />
                <div className="mt-2.5 pt-2 border-t border-slate-100 w-full text-center">
                  <div className="text-xs font-black text-slate-900 tracking-tight font-mono">
                    SALMAN ALI
                  </div>
                  <div className="text-[10px] font-bold text-emerald-800 font-mono mt-0.5">
                    MSISDN: *******4134
                  </div>
                </div>
              </div>

              <h4 className={`text-base font-bold text-white mt-4 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                {isUrdu ? 'عطیہ کی فوری منتقلی کے لیے اسکین کریں' : 'Scan EasyPaisa QR Code to Donate'}
              </h4>
              <p className="text-xs text-emerald-300 max-w-xs mt-1.5 font-medium leading-relaxed">
                {isUrdu 
                  ? "کسی بھی بینک، ایزی پیسہ، یا جیز کیش ایپ کا کیو آر اسکینر کھولیں اور براہِ راست سلمان علی کے ایزی پیسہ اکاؤنٹ میں فنڈز منتقل کریں۔" 
                  : "Open your Easypaisa, JazzCash, or Banking App QR scanner to transfer funds directly to SALMAN ALI's EasyPaisa Account."}
              </p>
            </div>

            {/* Interactive Donation Receipt Form Panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-md">
              <AnimatePresence mode="wait">
                {!showThankYou ? (
                  <motion.form
                    key="donation-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-4"
                  >
                    <div className={`flex items-center gap-2 mb-2 ${isUrdu ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <Heart className="w-5 h-5 text-emerald-700 fill-current" />
                      <h3 className={`text-base font-black text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'رپورٹ برائے عطیہ و رسید فارم' : 'Donation Receipt Submission'}
                      </h3>
                    </div>

                    <p className={`text-[11px] text-slate-500 leading-relaxed ${isUrdu ? 'font-urdu text-right leading-loose' : 'font-sans'}`}>
                      {isUrdu 
                        ? "رقم ٹرانسفر کرنے کے بعد آفیشل رسید حاصل کرنے کے لیے درج ذیل تفصیلات درج کریں۔ ہماری انتظامیہ فوراً اس کی تصدیق کرے گی۔"
                        : "Submit your payment transaction details below. A professional, digitally-verified PDF receipt with a unique serial number and scannable verification QR Code will be instantly generated."}
                    </p>

                    {error && (
                      <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                        <span className={isUrdu ? 'font-urdu text-right block' : ''}>{error}</span>
                      </div>
                    )}

                    {/* Donor Name */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'عطیہ دہندہ کا نام (لازمی)' : 'Donor Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder={isUrdu ? "مثال: فاروق خان" : "e.g. Farooq Khan"}
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs focus:bg-white transition-colors ${
                          isUrdu ? 'text-right font-urdu' : ''
                        }`}
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'موبائل نمبر / واٹس ایپ (لازمی)' : 'Mobile / WhatsApp Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="e.g. 03152204134"
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs font-mono focus:bg-white transition-colors ${
                          isUrdu ? 'text-right' : ''
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'ای میل ایڈریس (اختیاری)' : 'Email Address (Optional)'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. donor@example.com"
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs focus:bg-white transition-colors ${
                          isUrdu ? 'text-right font-mono' : ''
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Amount */}
                      <div className="space-y-1">
                        <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                          {isUrdu ? 'عطیہ کی رقم (PKR)' : 'Donation Amount *'}
                        </label>
                        <input
                          type="number"
                          required
                          min="10"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="e.g. 5000"
                          className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 font-mono text-xs focus:bg-white transition-colors ${
                            isUrdu ? 'text-right' : ''
                          }`}
                        />
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-1">
                        <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                          {isUrdu ? 'ادائیگی کا ذریعہ *' : 'Payment Method *'}
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs cursor-pointer focus:bg-white transition-colors ${
                            isUrdu ? 'font-urdu text-right' : ''
                          }`}
                        >
                          <option value="EasyPaisa">Easypaisa</option>
                          <option value="JazzCash">JazzCash</option>
                          <option value="SadaPay">SadaPay</option>
                          <option value="NayaPay">NayaPay</option>
                          <option value="United Bank Limited (UBL)">UBL Ameen Islamic</option>
                          <option value="Other">Other Bank Transfer</option>
                        </select>
                      </div>
                    </div>

                    {/* Fund Category Selection (Zakat / Fitrat / Sadaqat / General) */}
                    <div className="space-y-1.5">
                      <label className={`block text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between ${isUrdu ? 'font-urdu flex-row-reverse' : ''}`}>
                        <span>{isUrdu ? 'عطیہ کی شرعی قسم / اکاؤنٹ منتخب کریں *' : 'Select Sharia Fund Account *'}</span>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {isUrdu ? 'علیحدہ مالیاتی کھاتہ' : 'Separately Audited Ledger'}
                        </span>
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* Zakat */}
                        <button
                          type="button"
                          onClick={() => setCategory('zakat')}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            category === 'zakat'
                              ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 text-amber-950 font-black'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-base">🕋</span>
                            {category === 'zakat' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                          </div>
                          <span className={`text-xs font-black block ${isUrdu ? 'font-urdu text-right' : ''}`}>
                            {isUrdu ? 'زکوۃ (فرض)' : 'Zakat Fund'}
                          </span>
                          <span className={`text-[10px] text-slate-500 mt-0.5 block ${isUrdu ? 'font-urdu text-right' : ''}`}>
                            {isUrdu ? 'مستحقین کیلئے' : 'Mustahiq Families'}
                          </span>
                        </button>

                        {/* Fitrat */}
                        <button
                          type="button"
                          onClick={() => setCategory('fitrat')}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            category === 'fitrat'
                              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30 text-emerald-950 font-black'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-base">🌙</span>
                            {category === 'fitrat' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                          </div>
                          <span className={`text-xs font-black block ${isUrdu ? 'font-urdu text-right' : ''}`}>
                            {isUrdu ? 'فطرانہ (واجب)' : 'Fitra / Fitrat'}
                          </span>
                          <span className={`text-[10px] text-slate-500 mt-0.5 block ${isUrdu ? 'font-urdu text-right' : ''}`}>
                            {isUrdu ? 'عید فطرانہ راحت' : 'Eid Relief Support'}
                          </span>
                        </button>

                        {/* Sadaqat */}
                        <button
                          type="button"
                          onClick={() => setCategory('sadaqat')}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            category === 'sadaqat'
                              ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-500/30 text-sky-950 font-black'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-base">📿</span>
                            {category === 'sadaqat' && <span className="w-2 h-2 rounded-full bg-sky-600"></span>}
                          </div>
                          <span className={`text-xs font-black block ${isUrdu ? 'font-urdu text-right' : ''}`}>
                            {isUrdu ? 'صدقات (نفل)' : 'Sadaqat / Sadaqah'}
                          </span>
                          <span className={`text-[10px] text-slate-500 mt-0.5 block ${isUrdu ? 'font-urdu text-right' : ''}`}>
                            {isUrdu ? 'دفع بلا و بیمار فنڈ' : 'General Welfare'}
                          </span>
                        </button>

                        {/* General / Project Fund */}
                        <button
                          type="button"
                          onClick={() => setCategory('general')}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            category === 'general'
                              ? 'bg-slate-200 border-slate-700 ring-2 ring-slate-400/30 text-slate-950 font-black'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-base">🏛️</span>
                            {category === 'general' && <span className="w-2 h-2 rounded-full bg-slate-800"></span>}
                          </div>
                          <span className={`text-xs font-black block ${isUrdu ? 'font-urdu text-right' : ''}`}>
                            {isUrdu ? 'عمومی فنڈ' : 'General Fund'}
                          </span>
                          <span className={`text-[10px] text-slate-500 mt-0.5 block ${isUrdu ? 'font-urdu text-right' : ''}`}>
                            {isUrdu ? 'مسجد و آر او پلانٹ' : 'Mosque & Operations'}
                          </span>
                        </button>
                      </div>

                      {/* Account Explanation Note */}
                      <div className="p-2.5 bg-slate-100/80 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                        {category === 'zakat' && (
                          <p className={isUrdu ? 'font-urdu text-right' : ''}>
                            {isUrdu 
                              ? 'حسنیہ فاؤنڈیشن زکوۃ فنڈ کو ۱۰۰٪ شرعی اصولوں کے مطابق صرف مستحقینِ زکوۃ (یتامیٰ، بیوگان، مساکین) پر صرف کرتی ہے۔' 
                              : '100% Zakat funds are strictly deposited into a dedicated Sharia-compliant Zakat account disbursed to deserving Mustahiq families, widows, and orphans.'}
                          </p>
                        )}
                        {category === 'fitrat' && (
                          <p className={isUrdu ? 'font-urdu text-right' : ''}>
                            {isUrdu 
                              ? 'فطرانہ کی رقم علیحدہ فطرانہ کھاتے میں جمع کی جاتی ہے اور عید سے قبل نادار خاندانوں میں راشن اور کپڑوں کی صورت میں تقسیم کی جاتی ہے۔' 
                              : 'Fitrat contributions are logged in a separate Fitra Ledger and distributed directly to poverty-stricken households before Eid prayers.'}
                          </p>
                        )}
                        {category === 'sadaqat' && (
                          <p className={isUrdu ? 'font-urdu text-right' : ''}>
                            {isUrdu 
                              ? 'نفلی صدقات کی رقم ہسپتال کے مریضوں کی مدد، راشن کی فراہمی اور ہنگامی فلاحی کاموں پر خرچ ہوتی ہے۔' 
                              : 'Nafli Sadaqah funds are allocated to patient healthcare support, emergency food drives, and general public welfare.'}
                          </p>
                        )}
                        {category === 'general' && (
                          <p className={isUrdu ? 'font-urdu text-right' : ''}>
                            {isUrdu 
                              ? 'عمومی فنڈز جامع مسجد کی تعمیر و مرمت، صاف پانی کے آر او پلانٹس کے چلانے اور فاؤنڈیشن کے انتظامی امور میں استعمال ہوتے ہیں۔' 
                              : 'General funds support mosque construction, clean drinking water RO plant maintenance, and foundation operational running expenses.'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Purpose */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'عطیہ کا مخصوص مقصد *' : 'Donation Purpose *'}
                      </label>
                      <select
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs cursor-pointer focus:bg-white transition-colors ${
                          isUrdu ? 'font-urdu text-right' : ''
                        }`}
                      >
                        <option value="general">{isUrdu ? "عمومی عطیہ (جنرل فنڈ)" : "General Sadaqah / Zakat"}</option>
                        <option value="masjid">{isUrdu ? "جامع مسجد تعمیراتی فنڈ" : "Jamia Masjid Construction"}</option>
                        <option value="food">{isUrdu ? "راشن اور کھانا فنڈ" : "Food Security Drive"}</option>
                        <option value="education">{isUrdu ? "یتیم بچوں کا تعلیمی فنڈ" : "Orphan Education Support"}</option>
                        <option value="water">{isUrdu ? "صاف پانی / آر او پلانٹ فنڈ" : "Community RO Water Plant"}</option>
                      </select>
                    </div>

                    {/* Transaction ID */}
                    <div className="space-y-1">
                      <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${isUrdu ? 'font-urdu text-right' : ''}`}>
                        {isUrdu ? 'ٹرانزیکشن آئی ڈی / رسید نمبر (لازمی)' : 'Transaction ID / Reference Number *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. EP-4421590 or TXN98231221"
                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-700 text-xs font-mono focus:bg-white transition-colors ${
                          isUrdu ? 'text-right' : ''
                        }`}
                      />
                    </div>

                    {/* Monthly Donation Reminder Toggle */}
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="monthlyReminderToggle"
                        checked={monthlyReminderOptIn}
                        onChange={(e) => setMonthlyReminderOptIn(e.target.checked)}
                        className="mt-1 w-4 h-4 text-emerald-700 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                      />
                      <label htmlFor="monthlyReminderToggle" className="cursor-pointer text-xs text-slate-800">
                        <span className={`font-black flex items-center gap-1.5 ${isUrdu ? 'font-urdu flex-row-reverse text-right' : ''}`}>
                          <Bell className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{isUrdu ? '۱ ماہ بعد عطیہ کی یاد دہانی حاصل کریں' : 'Enable 1-Month Donation Reminder'}</span>
                        </span>
                        <span className={`block text-[11px] text-slate-500 mt-0.5 ${isUrdu ? 'font-urdu text-right' : ''}`}>
                          {isUrdu 
                            ? 'اس عطیہ کے ٹھیک ایک ماہ بعد آپ کو یاد دہانی بھیجی جائے گی تاکہ عطیہ کی توثیق باقاعدگی سے رہے اور ہم بھی آپ کو دعاؤں میں یاد رکھیں۔' 
                            : 'Receive a polite reminder 1 month after this donation so you can renew your support, and we remember you in our prayers.'}
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-colors cursor-pointer ${
                        isUrdu ? 'font-urdu' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{isUrdu ? 'رسید آڈٹ کی جا رہی ہے...' : 'Generating Verified Receipt...'}</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4.5 h-4.5" />
                          <span>{isUrdu ? 'سرکاری تصدیق شدہ رسید حاصل کریں' : 'Generate Certified Receipt'}</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  // Luxury Green & Gold Receipt Card with Live Verification QR
                  <motion.div
                    key="thankyou-receipt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 text-center"
                  >
                    <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl w-14 h-14 flex items-center justify-center mx-auto shadow-inner">
                      <Award className="w-8 h-8 text-emerald-700" />
                    </div>

                    <div className="space-y-1">
                      <h3 className={`text-lg sm:text-xl font-black text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'الحمدللہ! عطیہ وصول ہو گیا' : 'Thank You for Your Donation!'}
                      </h3>
                      <p className={`text-[11px] text-slate-500 leading-relaxed ${
                        isUrdu ? 'font-urdu leading-loose' : 'font-sans'
                      }`}>
                        {isUrdu 
                          ? "آپ کا آفیشل ڈیجیٹل سرٹیفکیٹ اور پی ڈی ایف رسید کامیابی سے تیار کر دی گئی ہے۔"
                          : "Your donation has been registered! A digital receipt and official certificate are ready below."}
                      </p>
                    </div>

                    {/* Highly Polished Luxury Certificate & Receipt Card representation */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border-2 border-emerald-600 text-slate-800 space-y-5 text-xs font-sans relative overflow-hidden shadow-lg">
                      
                      {/* Inner gold frame border */}
                      <div className="absolute inset-2.5 border border-dashed border-amber-500 pointer-events-none rounded-lg" />

                      <div className="flex justify-between items-start relative z-10">
                        <div className="text-left">
                          <span className="block text-amber-700 font-black tracking-widest uppercase text-[9px]">{isUrdu ? 'آفیشل رسید' : 'OFFICIAL RECEIPT'}</span>
                          <span className="text-sm font-black text-slate-900 font-mono tracking-wider">{receipt?.id}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-emerald-800 font-black tracking-wider uppercase text-[9px]">HASNAIN FOUNDATION</span>
                          <span className="text-[10px] text-slate-400 font-mono">{receipt?.donationDate}</span>
                        </div>
                      </div>

                      {/* Donor Name Label Card */}
                      <div className="space-y-1 py-1 text-center relative z-10 border-y border-slate-100">
                        <p className="text-slate-400 text-[10px] uppercase font-bold">{isUrdu ? 'پیش خدمت مع تشکر برائے:' : 'Presented with gratitude to:'}</p>
                        <p className={`text-lg font-black text-emerald-900 ${isUrdu ? 'font-urdu leading-normal' : 'font-sans'}`}>
                          {receipt?.donorName}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 relative z-10 text-[11px] text-left pt-1">
                        <div>
                          <span className="block text-slate-400 text-[9px] uppercase font-bold">{isUrdu ? 'رقم' : 'Amount Contributed'}</span>
                          <span className="font-black text-emerald-800 text-sm font-mono">PKR {receipt?.amount.toLocaleString()}/-</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[9px] uppercase font-bold">{isUrdu ? 'شرعی کھاتہ و مقصد' : 'Sharia Account & Cause'}</span>
                          <span className={`font-black text-slate-900 block ${isUrdu ? 'font-urdu text-[11px]' : ''}`}>
                            {formatCategory(receipt?.category, receipt?.purpose)}
                          </span>
                          <span className={`text-[10px] text-slate-500 font-bold block ${isUrdu ? 'font-urdu' : ''}`}>
                            {formatPurpose(receipt?.purpose)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 relative z-10 text-[11px] text-left border-t border-slate-100 pt-3">
                        <div>
                          <span className="block text-slate-400 text-[9px] uppercase font-bold">{isUrdu ? 'ٹرانزیکشن نمبر' : 'Transaction Ref'}</span>
                          <span className="font-extrabold text-slate-800 font-mono text-[10px] truncate block">{receipt?.transactionId}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[9px] uppercase font-bold">{isUrdu ? 'حالت' : 'Verification State'}</span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                            {isUrdu ? 'آڈٹ جاری ہے' : 'PENDING AUDIT'}
                          </span>
                        </div>
                      </div>

                      {/* QR verification scannable wrapper */}
                      <div className="border-t border-slate-100 pt-4 flex flex-col items-center justify-center relative z-10">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getHasnainFoundationLink(receipt?.id, 'receipt'))}`}
                          alt="Verification QR Code"
                          className="w-28 h-28 border-2 border-emerald-600/30 p-1.5 bg-white rounded-xl mb-2 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider font-mono">
                          {isUrdu ? 'رسید کی تصدیق کے لیے اسکین کریں' : 'Hasnain Foundation Scannable QR'}
                        </p>
                        <a
                          href={getHasnainFoundationLink(receipt?.id, 'receipt')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-[10px] text-emerald-700 hover:underline font-mono flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{getHasnainFoundationLink(receipt?.id, 'receipt')}</span>
                        </a>
                      </div>
                    </div>

                    {/* Action Export Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                      {/* Download PDF */}
                      <button
                        onClick={triggerDownload}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'پی ڈی ایف رسید' : 'Download PDF'}</span>
                      </button>

                      {/* Print */}
                      <button
                        onClick={triggerPrint}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'پرنٹ رسید' : 'Print Receipt'}</span>
                      </button>

                      {/* Share WhatsApp */}
                      <button
                        onClick={triggerWhatsAppShare}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer col-span-2 mt-1"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'واٹس ایپ پر شیئر کریں' : 'Share on WhatsApp'}</span>
                      </button>

                      {/* Share Email */}
                      {receipt?.email && (
                        <button
                          onClick={triggerEmailShare}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer col-span-2 mt-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isUrdu ? 'ای میل پر بھیجیں' : 'Email to Donor'}</span>
                        </button>
                      )}

                      {/* Set Monthly Donation Reminder Button */}
                      <button
                        onClick={() => setIsReminderModalOpen(true)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all cursor-pointer col-span-2 mt-1 shadow-md"
                      >
                        <Bell className="w-4 h-4 text-emerald-950" />
                        <span>{isUrdu ? '🗓️ ۱ ماہ بعد کیلئے یاد دہانی فعال کریں' : '🗓️ Set Monthly Reminder (1 Month After)'}</span>
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleResetForm}
                        className="text-xs text-slate-500 hover:text-emerald-700 font-bold transition-colors flex items-center gap-1.5 mx-auto py-1 px-3.5 bg-slate-100 rounded-lg"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{isUrdu ? 'نیا عطیہ فارم درج کریں' : 'Submit Another Receipt'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>

      {/* Monthly Donation Reminder Modal */}
      <MonthlyDonationReminderModal
        lang={lang}
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        defaultDonorName={receipt?.donorName || donorName}
        defaultMobile={receipt?.mobile || mobile}
        defaultEmail={receipt?.email || email}
        defaultAmount={receipt?.amount ? String(receipt.amount) : amount}
        defaultPurpose={receipt?.purpose || purpose}
      />
    </section>
  );
}
