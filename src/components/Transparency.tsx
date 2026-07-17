/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { DICTIONARY, TRANSPARENCY_REPORTS, IMAGES } from '../data';
import { FileText, Download, CheckCircle, PieChart, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import GoogleDriveExplorer from './GoogleDriveExplorer';

interface TransparencyProps {
  lang: Language;
}

export default function Transparency({ lang }: TransparencyProps) {
  const [activeReportId, setActiveReportId] = useState<string>(TRANSPARENCY_REPORTS[0].id);
  const isUrdu = lang === 'ur';

  // Find active report details
  const activeReport = TRANSPARENCY_REPORTS.find(r => r.id === activeReportId) || TRANSPARENCY_REPORTS[0];

  const handleDownload = (reportTitle: string) => {
    alert(
      isUrdu 
        ? `آپ کی فرمائش کردہ آڈٹ رپورٹ "${reportTitle}" کا ڈیمو ورژن ڈاؤن لوڈ کیا جا رہا ہے۔` 
        : `Downloading demo PDF report for "${reportTitle}".`
    );
  };

  return (
    <section id="transparency-section" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs sm:text-xs font-bold uppercase tracking-wider mb-3"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'مکمل مالیاتی شفافیت' : '100% Accountable'}
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
            {DICTIONARY.transparency.title[lang]}
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
            {DICTIONARY.transparency.subtitle[lang]}
          </motion.p>
        </div>

        {/* Content Box: Utilizations vs Reports */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-start ${
          isUrdu ? 'lg:flex-row-reverse' : ''
        }`}>
          
          {/* LEFT COLUMN: Report Switcher & Utilization Details (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-none">
            <div className={`flex justify-between items-center pb-4 border-b border-slate-200 ${
              isUrdu ? 'flex-row-reverse' : ''
            }`}>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-700" />
                <h3 className={`text-base font-bold text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {DICTIONARY.transparency.utilizationTitle[lang]}
                </h3>
              </div>
              
              {/* Select Switcher */}
              <div className="relative">
                <select
                  value={activeReportId}
                  onChange={(e) => setActiveReportId(e.target.value)}
                  className={`bg-slate-50 border border-slate-200 text-xs rounded-xl py-1.5 px-3 font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer ${
                    isUrdu ? 'font-urdu' : 'font-sans'
                  }`}
                >
                  {TRANSPARENCY_REPORTS.map((rep) => (
                    <option key={rep.id} value={rep.id}>
                      {rep.title[lang]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List of spending percentages with custom sliders */}
            <div className="space-y-5">
              {activeReport.utilization.map((util, index) => (
                <div key={index} className={`space-y-2 ${isUrdu ? 'text-right' : 'text-left'}`}>
                  <div className={`flex justify-between text-xs font-bold ${
                    isUrdu ? 'flex-row-reverse' : ''
                  }`}>
                    <span className={`text-slate-800 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                      {util.category[lang]}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-400">({util.amount})</span>
                      <span className="text-emerald-700">{util.percentage}%</span>
                    </div>
                  </div>
                  
                  {/* Slider bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${util.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-emerald-700 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Trust disclaimer badge */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <p className={`text-xs text-slate-500 leading-relaxed ${isUrdu ? 'font-urdu text-right leading-loose' : 'font-sans'}`}>
                {isUrdu 
                  ? "یہ حسابات آزاد پبلک چارٹرڈ اکاؤنٹنٹ سے آڈٹ شدہ ہیں۔ ہم اس بات کو یقینی بناتے ہیں کہ زکوٰۃ، فطرہ، اور دیگر عمومی عطیات صرف ان کے مخصوص اور جائز شرعی مصرف پر ہی خرچ ہوں۔"
                  : "These utilization details are compiled from certified ledger audits. We ensure that Zakat and general donations are maintained in separate bank channels and utilized strictly as per defined Islamic principles."}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Document list (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Download block */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-none">
              <h3 className={`text-base font-bold text-slate-900 pb-4 border-b border-slate-200 flex items-center gap-2 mb-4 ${
                isUrdu ? 'flex-row-reverse text-right font-urdu' : 'font-sans'
              }`}>
                <FileText className="w-5 h-5 text-emerald-700" />
                <span>{DICTIONARY.transparency.reportsTitle[lang]}</span>
              </h3>

              <div className="space-y-4">
                {TRANSPARENCY_REPORTS.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white transition-all duration-150 flex items-center justify-between gap-4 ${
                      isUrdu ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className={isUrdu ? 'text-right' : 'text-left'}>
                        <h4 className={`text-xs sm:text-xs font-bold text-slate-950 leading-tight ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                          {rep.title[lang]}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          {rep.month[lang]} - {rep.year}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(rep.title[lang])}
                      className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-emerald-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Evidence block */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-none">
              <h3 className={`text-base font-bold text-slate-900 pb-4 border-b border-slate-200 flex items-center gap-2 mb-4 ${
                isUrdu ? 'flex-row-reverse text-right font-urdu' : 'font-sans'
              }`}>
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span>{DICTIONARY.transparency.photoEvidenceTitle[lang]}</span>
              </h3>
              
              <p className={`text-xs text-slate-500 leading-relaxed mb-4 ${isUrdu ? 'font-urdu text-right leading-loose' : 'font-sans'}`}>
                {DICTIONARY.transparency.photoEvidenceDesc[lang]}
              </p>

              {/* Little grid of 3 mini evidentiary photos */}
              <div className="grid grid-cols-3 gap-2">
                {[IMAGES.masjidProject, IMAGES.foodProject, IMAGES.communityProject].map((imgSrc, imgIdx) => (
                  <div key={imgIdx} className="h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={imgSrc}
                      alt="Transparency Evidence"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Google Drive Integration Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12"
        >
          <GoogleDriveExplorer lang={lang} />
        </motion.div>

      </div>
    </section>
  );
}
