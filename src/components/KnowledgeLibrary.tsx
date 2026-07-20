/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { BookOpen, Download, Printer, Share2, Search, FileText, Check, Star, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LibraryTopic {
  id: string;
  title: { en: string; ur: string };
  arabic: string;
  urdu: string;
  english: string;
  quranReference: { en: string; ur: string };
  hadithReference: { en: string; ur: string };
  category: 'surah' | 'adhkar' | 'protection';
}

const TOPICS: LibraryTopic[] = [
  {
    id: 'ayat-ul-kursi',
    title: { en: 'Ayat-ul-Kursi (The Throne Verse)', ur: 'آیت الکرسی' },
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۚ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    urdu: 'اللہ، اس کے سوا کوئی معبود نہیں، جو ہمیشہ زندہ رہنے والا، کائنات کا نگہبان ہے۔ نہ اسے اونگھ آتی ہے نہ نیند۔ جو کچھ آسمانوں اور زمین میں ہے سب اسی کا ہے۔ کون ہے جو اس کی اجازت کے بغیر اس کے حضور سفارش کر سکے؟ وہ سب کچھ جانتا ہے جو ان کے سامنے ہے اور جو ان کے پیچھے ہے۔ اور وہ اس کے علم میں سے کسی چیز کا احاطہ نہیں کر سکتے مگر جتنا وہ چاہے۔ اس کی کرسی آسمانوں اور زمین پر محیط ہے، اور ان کی حفاظت اسے تھکاتی نہیں، اور وہ نہایت بلند، بہت بڑا ہے۔',
    english: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Throne extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    quranReference: { en: 'Surah Al-Baqarah (2:255)', ur: 'سورۃ البقرۃ (آیت ۲۵۵)' },
    hadithReference: { 
      en: 'Prophet Muhammad (PBUH) said: "Whoever recites Ayat al-Kursi after every obligatory prayer, nothing stands between him and entering Paradise except death." (Sunan al-Nasai)', 
      ur: 'رسول اللہ صلی اللہ علیہ وسلم نے فرمایا: "جس نے ہر فرض نماز کے بعد آیت الکرسی پڑھی، اسے جنت میں داخل ہونے سے کوئی چیز نہیں روکتی سوائے موت کے۔" (سنن النسائی)' 
    },
    category: 'surah'
  },
  {
    id: 'surah-fatiha',
    title: { en: 'Surah Al-Fatiha (The Opening)', ur: 'سورۃ الفاتحہ' },
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    urdu: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔ سب تعریفیں اللہ کے لیے ہیں جو سب جہانوں کا پالنے والا ہے۔ بہت مہربان، نہایت رحم کرنے والا ہے۔ جزا اور سزا کے دن کا مالک ہے۔ ہم صرف تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں۔ ہمیں سیدھے راستے کی ہدایت فرما۔ ان لوگوں کے راستے کی جن پر تو نے اپنا فضل کیا، نہ کہ ان کے راستے کی جن پر تیرا غضب نازل ہوا اور نہ ہی گمراہوں کے راستے۔',
    english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    quranReference: { en: 'Surah Al-Fatiha (1:1-7)', ur: 'سورۃ الفاتحہ (آیات ۱-۷)' },
    hadithReference: { 
      en: 'The Companion Abu Sa\'id al-Khudri recited it as a Ruqyah for a chief bitten by a scorpion, and he was cured immediately. The Prophet (PBUH) confirmed: "How did you know it was a Ruqyah (cure)?" (Sahih al-Bukhari)', 
      ur: 'حضرت ابو سعید خدری رضی اللہ عنہ نے سانپ کے ڈسے ہوئے قبیلے کے سردار پر سورۃ الفاتحہ پڑھ کر دم کیا تو وہ بالکل ٹھیک ہو گیا۔ رسول اللہ ﷺ نے تصدیق فرمائی: "تمہیں کیسے معلوم ہوا کہ یہ دم (شفا) ہے؟" (صحیح بخاری)' 
    },
    category: 'surah'
  },
  {
    id: 'surah-falaq',
    title: { en: 'Surah Al-Falaq (The Daybreak)', ur: 'سورۃ الفلق' },
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    urdu: 'آپ کہہ دیجیے کہ میں صبح کے رب کی پناہ مانگتا ہوں۔ ہر اس چیز کے شر سے جو اس نے پیدا کی ہے۔ اور اندھیری رات کے شر سے جب اس کا اندھیرا چھا جائے۔ اور گرہوں پر پھونکنے والی جادوگرنیوں کے شر سے۔ اور حسد کرنے والے کے شر سے جب وہ حسد کرے۔',
    english: 'Say, "I seek refuge in the Lord of daybreak. From the evil of that which He created. And from the evil of darkness when it settles. And from the evil of the blowers in knots. And from the evil of an envier when he envies."',
    quranReference: { en: 'Surah Al-Falaq (113:1-5)', ur: 'سورۃ الفلق (آیات ۱-۵)' },
    hadithReference: { 
      en: 'Whenever the Prophet (PBUH) went to bed, he would blow on his hands and recite the Mu\'awwidhatayn (Falaq & Naas) and pass them over his body for divine protection. (Sahih al-Bukhari)', 
      ur: 'رسول اللہ صلی اللہ علیہ وسلم جب ہر رات اپنے بستر پر تشریف لاتے تو اپنے دونوں ہاتھوں پر پھونک مارتے اور معوذتین (سورۃ الفلق اور سورۃ الناس) پڑھ کر پورے جسم مبارک پر پھیر لیتے۔ (صحیح بخاری)' 
    },
    category: 'surah'
  },
  {
    id: 'surah-naas',
    title: { en: 'Surah Al-Naas (Mankind)', ur: 'سورۃ الناس' },
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
    urdu: 'آپ کہہ دیجیے کہ میں انسانوں کے پروردگار کی پناہ مانگتا ہوں، انسانوں کے بادشاہ کی، انسانوں کے معبود کی، وسوسہ ڈالنے والے (شیطان) کے شر سے جو پیچھے ہٹ جانے والا ہے۔ جو لوگوں کے سینوں میں وسوسے ڈالتا ہے۔ خواہ وہ جنوں میں سے ہو یا انسانوں میں سے۔',
    english: 'Say, "I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer - Who whispers [evil] into the breasts of mankind - From among the jinn and mankind."',
    quranReference: { en: 'Surah Al-Naas (114:1-6)', ur: 'سورۃ الناس (آیات ۱-۶)' },
    hadithReference: { 
      en: 'Prophet Muhammad (PBUH) said: "Recite Surah Al-Ikhlas and the Mu\'awwidhatayn (Falaq and Naas) three times in the morning and evening; they will suffice you against everything." (Sunan At-Tirmidhi)', 
      ur: 'رسول اللہ صلی اللہ علیہ وسلم نے فرمایا: "صبح اور شام کے وقت تین مرتبہ قل ھو اللہ احد اور معوذتین (سورۃ الفلق، الناس) پڑھ لیا کرو، یہ تمہیں ہر چیز (کے شر) سے کافی ہوں گی۔" (جامع ترمذی)' 
    },
    category: 'surah'
  },
  {
    id: 'morning-adhkar',
    title: { en: 'Bismillah Protection Prayer', ur: 'صبح و شام کی دعا برائے حفاظت' },
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ ۖ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    urdu: 'اللہ کے نام سے جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہ سب کچھ سننے والا اور خوب جاننے والا ہے۔',
    english: 'In the name of Allah, with Whose name nothing can cause harm in the earth nor in the heaven, and He is the All-Hearing, the All-Knowing.',
    quranReference: { en: 'Islamic Morning & Evening Adhkar Series', ur: 'صبح و شام کے مسنون اذکار' },
    hadithReference: { 
      en: 'The Prophet (PBUH) said: "He who recites this prayer three times in the morning will not be afflicted by any sudden calamity till evening, and he who recites it in the evening will not be afflicted by any sudden calamity till morning." (Sunan Abi Dawud)', 
      ur: 'رسول اللہ ﷺ نے فرمایا: "جو شخص صبح کے وقت تین مرتبہ یہ دعا پڑھے اسے شام تک کوئی اچانک مصیبت نہیں پہنچے گی، اور جو شام کو تین بار پڑھے اسے صبح تک کوئی اچانک مصیبت نہیں پہنچے گی۔" (سنن ابی داؤد)' 
    },
    category: 'adhkar'
  },
  {
    id: 'ruqyah-shield',
    title: { en: 'Comprehensive Ruqyah Healing Prayer', ur: 'جامع دم اور روحانی شفاء کی دعا' },
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِن شَرِّ مَا خَلَقَ ۖ وَمِن شَرِّ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ ۖ وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَن يَحْضُرُونِ',
    urdu: 'میں پناہ مانگتا ہوں اللہ کے کامل کلمات کی ہر اس چیز کے شر سے جو اس نے پیدا کی، اور اس کے غضب اور عذاب سے، اور اس کے بندوں کے شر سے، اور شیاطین کے وسوسوں سے اور اس بات سے کہ وہ میرے پاس آئیں۔',
    english: 'I seek refuge in the perfect words of Allah from the evil of what He has created, and from His anger and His punishment, and from the evil of His servants, and from the whispers of the devils and from their presence.',
    quranReference: { en: 'Authentic Islamic Spiritual Healing Manual', ur: 'مستند شرعی دم اور تعویذ' },
    hadithReference: { 
      en: 'Prophet Muhammad (PBUH) commanded to seek refuge using these perfect words of Allah from poison, black magic, jinn touch, and evil eye. (Sahih Muslim & Tirmidhi)', 
      ur: 'رسول اللہ ﷺ نے ان کامل کلمات کے ذریعے زہر، جادو، نظر بد اور جنات کے اثرات سے پناہ مانگنے کی تاکید فرمائی۔ (صحیح مسلم و ترمذی)' 
    },
    category: 'protection'
  }
];

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: 'left' | 'right' | 'center' = 'left'
): number {
  const words = text.split(' ');
  let line = '';
  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  let currentY = y;
  for (let i = 0; i < lines.length; i++) {
    ctx.textAlign = align;
    ctx.fillText(lines[i].trim(), x, currentY);
    currentY += lineHeight;
  }
  return lines.length * lineHeight;
}

