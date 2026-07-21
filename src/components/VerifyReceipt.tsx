/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { ShieldCheck, AlertTriangle, ArrowLeft, Clock, DollarSign, Calendar, Heart, FileText, Mail, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';

interface VerifyReceiptProps {
  lang: Language;
  onBackToHome: () => void;
}

interface DonationRecord {
  id: string;
  donorName: string;
  email: string;
  mobile: string;
  whatsapp?: string;
  amount: number;
  paymentMethod: string;
  purpose: string;
  transactionId: string;
  receiptUrl?: string;
  donationDate: string;
  donationTime?: string;
  status: 'pending' | 'verified' | 'rejected';
}

export default function VerifyReceipt({ lang, onBackToHome }: VerifyReceiptProps) {
  const [loading, setLoading] = useState(true);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [donation, setDonation] = useState<DonationRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isUrdu = lang === 'ur';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('verify') || params.get('receiptId') || params.get('verify-receipt');
    setReceiptId(id);

    if (id) {
      // Fetch details from the public verification endpoint
      fetch(`/api/donations/verify/${id}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(isUrdu ? '❌ غیر معتبر رسید' : '❌ Invalid Receipt');
          }
          return res.json();
        })
        .then((data) => {
          if (data.success && data.donation) {
            setDonation(data.donation);
          } else {
            setErrorMsg(isUrdu ? 'معذرت، یہ رسید فاؤنڈیشن کے پاس درج نہیں ہے۔' : 'Invalid Receipt: This receipt code is not recorded in our system.');
          }
        })
        .catch((err) => {
          setErrorMsg(isUrdu ? '❌ غیر معتبر رسید' : '❌ Invalid Receipt');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setErrorMsg(isUrdu ? 'براہ کرم سکین شدہ رسید کا کیو آر کوڈ یا درست لنک استعمال کریں۔' : 'No Receipt ID specified. Please use the QR Code printed on your official receipt.');
    }
  }, [isUrdu]);

  const formatPurpose = (pur: string) => {
    switch (pur) {
      case 'general': return isUrdu ? 'عمومی عطیہ' : 'General Sadaqah / Zakat';
      case 'masjid': return isUrdu ? 'جامع مسجد تعمیراتی فنڈ' : 'Jamia Masjid Construction';
      case 'food': return isUrdu ? 'راشن اور کھانا فنڈ' : 'Food Security Drive';
      case 'education': return isUrdu ? 'یتیم بچوں کا تعلیمی فنڈ' : 'Orphan Education Support';
      case 'water': return isUrdu ? 'صاف پانی / آر او پلانٹ فنڈ' : 'Community RO Water Plant';
      default: return pur;
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-slate-50 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Decorative Islamic Background Elements */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        
        {/* Navigation Button */}
        <button
          onClick={onBackToHome}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 cursor-pointer transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'مرکزی صفحہ پر واپس جائیں' : 'Back to Homepage'}</span>
        </button>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-md flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium text-sm">
              {isUrdu ? 'رسید کی تصدیق کی جا رہی ہے...' : 'Verifying Receipt Authenticity...'}
            </p>
          </div>
        ) : errorMsg ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-xl overflow-hidden relative"
          >
            {/* Top red header bar */}
            <div className="absolute top-0 inset-x-0 h-2 bg-red-600" />

            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-red-600 tracking-tight mb-3">
              {isUrdu ? '❌ غیر معتبر رسید' : '❌ Invalid Receipt'}
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto mb-6">
              {errorMsg}
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 max-w-sm mx-auto space-y-1">
              <p className="font-bold text-slate-700">{isUrdu ? 'تفتیشی مرکز حسنین فاؤنڈیشن' : 'Hasnain Foundation Central Audits'}</p>
              <p>{isUrdu ? 'آفیشل ہیلپ لائن: +92 315 2204134' : 'Official Helpline: +92 315 2204134'}</p>
              <p>Email: hasnainfoundation225@gmail.com</p>
            </div>
          </motion.div>
        ) : donation ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-emerald-200 shadow-2xl relative overflow-hidden"
          >
            {/* Top luxury gold & green stripe header */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-600 to-amber-500" />

            <div className="p-6 sm:p-8 text-center border-b border-slate-100 bg-gradient-to-b from-emerald-50/40 to-transparent">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200 shadow-inner">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-emerald-800 tracking-tight">
                {isUrdu ? 'تصدیق شدہ حسنین فاؤنڈیشن ✅' : 'Verified by Hasnain Foundation ✅'}
              </h2>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mt-1.5">
                {isUrdu ? 'سرکاری فاؤنڈیشن آڈٹ تصدیق' : 'Official Trust Audit Certification'}
              </p>
            </div>

            {/* Receipt Parameters Grid */}
            <div className="p-6 sm:p-8 space-y-5">
              
              {/* Receipt Number Panel */}
              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-200">
                <span className="text-xs text-slate-500 font-bold uppercase">{isUrdu ? 'رسید نمبر' : 'Receipt Number'}</span>
                <span className="text-sm font-black text-slate-900 font-mono tracking-wider">{donation.id}</span>
              </div>

              {/* Detail fields */}
              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* Donor Name */}
                <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                  <span className="text-slate-400 font-bold uppercase">{isUrdu ? 'عطیہ دہندہ' : 'Donor Name'}</span>
                  <span className="font-extrabold text-slate-900 text-right">{donation.donorName}</span>
                </div>

                {/* Amount */}
                <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                  <span className="text-slate-400 font-bold uppercase">{isUrdu ? 'عطیہ کی رقم' : 'Amount'}</span>
                  <span className="font-black text-emerald-800 font-mono text-base">PKR {donation.amount.toLocaleString()}/-</span>
                </div>

                {/* Purpose */}
                <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                  <span className="text-slate-400 font-bold uppercase">{isUrdu ? 'عطیہ کا مقصد' : 'Donation Purpose'}</span>
                  <span className="font-extrabold text-slate-800 text-right">{formatPurpose(donation.purpose)}</span>
                </div>

                {/* Payment Channel */}
                <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                  <span className="text-slate-400 font-bold uppercase">{isUrdu ? 'ادائیگی کا ذریعہ' : 'Payment Method'}</span>
                  <span className="font-bold text-slate-700 text-right">{donation.paymentMethod}</span>
                </div>

                {/* Date */}
                <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                  <span className="text-slate-400 font-bold uppercase">{isUrdu ? 'تاریخ منتقلی' : 'Date'}</span>
                  <span className="font-bold text-slate-700 font-mono">{donation.donationDate}</span>
                </div>

                {/* Time */}
                {donation.donationTime && (
                  <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
                    <span className="text-slate-400 font-bold uppercase">{isUrdu ? 'وقت منتقلی' : 'Time'}</span>
                    <span className="font-bold text-slate-700 font-mono">{donation.donationTime}</span>
                  </div>
                )}

                {/* Status */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-slate-400 font-bold uppercase">{isUrdu ? 'اسٹیٹس' : 'Receipt Status'}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    donation.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    donation.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {donation.status === 'verified' ? (isUrdu ? 'تصدیق شدہ' : 'Verified') :
                     donation.status === 'rejected' ? (isUrdu ? 'مسترد شدہ' : 'Rejected') :
                     (isUrdu ? 'زیر التواء تصدیق' : 'Pending Audit')}
                  </span>
                </div>
              </div>

              {/* Thank you card note */}
              <div className="p-4 rounded-xl bg-amber-50/40 border border-dashed border-amber-300 text-center text-xs text-amber-900 leading-relaxed">
                <Heart className="w-4 h-4 text-amber-600 fill-current mx-auto mb-1.5" />
                <p className={isUrdu ? 'font-urdu' : 'italic'}>
                  {isUrdu 
                    ? '"اللہ تعالی آپ کی اس مخلصانہ خدمت اور سخاوت کو قبول فرمائے اور دنیا و آخرت میں جزائے خیر عطا فرمائے۔ آمین۔"'
                    : '"May Allah reward you abundantly in this life and the hereafter for your generous contribution."'}
                </p>
              </div>

              {/* Official contacts card info */}
              <div className="pt-2 text-[11px] text-slate-400 flex flex-col items-center justify-center space-y-1 text-center font-sans">
                <p className="font-bold text-slate-600">Hasnain Foundation Welfare & Construction Trust</p>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1"><PhoneCall className="w-3 h-3 text-emerald-700" /> +92 315 2204134</span>
                  <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3 text-emerald-700" /> hasnainfoundation225@gmail.com</span>
                </div>
              </div>

            </div>
          </motion.div>
        ) : null}

      </div>
    </section>
  );
}