function getPrintableHtml(topic: LibraryTopic) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hasnain Foundation - ${topic.title.en}</title>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Amiri&family=Inter:wght@400;600;800&family=Noto+Nastaliq+Urdu&display=swap" rel="stylesheet">
        <style>
          @media print {
            body {
              background-color: #ffffff !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .container {
              box-shadow: none !important;
              margin: 0 !important;
              border-width: 8px !important;
            }
          }
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f1f5f9;
            color: #0f172a;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            width: 100%;
            max-width: 800px;
            background: #ffffff;
            border: 12px double #d97706; /* Elegant double gold border */
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            box-sizing: border-box;
            position: relative;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #065f46;
          }
          .subtitle {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 3px;
            color: #b45309;
            margin-top: 5px;
            text-transform: uppercase;
          }
          .card-title {
            font-size: 24px;
            font-weight: 800;
            text-align: center;
            color: #1e293b;
            margin-bottom: 30px;
          }
          .arabic-box {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 28px;
            margin-bottom: 30px;
            text-align: center;
            position: relative;
          }
          .arabic {
            font-family: 'Amiri', serif;
            font-size: 32px;
            line-height: 1.8;
            color: #047857;
            margin: 0;
            direction: rtl;
          }
          .translations {
            display: grid;
            grid-template-columns: 1fr;
            gap: 25px;
            margin-bottom: 30px;
          }
          .translation-block {
            padding: 15px 20px;
            background-color: #fafaf9;
            border-radius: 8px;
          }
          .translation-block.ur-block {
            border-right: 4px solid #f59e0b;
            text-align: right;
          }
          .translation-block.en-block {
            border-left: 4px solid #10b981;
            text-align: left;
          }
          .label {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #b45309;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          .translation {
            font-size: 15px;
            line-height: 1.6;
            margin: 0;
            color: #334155;
          }
          .translation.urdu {
            font-family: 'Noto Nastaliq Urdu', serif;
            font-size: 18px;
            line-height: 2.2;
            direction: rtl;
          }
          .ref-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            font-size: 13px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 35px;
          }
          .ref-item {
            margin-bottom: 8px;
          }
          .ref-item:last-child {
            margin-bottom: 0;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HASNAIN FOUNDATION</div>
            <div class="subtitle">Spiritual Healing & Ruqyah Center</div>
          </div>
          
          <div class="card-title">
            ${topic.title.en} <br/>
            <span style="font-family: 'Noto Nastaliq Urdu', serif; font-size: 20px; color: #b45309; direction: rtl; display: inline-block; margin-top: 8px;">${topic.title.ur}</span>
          </div>
          
          <div class="arabic-box">
            <p class="arabic" dir="rtl">${topic.arabic}</p>
          </div>
          
          <div class="translations">
            <div class="translation-block ur-block">
              <div class="label">اردو ترجمہ (Urdu Translation)</div>
              <p class="translation urdu" dir="rtl">${topic.urdu}</p>
            </div>
            
            <div class="translation-block en-block">
              <div class="label">English Translation</div>
              <p class="translation english">${topic.english}</p>
            </div>
          </div>
          
          <div class="ref-box">
            <div class="ref-item">
              <strong>Quranic Source:</strong> ${topic.quranReference.en} (${topic.quranReference.ur})
            </div>
            <div class="ref-item" style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
              <strong>Hadith Reference:</strong> ${topic.hadithReference.en}
              <div style="font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; font-size: 14px; margin-top: 5px; line-height: 1.8; color: #475569;">
                ${topic.hadithReference.ur}
              </div>
            </div>
          </div>
          
          <div class="footer">
            Hasnain Foundation Spiritual Healing Center - Free of charge for the sake of Allah.<br />
            Khalifa Salman Ali Qadri: 0315-2204134 | Allama Shayan Ali Qadri: 0313-3830370<br />
            Official Web: www.hasnainfoundation.org
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }, 500);
          }
        </script>
      </body>
    </html>
  `;
}

export default function KnowledgeLibrary({ lang }: { lang: Language }) {
  const isUrdu = lang === 'ur';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'surah' | 'adhkar' | 'protection'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<{ [key: string]: string }>({});

  const handleAction = (topicId: string, actionType: 'jpg' | 'pdf' | 'print' | 'share') => {
    const key = `${topicId}-${actionType}`;
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) return;
    
    if (actionType === 'print' || actionType === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(getPrintableHtml(topic));
        printWindow.document.close();
      }
    } else if (actionType === 'share') {
      const shareText = `*${topic.title[lang]}*\n\nArabic: ${topic.arabic}\n\nDownload this from Hasnain Foundation Spiritual Healing Library at ${window.location.href}`;
      navigator.clipboard.writeText(shareText);
    } else if (actionType === 'jpg') {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw elegant gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#022c22'); // deep emerald
        gradient.addColorStop(0.5, '#064e3b');
        gradient.addColorStop(1, '#022c22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw double gold border
        ctx.strokeStyle = '#f59e0b'; // Amber gold
        ctx.lineWidth = 8;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
        ctx.lineWidth = 3;
        ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

        // Draw Corner Ornaments (Classic Islamic geometric art look)
        const drawCorner = (cx: number, cy: number, rot: number) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(40, 0);
          ctx.lineTo(40, 40);
          ctx.lineTo(0, 40);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        };
        drawCorner(60, 60, 0);
        drawCorner(canvas.width - 60, 60, Math.PI / 2);
        drawCorner(canvas.width - 60, canvas.height - 60, Math.PI);
        drawCorner(60, canvas.height - 60, -Math.PI / 2);

        // Header
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 36px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HASNAIN FOUNDATION', canvas.width / 2, 120);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 20px "Inter", sans-serif';
        ctx.fillText('OFFICIAL SPIRITUAL HEALING CENTER', canvas.width / 2, 160);

        // Decorative Divider
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, 200);
        ctx.lineTo(canvas.width - 100, 200);
        ctx.stroke();

        // Card Title
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 32px "Inter", sans-serif';
        ctx.fillText(topic.title.en, canvas.width / 2, 260);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 24px "Inter", sans-serif';
        ctx.fillText(topic.title.ur, canvas.width / 2, 310);

        // Arabic Calligraphy Box Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.2)';
        ctx.lineWidth = 2;
        // round rect for Arabic
        const rx = 100, ry = 360, rw = canvas.width - 200, rh = 340, radius = 20;
        ctx.beginPath();
        ctx.moveTo(rx + radius, ry);
        ctx.lineTo(rx + rw - radius, ry);
        ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
        ctx.lineTo(rx + rw, ry + rh - radius);
        ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
        ctx.lineTo(rx + radius, ry + rh);
        ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
        ctx.lineTo(rx, ry + radius);
        ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Arabic Text
        ctx.fillStyle = '#ecfdf5';
        ctx.font = 'bold 32px "Amiri", "Georgia", serif';
        ctx.direction = 'rtl';
        wrapCanvasText(ctx, topic.arabic, canvas.width / 2, 450, canvas.width - 260, 60, 'center');
        ctx.direction = 'ltr'; // reset

        // Urdu Translation
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 20px "Inter", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(':اردو ترجمہ', canvas.width - 100, 750);

        ctx.fillStyle = '#f3f4f6';
        ctx.font = 'bold 22px "Inter", sans-serif';
        ctx.direction = 'rtl';
        wrapCanvasText(ctx, topic.urdu, canvas.width - 100, 800, canvas.width - 200, 45, 'right');
        ctx.direction = 'ltr'; // reset

        // English Translation
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 20px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ENGLISH TRANSLATION:', 100, 1020);

        ctx.fillStyle = '#e5e7eb';
        ctx.font = '18px "Inter", sans-serif';
        wrapCanvasText(ctx, topic.english, 100, 1060, canvas.width - 200, 32, 'left');

        // References Block
        ctx.fillStyle = 'rgba(4, 120, 87, 0.1)';
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.15)';
        const r2x = 100, r2y = 1220, r2w = canvas.width - 200, r2h = 180;
        ctx.beginPath();
        ctx.rect(r2x, r2y, r2w, r2h);
        ctx.fill();
        ctx.stroke();

        // Quran Ref
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('QURAN REFERENCE: ' + topic.quranReference.en + ' (' + topic.quranReference.ur + ')', 120, 1260);

        // Hadith Ref
        ctx.fillStyle = '#34d399';
        ctx.fillText('AUTHENTIC HADITH:', 120, 1300);
        ctx.fillStyle = '#e5e7eb';
        ctx.font = 'italic 15px "Inter", sans-serif';
        wrapCanvasText(ctx, topic.hadithReference.en, 120, 1330, canvas.width - 240, 25, 'left');

        // Footer Contact
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '14px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hasnain Foundation Spiritual Healing Center - Free of charge for the sake of Allah.', canvas.width / 2, 1445);
        ctx.fillText('Khalifa Salman Ali Qadri: 0315-2204134 | Allama Shayan Ali Qadri: 0313-3830370', canvas.width / 2, 1475);
        ctx.fillText('Official Portal: www.hasnainfoundation.org', canvas.width / 2, 1505);

        // Trigger real download
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `Hasnain_Foundation_${topicId}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          console.error("Canvas toDataURL failed:", e);
        }
      }
    }

    setActionSuccess(prev => ({
      ...prev,
      [key]: actionType === 'share' 
        ? (isUrdu ? 'متن کاپی ہو گیا!' : 'Copied link to clipboard!')
        : (isUrdu ? 'فائل تیار ہو رہی ہے...' : `Generating ${actionType.toUpperCase()}...`)
    }));

    setTimeout(() => {
      setActionSuccess(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }, 2500);
  };

  const filteredTopics = TOPICS.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      t.title.en.toLowerCase().includes(searchLower) ||
      t.title.ur.includes(searchLower) ||
      t.urdu.includes(searchLower) ||
      t.english.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="library-section" className="py-2 bg-gradient-to-b from-slate-900 to-emerald-950 text-white rounded-3xl relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 relative z-10 py-4">

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-md mb-12">
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {[
              { id: 'all', label: { en: 'All Material', ur: 'تمام مواد' } },
              { id: 'surah', label: { en: 'Quranic Surahs', ur: 'قرآنی سورتیں' } },
              { id: 'adhkar', label: { en: 'Daily Adhkar', ur: 'روزمرہ اذکار' } },
              { id: 'protection', label: { en: 'Protection Duas', ur: 'حفاظتی دعائیں' } }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                } ${isUrdu ? 'font-urdu' : ''}`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? "آیات، ترجمہ یا عنوان تلاش کریں..." : "Search verses or translations..."}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-amber-500 text-slate-100 placeholder-slate-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-slate-900/60 rounded-3xl border border-emerald-500/20 hover:border-amber-500/30 p-6 sm:p-8 flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300 relative group"
              >
                {/* Visual Glass Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-amber-500/5 transition-all duration-300" />
                
                {/* Card Title Header */}
                <div id={`printable-${topic.id}`}>
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className={`text-base sm:text-lg font-black text-amber-100 ${
                          isUrdu ? 'font-urdu' : 'font-sans'
                        }`}>
                          {topic.title[lang]}
                        </h3>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
                          {isUrdu ? 'شرعی روحانی علاج' : 'Authentic Healing Shield'}
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-[10px] sm:text-xs text-amber-400 font-mono px-2.5 py-1 rounded bg-amber-500/5 border border-amber-500/15">
                      {isUrdu ? topic.quranReference.ur : topic.quranReference.en}
                    </span>
                  </div>

                  {/* Core Arabic Text - Styled magnificently like calligraphy */}
                  <div className="my-6 bg-slate-950/40 p-5 rounded-2xl border border-emerald-500/10 text-center relative overflow-hidden group-hover:border-amber-500/15 transition-colors">
                    {/* Geometric Watermark */}
                    <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                      <svg className="w-full h-full text-amber-400 scale-125" viewBox="0 0 100 100" fill="currentColor">
                        <polygon points="50,0 60,35 95,35 65,55 80,90 50,70 20,90 35,55 5,35 40,35" />
                      </svg>
                    </div>

                    <p className="text-xl sm:text-2xl font-semibold text-emerald-100 leading-loose tracking-wide font-arabic relative z-10 select-all" dir="rtl">
                      {topic.arabic}
                    </p>
                  </div>

                  {/* Translations block */}
                  <div className="space-y-4 my-6">
                    {/* Urdu Translation */}
                    <div className="text-right" dir="rtl">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1">
                        اردو ترجمہ:
                      </span>
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-urdu">
                        {topic.urdu}
                      </p>
                    </div>

                    {/* English Translation */}
                    <div>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1">
                        English Translation:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {topic.english}
                      </p>
                    </div>
                  </div>

                  {/* Authentic Source References (Quran & Hadith) */}
                  <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-2xl p-4 text-xs space-y-2 mt-6">
                    <div className="flex items-start gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-400">
                          {isUrdu ? 'قرآنی حوالہ:' : 'Quranic Reference:'}
                        </span>{' '}
                        <span className="text-slate-300">
                          {isUrdu ? topic.quranReference.ur : topic.quranReference.en}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 border-t border-slate-800/50 pt-2">
                      <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold text-amber-400">
                          {isUrdu ? 'مستند حدیث حوالہ:' : 'Authentic Hadith:'}
                        </span>{' '}
                        <span className="text-slate-300">
                          {isUrdu ? topic.hadithReference.ur : topic.hadithReference.en}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download / Print Actions Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-8 pt-6 border-t border-slate-800/80">
                  
                  {/* Download JPG */}
                  <div className="relative">
                    <button
                      onClick={() => handleAction(topic.id, 'jpg')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUrdu ? 'ڈاؤن لوڈ JPG' : 'Download JPG'}</span>
                    </button>
                    {actionSuccess[`${topic.id}-jpg`] && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded shadow-lg whitespace-nowrap animate-fade-in z-20">
                        {actionSuccess[`${topic.id}-jpg`]}
                      </span>
                    )}
                  </div>

                  {/* Download PDF */}
                  <div className="relative">
                    <button
                      onClick={() => handleAction(topic.id, 'pdf')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUrdu ? 'ڈاؤن لوڈ PDF' : 'Download PDF'}</span>
                    </button>
                    {actionSuccess[`${topic.id}-pdf`] && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded shadow-lg whitespace-nowrap animate-fade-in z-20">
                        {actionSuccess[`${topic.id}-pdf`]}
                      </span>
                    )}
                  </div>

                  {/* Print */}
                  <div className="relative">
                    <button
                      onClick={() => handleAction(topic.id, 'print')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUrdu ? 'پرنٹ کارڈ' : 'Print Card'}</span>
                    </button>
                    {actionSuccess[`${topic.id}-print`] && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded shadow-lg whitespace-nowrap animate-fade-in z-20">
                        {actionSuccess[`${topic.id}-print`]}
                      </span>
                    )}
                  </div>

                  {/* Share */}
                  <div className="relative">
                    <button
                      onClick={() => handleAction(topic.id, 'share')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isUrdu ? 'شیئر کریں' : 'Share card'}</span>
                    </button>
                    {actionSuccess[`${topic.id}-share`] && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded shadow-lg whitespace-nowrap animate-fade-in z-20">
                        {actionSuccess[`${topic.id}-share`]}
                      </span>
                    )}
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Disclaimer Board */}
        <div className="mt-16 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/15 text-center max-w-3xl mx-auto">
          <p className={`text-xs text-amber-400/90 leading-relaxed ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu 
              ? 'انتباہ: یہ روحانی اذکار اور دعائیں شفاء کے لیے بہترین قرآنی اور شرعی نسخے ہیں۔ ہمارا عقیدہ ہے کہ شفاء دینے والی ذات صرف اور صرف اللہ تبارک و تعالیٰ کی ہے۔ اس روحانی مواد کو علاج معالجے کے لیے آزادانہ طور پر استعمال کریں۔'
              : 'Divine Note: These spiritual prayers are designed based on the authentic teachings of Islam for healing and refuge. We firmly believe that ultimate healing comes only by the Will of Allah.'}
          </p>
        </div>

      </div>
    </div>
  );
}
