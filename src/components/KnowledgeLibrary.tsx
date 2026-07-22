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
    id: 'shifa-1',
    title: { en: 'Surah Al-Fatiha (Healing for All Illnesses)', ur: 'سورۃ الفاتحہ (تمام امراض اور تکلیف کی شفاء)' },
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    urdu: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔ سب تعریفیں اللہ کے لیے ہیں جو سب جہانوں کا پالنے والا ہے۔ بہت مہربان، نہایت رحم کرنے والا ہے۔ جزا اور سزا کے دن کا مالک ہے۔ ہم صرف تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں۔ ہمیں سیدھے راستے کی ہدایت فرما۔ ان لوگوں کے راستے کی جن پر تو نے اپنا فضل کیا، نہ کہ ان کے راستے کی جن پر تیرا غضب نازل ہوا اور نہ ہی گمراہوں کے راستے۔',
    english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    quranReference: { en: 'Surah Al-Fatiha (1:1-7)', ur: 'سورۃ الفاتحہ (آیات ۱-۷)' },
    hadithReference: { 
      en: 'The Prophet (PBUH) confirmed that Al-Fatiha is a Ruqyah (cure for every illness). Recite 111 times.', 
      ur: 'رسول اللہ ﷺ نے اس کی تصدیق فرمائی کہ سورۃ الفاتحہ ہر بیماری کا روحانی علاج ہے۔ شفاء کے لیے ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-2',
    title: { en: 'Ayat-ul-Kursi (Supreme Protection & Heart Peace)', ur: 'آیت الکرسی (کامل حفاظت اور دل کا سکون)' },
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۚ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    urdu: 'اللہ، اس کے سوا کوئی معبود نہیں، جو ہمیشہ زندہ رہنے والا، کائنات کا نگہبان ہے۔ نہ اسے اونگھ آتی ہے نہ نیند۔ جو کچھ آسمانوں اور زمین میں ہے سب اسی کا ہے۔ کون ہے جو اس کی اجازت کے بغیر اس کے حضور سفارش کر سکے؟ وہ سب کچھ جانتا ہے جو ان کے سامنے ہے اور جو ان کے پیچھے ہے۔ اور وہ اس کے علم میں سے کسی چیز کا احاطہ نہیں کر سکتے مگر جتنا وہ چاہے۔ اس کی کرسی آسمانوں اور زمین پر محیط ہے، اور ان کی حفاظت اسے تھکاتی نہیں، اور وہ نہایت بلند، بہت بڑا ہے۔',
    english: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Throne extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    quranReference: { en: 'Surah Al-Baqarah (2:255)', ur: 'سورۃ البقرۃ (آیت ۲۵۵)' },
    hadithReference: { 
      en: 'Protects against satanic whispers, anxiety, and midnight panic attacks. Recite 111 times.', 
      ur: 'وساوسِ شیطانی، وہم، خوف اور دل کے امراض کے لیے کامل ڈھال ہے۔ روزانہ ۱۱۱ مرتبہ تلاوت فرمائیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-3',
    title: { en: 'Surah Al-Baqarah Final Verses (Relief from Hardships)', ur: 'سورۃ البقرۃ کی آخری آیات (تکالیف اور پریشانیوں سے نجات)' },
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ',
    urdu: 'رسول اس کتاب پر ایمان لایا جو اس کے رب کی طرف سے اس پر نازل ہوئی اور مومن بھی۔ سب اللہ، اس کے فرشتوں، اس کی کتابوں اور اس کے رسولوں پر ایمان لائے۔ ہم اس کے رسولوں میں سے کسی میں فرق نہیں کرتے، اور انہوں نے کہا کہ ہم نے سنا اور اطاعت کی۔ اے ہمارے رب! ہم تیری مغفرت چاہتے ہیں اور تیری ہی طرف لوٹنا ہے۔',
    english: 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers... We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination.',
    quranReference: { en: 'Surah Al-Baqarah (2:285)', ur: 'سورۃ البقرۃ (آیت ۲۸۵)' },
    hadithReference: { 
      en: 'Reciting these verses at night suffices for protection and healing. Recite 111 times.', 
      ur: 'رسول اللہ ﷺ نے فرمایا کہ یہ دو آیات رات کو پڑھنے والے کی حفاظت اور شفاء کے لیے کافی ہیں۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-4',
    title: { en: 'Surah Al-Imran Sovereignty Verse (Prosperity & Wellness)', ur: 'آیتِ ملک (عزت، عافیت اور پریشانی کا خاتمہ)' },
    arabic: 'قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ ۖ بِيَدِكَ الْخَيْرُ ۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    urdu: 'آپ عرض کیجیے: اے اللہ! کائنات کے مالک! تو جس کو چاہتا ہے حکومت دیتا ہے اور جس سے چاہتا ہے حکومت چھین لیتا ہے، اور جس کو چاہتا ہے عزت دیتا ہے اور جس کو چاہتا ہے ذلیل کرتا ہے، تمام بھلائی تیرے ہی ہاتھ میں ہے، یقیناً تو ہر چیز پر قادر ہے۔',
    english: 'Say, "O Allah, Owner of Sovereignty, You give sovereignty to whom You will and You take sovereignty from whom You will. You honor whom You will and You humble whom You will. In Your hand is [all] good. Indeed, You are over all things competent."',
    quranReference: { en: 'Surah Al-Imran (3:26)', ur: 'سورۃ آل عمران (آیت ۲۶)' },
    hadithReference: { 
      en: 'For clearing debts, curing despondency, and achieving divine wellness. Recite 111 times.', 
      ur: 'قرضوں کی ادائی، مایوسی کا خاتمہ اور جسمانی عافیت پانے کے لیے مجرب ہے۔ ۱۱۱ مرتبہ تلاوت فرمائیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-5',
    title: { en: 'Hasbunallahu Wa Ni\'mal Wakeel (Overcoming Fear)', ur: 'حسبنا اللہ ونعم الوکیل (دشمن کے خوف اور گھبراہٹ کا علاج)' },
    arabic: 'الَّذِينَ قَالَ لَهُمُ النَّاسُ إِنَّ النَّاسَ قَدْ جَمَعُوا لَكُمْ فَاخْشَوْهُمْ فَزَادَهُمْ إِيمَانًا وَقَالُوا حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    urdu: 'جن سے لوگوں نے کہا کہ لوگوں نے تمہارے خلاف بڑا لشکر جمع کیا ہے تو ان سے ڈرو، لیکن اس بات نے ان کا ایمان اور بڑھا دیا اور انہوں نے کہا: ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے۔',
    english: 'Those to whom hypocrites said, "Indeed, the people have gathered against you, so fear them." But it [merely] increased them in faith, and they said, "Sufficient for us is Allah, and [He is] the best Disposer of affairs."',
    quranReference: { en: 'Surah Al-Imran (3:173)', ur: 'سورۃ آل عمران (آیت ۱۷۳)' },
    hadithReference: { 
      en: 'A powerful shield against anxiety, stress, enemies, and unexpected illness. Recite 111 times.', 
      ur: 'گھبراہٹ، خوف، مقدمات اور ناگہانی حادثات سے نجات پانے کا بہترین قرآنی وظیفہ ہے۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-6',
    title: { en: 'Surah Al-An\'am Verse 17 (Removal of Chronic Sickness)', ur: 'سورۃ الانعام آیت ۱۷ (دیرینہ امراض اور تکالیف سے نجات)' },
    arabic: 'وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ ۖ وَإِن يَمْسَسْكَ بِخَيْرٍ فَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    urdu: 'اور اگر اللہ تمہیں کوئی تکلیف پہنچائے تو اس کے سوا کوئی اسے دور کرنے والا نہیں، اور اگر وہ تمہیں کوئی بھلائی پہنچائے تو وہ ہر چیز پر قادر ہے۔',
    english: 'And if Allah should touch you with adversity, there is no remover of it except Him. And if He touches you with good - then He is over all things competent.',
    quranReference: { en: 'Surah Al-An\'am (6:17)', ur: 'سورۃ الانعام (آیت ۱۷)' },
    hadithReference: { 
      en: 'For chronic diseases, body pains, and seeking cure directly from Allah. Recite 111 times.', 
      ur: 'پرانے امراض، لاعلاج بیماریوں اور درد سے نجات کے لیے اللہ کی بارگاہ میں رجوع کرنے کی بہترین دعا ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-7',
    title: { en: 'Surah Al-A\'raf Creation Verse (Mental Calm & Insomnia)', ur: 'آیتِ تخلیق (ذہنی سکون اور بے خوابی کا علاج)' },
    arabic: 'إِنَّ رَبَّكُمُ اللَّهُ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ فِي سِتَّةِ أَيَّامٍ ثُمَّ اسْتَوَىٰ عَلَى الْعَرْشِ يُغْشِي اللَّيْلَ النَّهَارَ يَطْلُبُهُ حَثِيثًا وَالشَّمْسَ وَالْقَمَرَ وَالنُّجُومَ مُسَخَّرَاتٍ بِأَمْرِهِ ۗ أَلَا لَهُ الْخَلْقُ وَالْأَمْرُ ۗ تَبَارَكَ اللَّهُ رَبُّ الْعَالَمِينَ',
    urdu: 'بیشک تمہارا رب اللہ ہے جس نے آسمانوں اور زمین کو چھ دنوں میں پیدا کیا، پھر عرش پر مستوی ہوا، وہ رات سے دن کو ڈھانپ دیتا ہے کہ رات دن کے پیچھے تیزی سے دوڑتی ہوئی چلی آتی ہے، اور سورج، چاند اور ستارے سب اسی کے حکم کے تابع ہیں۔ سن لو! اسی کے لیے ہے پیدا کرنا اور حکم دینا، بڑی برکت والا ہے اللہ جو سب جہانوں کا پروردگار ہے۔',
    english: 'Indeed, your Lord is Allah, who created the heavens and the earth in six days and then established Himself above the Throne. He covers the night with the day, [another night] chasing it rapidly; and [He created] the sun, the moon, and the stars, subjected by His command. Unquestionably, His is the creation and the command; blessed is Allah, Lord of the worlds.',
    quranReference: { en: 'Surah Al-A\'raf (7:54)', ur: 'سورۃ الاعراف (آیت ۵۴)' },
    hadithReference: { 
      en: 'Highly beneficial for mental peace, sleep disorders, and relaxation. Recite 111 times.', 
      ur: 'ذہنی انتشار، پریشان کن خوابوں اور بے خوابی (انسومنیا) کے مریضوں کے لیے شفاء ہے۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-8',
    title: { en: 'Surah Al-A\'raf Magic Destroyer (Uprooting Sorcery)', ur: 'سورۃ الاعراف (جادو، نظرِ بد اور عاصب کا خاتمہ)' },
    arabic: 'وَأَوْحَيْنَا إِلَىٰ مُوسَىٰ أَنْ أَلْقِ عَصَاكَ ۖ فَإِذَا هِيَ تَلْقَفُ مَا يَأْفِكُونَ ۝ فَوَقَعَ الْحَقُّ وَبَطَلَ مَا كَانُوا يَعْمَلُونَ ۝ فَغُلِبُوا هُنَالِكَ وَانقَلَبُوا صَاغِرِينَ',
    urdu: 'اور ہم نے موسیٰ کو وحی کی کہ اپنی لاٹھی ڈال دو، تو اچانک وہ ان کے بنائے ہوئے جھوٹے سانپوں کو نگلنے لگی۔ پس حق ثابت ہو گیا اور جو کچھ وہ (جادوگر) کر رہے تھے سب باطل ہو گیا۔ پس وہ وہاں مغلوب ہو گئے اور ذلیل ہو کر لوٹے۔',
    english: 'And We inspired to Moses, "Throw your staff," and at once it swallowed up what they were falsifying. So the truth was established, and abolished was what they were doing. And they were defeated there and returned disgraced.',
    quranReference: { en: 'Surah Al-A\'raf (7:117-119)', ur: 'سورۃ الاعراف (آیات ۱۱۷-۱۱۹)' },
    hadithReference: { 
      en: 'Cures blockage, physical exhaustion, and destroys negative spell effects. Recite 111 times.', 
      ur: 'کاروباری بندش، سخت جادو، حسد اور جسمانی کمزوری کو جڑ سے اکھاڑ پھینکنے کے لیے مجرب ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-9',
    title: { en: 'Surah Yunus Verse 57 (Healing of Heart & Mind)', ur: 'سورۃ یونس آیت ۵۷ (دل کے امراض اور وسوسوں سے شفا)' },
    arabic: 'يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ وَهُدًى وَرَحْمَةٌ لِّلْمُؤْمِنِينَ',
    urdu: 'اے لوگو! بیشک تمہارے پاس تمہارے رب کی طرف سے نصیحت آ گئی ہے اور ان (بیماریوں) کی شفاء جو سینوں میں ہیں اور ایمان والوں کے لیے ہدایت اور رحمت ہے۔',
    english: 'O mankind, there has to you come an instruction from your Lord and healing for what is in the breasts and guidance and mercy for the believers.',
    quranReference: { en: 'Surah Yunus (10:57)', ur: 'سورۃ یونس (آیت ۵۷)' },
    hadithReference: { 
      en: 'A healing verse for cardiac disorders, depression, anxiety, and doubt. Recite 111 times.', 
      ur: 'دل کی گھبراہٹ، بائی پاس سرجری سے بچاؤ، ذہنی دباؤ اور عقائد کی درستی کے لیے اکسیر ہے۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-10',
    title: { en: 'Surah Yunus Magic Neutralizer (Breaking Obstacles)', ur: 'ابطالِ جادو (شدید بندش اور جادو کا توڑ)' },
    arabic: 'فَلَمَّا أَلْقَوْا قَالَ مُوسَىٰ مَا جِئْتُم بِهِ السِّحْرُ ۖ إِنَّ اللَّهَ سَيُبْطِلُهُ ۖ إِنَّ اللَّهَ لَا يُصْلِحُ عَمَلَ الْمُفْسِدِينَ ۝ وَيُحِقُّ اللَّهُ الْحَقَّ بِكَلِمَاتِهِ وَلَوْ كَرِهَ الْمُجْرِمُونَ',
    urdu: 'پھر جب انہوں نے (جادو کی رسیاں) ڈالیں تو موسیٰ نے کہا: جو کچھ تم لائے ہو یہ جادو ہے، یقیناً اللہ ابھی اسے باطل کر دے گا، بیشک اللہ مفسدوں کے کام کو نہیں سدھارتا۔ اور اللہ اپنے کلمات کے ذریعے حق کو ثابت کر دیتا ہے خواہ مجرم برا ہی مانیں۔',
    english: 'And when they had thrown, Moses said, "What you have brought is [only] magic. Indeed, Allah will expose its worthlessness. Indeed, Allah does not amend the work of corrupters. And Allah will establish the truth by His words, even if the criminals dislike it."',
    quranReference: { en: 'Surah Yunus (10:81-82)', ur: 'سورۃ یونس (آیات ۸۱-۸۲)' },
    hadithReference: { 
      en: 'Dismantles severe curses, knots of magic, and black magic symptoms. Recite 111 times.', 
      ur: 'ہر قسم کے سفلی جادو، شیطانی اثرات اور لاعلاج جسمانی جکڑن کا فوری اور حتمی توڑ ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-11',
    title: { en: 'Surah Yunus Relief Verse (Cure from Terminal Sickness)', ur: 'کشفِ بلاء (بیماریوں اور مصیبتوں سے مخلصی)' },
    arabic: 'وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ ۖ وَإِن يُرِدْكَ بِخَيْرٍ فَلَا رَادَّ لِفَضْلِهِ ۚ يُصِيبُ بِهِ مَن يَشَاءُ مِنْ عِبَادِهِ ۚ وَهُوَ الْغَفُورُ الرَّحِيمُ',
    urdu: 'اور اگر اللہ تمہیں کوئی تکلیف پہنچائے تو اس کے سوا کوئی اسے دور کرنے والا نہیں، اور اگر وہ تمہارے ساتھ بھلائی کا ارادہ فرمائے تو اس کے فضل کو کوئی پھیرنے والا نہیں، وہ اپنے بندوں میں سے جس کو چاہتا ہے اپنا فضل پہنچاتا ہے، اور وہ نہایت بخشنے والا بڑا رحم فرمانے والا ہے۔',
    english: 'And if Allah should touch you with adversity, there is no remover of it except Him; and if He intends for you good, then there is no repeller of His bounty. He causes it to reach whom He wills of His servants. And He is the Forgiving, the Merciful.',
    quranReference: { en: 'Surah Yunus (10:107)', ur: 'سورۃ یونس (آیت ۱۰۷)' },
    hadithReference: { 
      en: 'For critical health conditions, kidney failure, or complex medical cases. Recite 111 times.', 
      ur: 'جان لیوا بیماریوں، کینسر، گردوں کے فیل ہونے اور دیگر پیچیدہ طبی حالات میں شفاء پانے کے لیے پڑھیں۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-12',
    title: { en: 'Surah Al-Isra Shifa Verse (The Quranic Panacea)', ur: 'سورۃ الاسراء (قرآن مجید کی شفا اور رحمت کا نزول)' },
    arabic: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ ۙ وَلَا يَزِيدُ الظَّالِمِينَ إِلَّا خَسَارًا',
    urdu: 'اور ہم قرآن میں سے وہ چیز نازل کرتے ہیں جو ایمان والوں کے لیے شفاء اور رحمت ہے، اور یہ ظالموں کے لیے نقصان کے سوا کسی چیز میں اضافہ نہیں کرتا۔',
    english: 'And We send down of the Quran that which is healing and mercy for the believers, but it does not increase the wrongdoers except in loss.',
    quranReference: { en: 'Surah Al-Isra (17:82)', ur: 'سورۃ الاسراء (آیت ۸۲)' },
    hadithReference: { 
      en: 'An overall medicine for eye diseases, physical weakness, and blood disorders. Recite 111 times.', 
      ur: 'آنکھوں کی بینائی، جسمانی درد، فالج، اور جگر کے امراض کے لیے بہترین روحانی دوائی ہے۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-13',
    title: { en: 'Surah Maryam Verse (Relief from Heartburn & Stomach Issues)', ur: 'سورۃ مریم (معدے کے امراض اور دل کے سکون کے لیے)' },
    arabic: 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا',
    urdu: 'بیشک جو لوگ ایمان لائے اور انہوں نے نیک اعمال کیے، عنقریب رحمن ان کے لیے لوگوں کے دلوں میں محبت پیدا فرما دے گا۔',
    english: 'Indeed, those who have believed and done righteous deeds - the Most Merciful will appoint for them affection.',
    quranReference: { en: 'Surah Maryam (19:96)', ur: 'سورۃ مریم (آیت ۹۶)' },
    hadithReference: { 
      en: 'Calms nerves, heals ulcers, stomach acidity, and relationships. Recite 111 times.', 
      ur: 'معدے کی تیزابیت، السر، خاندانی جھگڑوں اور باہمی دشمنی کو محبت میں بدلنے کے لیے مجرب ہے۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-14',
    title: { en: 'Surah Taha Speech Verse (Curing Stammering & Speech Defects)', ur: 'سورۃ طٰہٰ (لکنت، زبان کی ہکلاہٹ اور یادداشت کا علاج)' },
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ۝ يَفْقَهُوا قَوْلِي',
    urdu: 'اے میرے رب! میرا سینہ میرے لیے کھول دے۔ اور میرا کام میرے لیے آسان کر دے۔ اور میری زبان کی گرہ کھول دے۔ تاکہ لوگ میری بات سمجھ سکیں۔',
    english: '[Moses] said, "My Lord, expand for me my breast. And ease for me my task. And untie the knot from my tongue. That they may understand my speech."',
    quranReference: { en: 'Surah Taha (20:25-28)', ur: 'سورۃ طٰہٰ (آیات ۲۵-۲۸)' },
    hadithReference: { 
      en: 'Cures child speech delays, stuttering, and boosts public speaking confidence. Recite 111 times.', 
      ur: 'بچوں کے دیر سے بولنے، ہکلاہٹ، لکنت، گلے کے غدود اور امتحان میں کامیابی کے لیے نہایت فائدہ مند ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-15',
    title: { en: 'Surah Taha Kidney & Gallbladder Stones (Dissolving Pain)', ur: 'سورۃ طٰہٰ (گردے، پتے کی پتھری اور جسمانی رسولی کا خاتمہ)' },
    arabic: 'وَيَسْأَلُونَكَ عَنِ الْجِبَالِ فَقُلْ يَنسِفُهَا رَبِّي نَسْفًا',
    urdu: 'اور وہ آپ سے پہاڑوں کے بارے میں پوچھتے ہیں، تو کہہ دیجیے کہ میرا رب انہیں اڑا کر بالکل ریزہ ریزہ کر دے گا۔',
    english: 'And they ask you about the mountains, so say, "My Lord will blow them away with a [severe] blast."',
    quranReference: { en: 'Surah Taha (20:105)', ur: 'سورۃ طٰہٰ (آیت ۱۰۵)' },
    hadithReference: { 
      en: 'Recite over water for dissolving gallstones, kidney stones, and tumors. Recite 111 times.', 
      ur: 'پتے اور گردے کی پتھری، جسمانی گلٹیاں اور اپینڈکس کے درد کے خاتمے کے لیے پانی پر دم کر کے پیئیں۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-16',
    title: { en: 'Dua of Prophet Ayyub (AS) (Severe Illness Recovery)', ur: 'دعائے حضرت ایوب علیہ السلام (سخت جسمانی اور جلدی بیماریوں کا علاج)' },
    arabic: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
    urdu: 'بیشک مجھے سخت بیماری لگی ہے اور تو سب رحم کرنے والوں سے بڑھ کر رحم کرنے والا ہے۔',
    english: '"Indeed, adversity has touched me, and you are the Most Merciful of the merciful."',
    quranReference: { en: 'Surah Al-Anbiya (21:83)', ur: 'سورۃ الانبیاء (آیت ۸۳)' },
    hadithReference: { 
      en: 'For skin diseases, paralysis, chronic infections, and long-term suffering. Recite 111 times.', 
      ur: 'خارش، جلدی امراض، اعصابی فالج، جوڑوں کا درد اور ناقابلِ برداشت تکلیف سے نجات کے لیے پڑھیں۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-17',
    title: { en: 'Ayat-e-Karima (Curing Depression & Intense Worry)', ur: 'آیتِ کریمہ (سخت گھبراہٹ، ذہنی تناؤ اور لاچاری کا توڑ)' },
    arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    urdu: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بیشک میں ہی قصورواروں میں سے تھا۔',
    english: '"There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers."',
    quranReference: { en: 'Surah Al-Anbiya (21:87)', ur: 'سورۃ الانبیاء (آیت ۸۷)' },
    hadithReference: { 
      en: 'The Prophet (PBUH) said no Muslim asks through this but Allah accepts their cure. Recite 111 times.', 
      ur: 'رسول اللہ ﷺ نے فرمایا کہ جو مسلمان اس دعا کے ذریعے دعا کرے گا، اللہ اس کی مصیبت اور بیماری دور فرما دے گا۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-18',
    title: { en: 'Dua of Prophet Zakariya (Offspring & Infertility Cure)', ur: 'دعائے حضرت زکریا علیہ السلام (بے اولادی کا خاتمہ اور بانجھ پن کا علاج)' },
    arabic: 'رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ',
    urdu: 'اے میرے رب! مجھے اکیلا نہ چھوڑ اور تو سب سے بہتر وارث ہے۔',
    english: '"My Lord, do not leave me alone [with no heir], while you are the best of providers."',
    quranReference: { en: 'Surah Al-Anbiya (21:89)', ur: 'سورۃ الانبیاء (آیت ۸۹)' },
    hadithReference: { 
      en: 'Highly recommended for couples seeking righteous children and pregnancy health. Recite 111 times.', 
      ur: 'اولادِ نرینہ کے حصول، بانجھ پن، حمل کی حفاظت اور خاندانی بقا کے لیے روزانہ ۱۱۱ مرتبہ تلاوت فرمائیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-19',
    title: { en: 'Surah Al-Mu\'minun Devilish Whispers (Curing OCD & Phobia)', ur: 'سورۃ المؤمنون (شیطانی وسوسوں، وسواس اور فوبیا کا علاج)' },
    arabic: 'رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ ۝ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ',
    urdu: 'اے میرے رب! میں شیاطین کے وسوسوں سے تیری پناہ مانگتا ہوں، اور اے میرے رب! میں اس بات سے بھی تیری پناہ مانگتا ہوں کہ وہ میرے پاس آئیں۔',
    english: '"My Lord, I seek refuge in You from the incitements of the devils, and I seek refuge in You, my Lord, lest they be present with me."',
    quranReference: { en: 'Surah Al-Mu\'minun (23:97-98)', ur: 'سورۃ المؤمنون (آیات ۹۷-۹۸)' },
    hadithReference: { 
      en: 'Destroys severe OCD (waswasah), extreme fears, phobias, and evil presence. Recite 111 times.', 
      ur: 'سخت ذہنی بیماری وسواس (OCD)، خوف، اندھیرے کا فوبیا اور شیطانی حاضری سے نجات کا مضبوط ترین قلعہ ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-20',
    title: { en: 'Surah Al-Mu\'minun Final Verses (Curing High Fever & Jinn)', ur: 'سورۃ المؤمنون آخری آیات (تیز بخار، مرگی اور عاصب کا دم)' },
    arabic: 'أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَاكُمْ عَبَثًا وَأَنَّكُمْ إِلَيْنَا لَا تُرْجَعُونَ ۝ فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ ۖ لَا إِلَٰهَ إِلَّا هُوَ رَبُّ الْعَرْشِ الْكَرِيمِ',
    urdu: 'کیا تم نے یہ گمان کر رکھا تھا کہ ہم نے تمہیں فضول پیدا کیا ہے اور یہ کہ تم ہماری طرف لوٹائے نہیں جاؤ گے؟ پس بہت بلند و برتر ہے اللہ جو سچا بادشاہ ہے، اس کے سوا کوئی معبود نہیں، وہی عرشِ کریم کا مالک ہے۔',
    english: '"Then did you think that We created you uselessly and that to Us you would not be returned?" So exalted is Allah, the Sovereign, the Truth; there is no deity except Him, Lord of the Noble Throne.',
    quranReference: { en: 'Surah Al-Mu\'minun (23:115-116)', ur: 'سورۃ المؤمنون (آیات ۱۱۵-۱۱۶)' },
    hadithReference: { 
      en: 'Recited on the ear of an unconscious patient or high fever sufferer for instant recovery. Recite 111 times.', 
      ur: 'بے ہوشی کی حالت، تیز ترین ٹائیفائیڈ بخار، مرگی کے دورے اور اثرات کو دفع کرنے کے لیے بہترین دم ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-21',
    title: { en: 'Surah Al-Furqan Family Peace (Eyesight & Children Health)', ur: 'سورۃ الفرقان (خاندانی خوشحالی، اولاد کی فرمانبرداری اور نظر کی شفاء)' },
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    urdu: 'اے ہمارے رب! ہمیں ہماری بیویوں اور ہماری اولاد کی طرف سے آنکھوں کی ٹھنڈک عطا فرما اور ہمیں پرہیزگاروں کا پیشوا بنا۔',
    english: '"Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous."',
    quranReference: { en: 'Surah Al-Furqan (25:74)', ur: 'سورۃ الفرقان (آیت ۷۴)' },
    hadithReference: { 
      en: 'Cures family coldness, restores trust, and cures weak eyesight. Recite 111 times.', 
      ur: 'گھر میں لڑائی جھگڑوں، نافرمان اولاد کی اصلاح اور بینائی تیز کرنے کے لیے کثرت سے تلاوت فرمائیں۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-22',
    title: { en: 'Surah Ash-Shu\'ara Shifa Verse (The Absolute Cure of Pain)', ur: 'آیتِ شفاء (جسمانی درد، اعصابی جکڑن اور دائمی تکلیف کا علاج)' },
    arabic: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ',
    urdu: 'اور جب میں بیمار ہوتا ہوں تو وہی مجھے شفاء دیتا ہے۔',
    english: '"And when I am ill, it is He who cures me."',
    quranReference: { en: 'Surah Ash-Shu\'ara (26:80)', ur: 'سورۃ الشعراء (آیت ۸۰)' },
    hadithReference: { 
      en: 'Prophetic medicine for physical pains, migraine, back pain, and heart valve issues. Recite 111 times.', 
      ur: 'حضرت ابراہیم علیہ السلام کا اللہ پر یقین کا اظہار۔ جسم میں کہیں بھی درد ہو، دم کر کے پھونکیں۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-23',
    title: { en: 'Surah Al-Naml Solomon Protection (Uprooting Spiritual Attacks)', ur: 'سورۃ النمل (جنات، خبیث روحوں اور آسیب کا حتمی توڑ)' },
    arabic: 'إِنَّهُ مِن سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ أَلَّا تَعْلُوا عَلَيَّ وَأْتُونِي مُسْلِمِينَ',
    urdu: 'بیشک وہ خط سلیمان کی طرف سے ہے اور وہ یہ ہے: شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔ یہ کہ تم میرے خلاف سرکشی نہ کرو اور میرے پاس فرمانبردار ہو کر چلے آؤ۔',
    english: 'Indeed, it is from Solomon, and indeed, it reads: "In the name of Allah, the Entirely Merciful, the Especially Merciful. Be not haughty with me but come to me in submission."',
    quranReference: { en: 'Surah Al-Naml (27:30-31)', ur: 'سورۃ النمل (آیات ۳۰-۳۱)' },
    hadithReference: { 
      en: 'Exorcises malicious spirits, removes heavy home blockages, and brings peace. Recite 111 times.', 
      ur: 'آسیبی مکان، کاروباری جکڑن، اور آسیب زدہ مریض کو جنات کے چنگل سے چھڑانے کے لیے نہایت ہی تیز اثر دعا ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-24',
    title: { en: 'Surah Al-Naml Emergency Verse (Relief in Crisis & Coma)', ur: 'اضطراری دعا (انتہائی نازک حالت، آئی سی یو اور ایمرجنسی میں شفاء)' },
    arabic: 'أَمَّن يُجِيبُ الْمُضْطَرَّ إِذَا دَعَاهُ وَيَكْشِفُ السُّوءَ وَيَجْعَلُكُمْ خُلَفَاءَ الْأَرْضِ ۗ أَإِلَٰهٌ مَّعَ اللَّهِ ۚ قَلِيلًا مَّا تَذَكَّرُونَ',
    urdu: 'بھلا کون ہے جو بے قرار کی پکار سنتا ہے جب وہ اسے پکارتا ہے اور اس کی تکلیف دور کرتا ہے اور تمہیں زمین کا خلیفہ بناتا ہے؟ کیا اللہ کے ساتھ کوئی اور معبود ہے؟ تم بہت ہی کم نصیحت قبول کرتے ہو۔',
    english: 'Is He [not best] who responds to the desperate one when he calls upon Him and relieves evil and makes you inheritors of the earth? Is there a deity with Allah? Little do you remember.',
    quranReference: { en: 'Surah Al-Naml (27:62)', ur: 'سورۃ النمل (آیت ۶۲)' },
    hadithReference: { 
      en: 'Recite with deep conviction for emergency surgeries, comatose patients, or critical illness. Recite 111 times.', 
      ur: 'کوئی بھی شدید ترین جسمانی یا مالی حادثہ پیش آ جائے، یا مریض کوما/ICU میں ہو، اس کی تلاوت سے بگڑے حالات سدھر جاتے ہیں۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-25',
    title: { en: 'Surah Yasin Safety Shield (Protection from Enemy Harm)', ur: 'سورۃ یٰس آیت ۹ (حاسدین، دشمنوں اور بری نظر سے بچاؤ کا حصار)' },
    arabic: 'وَجَعَلْنَا مِن بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ',
    urdu: 'اور ہم نے ان کے سامنے بھی ایک دیوار بنا دی اور ان کے پیچھے بھی ایک دیوار، پس ہم نے ان کو اوپر سے ڈھانپ دیا تو وہ کچھ دیکھ نہیں سکتے۔',
    english: 'And We have put before them a barrier and behind them a barrier and covered them, so they do not see.',
    quranReference: { en: 'Surah Yasin (36:9)', ur: 'سورۃ یٰس (آیت ۹)' },
    hadithReference: { 
      en: 'Creates an invisible spiritual shield against physical harm and toxic envy. Recite 111 times.', 
      ur: 'شریروں کے وار، چوری، حاسدوں کے حملوں اور جادوگروں کے اثرات کو روکنے کے لیے فولادی حصار ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-26',
    title: { en: 'Surah Yasin Verse of Peace (Curing Chronic Stress & Heart Pain)', ur: 'آیتِ سلام (دل کی گھبراہٹ، خوف اور بلڈ پریشر کا حتمی علاج)' },
    arabic: 'سَلَامٌ قَوْلًا مِّن رَّبِّ رَّحِيمٍ',
    urdu: 'بڑے رحم فرمانے والے رب کی طرف سے انہیں سلام کہا جائے گا۔',
    english: '"[And] "Peace," a word from a Merciful Lord."',
    quranReference: { en: 'Surah Yasin (36:58)', ur: 'سورۃ یٰس (آیت ۵۸)' },
    hadithReference: { 
      en: 'The heart of Surah Yasin. Cures intense stress, high blood pressure, and mental trauma. Recite 111 times.', 
      ur: 'سورہ یٰس کا دل۔ ڈپریشن، وہم، دل کی بند شریانوں، بلڈ پریشر اور گھبراہٹ کو جڑ سے ختم کرتی ہے۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-27',
    title: { en: 'Surah As-Saffat Evil Deflector (Warding off Negative Entities)', ur: 'سورۃ الصافات (شیطانی ارواح اور برے اثرات کا اخراج)' },
    arabic: 'وَحِفْظًا مِّن كُلِّ شَيْطَانٍ مَّارِدٍ',
    urdu: 'اور ہم نے آسمان کو ہر سرکش شیطان سے محفوظ کر دیا۔',
    english: 'And as protection against every rebellious devil.',
    quranReference: { en: 'Surah As-Saffat (37:7)', ur: 'سورۃ الصافات (آیت ۷)' },
    hadithReference: { 
      en: 'Instantly drives away evil entities, negative energies, and heavy atmospheric pressure. Recite 111 times.', 
      ur: 'گھر میں موجود جنات، عاصب، اور برے اثرات کو بھگانے کے لیے پانی پر دم کر کے گھر کے کونوں میں چھڑکیں۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-28',
    title: { en: 'Surah As-Saffat Safety of Nooh (Curing Toxic Poison & Infections)', ur: 'سلامتیِ حضرت نوح علیہ السلام (ہر قسم کے زہر، وبائی امراض اور انفیکشن کا علاج)' },
    arabic: 'سَلَامٌ عَلَىٰ نُوحٍ فِي الْعَالَمِينَ',
    urdu: 'تمام جہانوں میں نوح پر سلام ہو۔',
    english: '"Peace upon Noah among the worlds."',
    quranReference: { en: 'Surah As-Saffat (37:79)', ur: 'سورۃ الصافات (آیت ۷۹)' },
    hadithReference: { 
      en: 'Cures internal blood toxicity, viral infections, and food poisoning. Recite 111 times.', 
      ur: 'فوڈ پوائزننگ، پیٹ کے وبائی امراض، جگر اور خون میں موجود زہریلے مادوں کے خاتمے کے لیے مجرب ہے۔ ۱۱۱ مرتبہ تلاوت فرمائیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-29',
    title: { en: 'Surah As-Saffat Safety of Ibrahim (Curing Burns, Heat & Inflammation)', ur: 'سلامتیِ حضرت ابراہیم علیہ السلام (تیز بخار، جلن اور گرمی دانوں کا روحانی علاج)' },
    arabic: 'سَلَامٌ عَلَىٰ إِبْرَاهِيمَ',
    urdu: 'ابراہیم پر سلام ہو۔',
    english: '"Peace upon Abraham."',
    quranReference: { en: 'Surah As-Saffat (37:109)', ur: 'سورۃ الصافات (آیت ۱۰۹)' },
    hadithReference: { 
      en: 'Heals severe burns, reduces intense body temperature, and calms high fever. Recite 111 times.', 
      ur: 'سخت جلن، تیز بخار، سن اسٹروک (لو لگنا)، اور جلنے کے زخموں کو ٹھنڈا کرنے کے لیے بہترین دم ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-30',
    title: { en: 'Surah As-Saffat Safety of Moses (Healing Bones & Muscle Damage)', ur: 'سلامتیِ حضرت موسیٰ و ہارون (ہڈیوں، جوڑوں اور پٹھوں کی کمزوری کا علاج)' },
    arabic: 'سَلَامٌ عَلَىٰ مُوسَىٰ وَهَارُونَ',
    urdu: 'موسیٰ اور ہارون پر سلام ہو۔',
    english: '"Peace upon Moses and Aaron."',
    quranReference: { en: 'Surah As-Saffat (37:120)', ur: 'سورۃ الصافات (آیت ۱۲۰)' },
    hadithReference: { 
      en: 'For fractures, arthritis, muscular pain, and physical strength. Recite 111 times.', 
      ur: 'ہڈیوں کے ٹوٹنے، جوڑوں کے درد، مہروں کی تکلیف اور پٹھوں کے کچھاؤ سے نجات کے لیے پڑھ کر مالش کریں۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-31',
    title: { en: 'Surah As-Saffat Safety of Ilyas (Curing Lungs & Respiratory Issues)', ur: 'سلامتیِ حضرت الیاس علیہ السلام (دمہ، پھیپھڑوں اور سانس کی تکلیف کا علاج)' },
    arabic: 'سَلَامٌ عَلَىٰ إِلْ يَاسِينَ',
    urdu: 'الیاس (اور ان کے پیروکاروں) پر سلام ہو۔',
    english: '"Peace upon Elias."',
    quranReference: { en: 'Surah As-Saffat (37:130)', ur: 'سورۃ الصافات (آیت ۱۳۰)' },
    hadithReference: { 
      en: 'Cures asthma, bronchitis, severe cough, and respiratory tract infections. Recite 111 times.', 
      ur: 'دمہ (Asthma)، شدید کھانسی، ٹی بی، پھیپھڑوں کے انفیکشن اور سانس پھولنے کی بیماری سے نجات کے لیے اکسیر ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-32',
    title: { en: 'Surah Az-Zumar Trust Verse (Curing High Blood Pressure & Arteries)', ur: 'سورۃ الزمر (ہائی بلڈ پریشر، کولیسٹرول اور دل کی بندش کا علاج)' },
    arabic: 'قُلْ أَفَرَأَيْتُم مَّا تَدْعُونَ مِن دُونِ اللَّهِ إِنْ أَرَادَنِيَ اللَّهُ بِضُرٍّ هَلْ هُنَّ كَاشِفَاتُ ضُرِّهِ أَوْ أَرَادَنِي بِرَحْمَةٍ هَلْ هُنَّ مُمْسِكَاتُ رَحْمَتِهِ ۚ قُلْ حَسْبِيَ اللَّهُ ۖ عَلَيْهِ يَتَوَكَّلُ الْمُتَوَكِّلُونَ',
    urdu: 'آپ فرما دیجیے: بھلا تم یہ بتاؤ کہ جن کو تم اللہ کے سوا پکارتے ہو، اگر اللہ مجھے کوئی تکلیف پہنچانا چاہے تو کیا وہ اس کی دی ہوئی تکلیف کو دور کر سکتی ہیں؟ یا اگر وہ مجھ پر مہربانی فرمانا چاہے تو کیا وہ اس کی رحمت کو روک سکتی ہیں؟ کہہ دیجیے کہ مجھے اللہ کافی ہے، توکل کرنے والے اسی پر توکل کرتے ہیں۔',
    english: 'Say, "Then have you considered what you invoke besides Allah? If Allah intended me harm, are they removers of His harm; or if He intended me mercy, are they withholders of His mercy?" Say, "Sufficient for me is Allah; upon Him [alone] rely the reliant."',
    quranReference: { en: 'Surah Az-Zumar (39:38)', ur: 'سورۃ الزمر (آیت ۳۸)' },
    hadithReference: { 
      en: 'Heals cardiovascular systems, calms vascular stress, and restores blood pressure balance. Recite 111 times.', 
      ur: 'کولیسٹرول، شریانوں کی بندش، دل کی دھڑکن کا بے ترتیب ہونا اور ہائی بلڈ پریشر کے علاج کے لیے مفید ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-33',
    title: { en: 'Surah Ghafir Surrender Verse (Overcoming Severe Panic Attacks)', ur: 'سپردگیِ امور (خوف، بے چینی، گھبراہٹ اور بلیک میلنگ کا علاج)' },
    arabic: 'وَأُفَوِّضُ أَمْرِي إِلَى اللَّهِ ۚ إِنَّ اللَّهَ بَصِيرٌ بِالْعِبَادِ',
    urdu: 'اور میں اپنا معاملہ اللہ کے سپرد کرتا ہوں، یقیناً اللہ بندوں کو خوب دیکھنے والا ہے۔',
    english: '"And I entrust my affair to Allah. Indeed, Allah is Seeing of [His] servants."',
    quranReference: { en: 'Surah Ghafir (40:44)', ur: 'سورۃ الغافر (آیت ۴۴)' },
    hadithReference: { 
      en: 'Eliminates acute anxiety, panic attacks, dread, and social phobia. Recite 111 times.', 
      ur: 'گھبراہٹ، وہم، شدید ترین گھٹن، خوف، اور بلیک میلنگ یا بلاوجہ خوف و ہراس کی بیماری کا بہترین قرآنی دم ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-34',
    title: { en: 'Surah Fussilat Healing Verse (Complete Guidance & Inner Cure)', ur: 'سورۃ فصلت (کینسر، رسولی اور پرانی بیماریوں کا علاج)' },
    arabic: 'قُلْ هُوَ لِلَّذِينَ آمَنُوا هُدًى وَشِفَاءٌ',
    urdu: 'آپ کہہ دیجیے کہ یہ (قرآن) ایمان والوں کے لیے سراسر ہدایت اور شفاء ہے۔',
    english: 'Say, "It is, for those who believe, a guidance and cure."',
    quranReference: { en: 'Surah Fussilat (41:44)', ur: 'سورۃ فصلت (آیت ۴۴)' },
    hadithReference: { 
      en: 'Fights malignant cells, tumors, cysts, and internal systemic weaknesses. Recite 111 times.', 
      ur: 'کینسر کے خلیات، رسولی، گلٹیاں، اور جسم کے بگڑے ہوئے نظامِ صحت کو بحال کرنے کے لیے روزانہ دم کریں۔ ۱۱۱ مرتبہ تلاوت فرمائیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-35',
    title: { en: 'Surah Al-Hashr Mountain Verse (Severe Migraine & Headache Cure)', ur: 'سورۃ الحشر (شدید ترین دردِ سر، آدھے سر کا درد اور دردِ شقیقہ)' },
    arabic: 'لَوْ أَنزَلْنَا هَٰذَا الْقُرْآنَ عَلَىٰ جَبَلٍ لَّرَأَيْتَهُ خَاشِعًا مُّتَصَدِّعًا مِّنْ خَشْيَةِ اللَّهِ ۚ وَتِلْكَ الْأَمْثَالُ نَضْرِبُهَا لِلنَّاسِ لَعَلَّهُمْ يَتَفَكَّرُونَ',
    urdu: 'اگر ہم یہ قرآن کسی پہاڑ پر نازل کرتے تو آپ اسے دیکھتے کہ وہ اللہ کے خوف سے جھک جاتا اور پھٹ کر ریزہ ریزہ ہو جاتا، اور ہم یہ مثالیں لوگوں کے لیے بیان کرتے ہیں تاکہ وہ غور و فکر کریں۔',
    english: 'If We had sent down this Quran upon a mountain, you would have seen it humbled and coming apart from fear of Allah. And these examples We present to the people that perhaps they will give thought.',
    quranReference: { en: 'Surah Al-Hashr (59:21)', ur: 'سورۃ الحشر (آیت ۲۱)' },
    hadithReference: { 
      en: 'Cures high-intensity migraines, persistent headaches, and sinus pressure. Recite 111 times.', 
      ur: 'دردِ شقیقہ (آدھے سر کا درد)، پرانا نزلہ، زکام، ہڈیوں کے درد اور سر کے شدید درد کا تکیہِ شفا ہے۔ ۱۱۱ مرتبہ پڑھ کر دم کریں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-36',
    title: { en: 'Surah Al-Hashr Divine Names (Immunity Boost & Cell Healing)', ur: 'اسماءِ الہیہ الحشر (قوتِ مدافعت، برکتِ صحت اور اعصابی قوت)' },
    arabic: 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّمَّادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ ۝ هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ ۚ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ ۝ هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ',
    urdu: 'وہی اللہ ہے جس کے سوا کوئی معبود نہیں، چھپے اور کھلے کا جاننے والا، وہی نہایت مہربان بہت رحم کرنے والا ہے۔ وہی اللہ ہے جس کے سوا کوئی معبود نہیں، بادشاہ، نہایت پاک، سلامتی دینے والا، امن دینے والا، نگہبان، غلبے والا، زبردست، بڑائی والا، اللہ پاک ہے اس شرک سے جو وہ کرتے ہیں۔ وہی اللہ ہے پیدا کرنے والا، ٹھیک بنانے والا، صورت دینے والا، اسی کے سب اچھے نام ہیں، زمین اور آسمان کی ہر چیز اسی کی تسبیح کرتی ہے، اور وہی غالب حکمت والا ہے۔',
    english: 'He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful... [He is] Creator, Inventor, Fashioner; to Him belong the best names. Whatever is in the heavens and earth is exalting Him. And He is the Exalted in Might, the Wise.',
    quranReference: { en: 'Surah Al-Hashr (59:22-24)', ur: 'سورۃ الحشر (آیات ۲۲-۲۴)' },
    hadithReference: { 
      en: 'Increases natural physical immunity, heals neurological deficits, and blesses health. Recite 111 times.', 
      ur: 'قوتِ مدافعت بڑھانے، اعصابی فالج کا علاج کرنے اور جسمانی اعضاء کی کارکردگی بہتر بنانے کے لیے روزانہ پڑھیں۔ ۱۱۱ مرتبہ تلاوت کریں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-37',
    title: { en: 'Surah Al-Qalam Eye Shield (Curing Severe Evil Eye/Nazar)', ur: 'سورۃ القلم (نظرِ بد، حاسدین کے حسد اور اچانک بیماری کا علاج)' },
    arabic: 'وَإِن يَكَادُ الَّذِينَ كَفَرُوا لَيُزْلِقُونَكَ بِأَبْصَارِهِمْ لَمَّا سَمِعُوا الذِّكْرَ وَيَقُولُونَ إِنَّهُ لَمَجْنُونٌ ۝ وَمَا هُوَ إِلَّا ذِكْرٌ لِّلْعَالَمِينَ',
    urdu: 'اور بیشک کافر جب یہ نصیحت (قرآن) سنتے ہیں تو ایسے لگتا ہے کہ وہ آپ کو اپنی تیز نگاہوں سے پھسلا دیں گے، اور کہتے ہیں کہ یہ تو دیوانہ ہے۔ حالانکہ یہ تو تمام جہانوں کے لیے نصیحت ہے۔',
    english: 'And indeed, those who disbelieve would almost make you slip with their eyes when they hear the message, and they say, "Indeed, he is mad." But it is not except a reminder to the worlds.',
    quranReference: { en: 'Surah Al-Qalam (68:51-52)', ur: 'سورۃ القلم (آیات ۵۱-۵۲)' },
    hadithReference: { 
      en: 'Cures children who cry excessively and relieves sudden business failure or sickness. Recite 111 times.', 
      ur: 'شدید نظرِ بد، بچوں کا بل وجہ رونا، بنا کسی مرض کے جسمانی ٹوٹ پھوٹ اور کاروبار کی بندش کا مجرب علاج ہے۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'protection'
  },
  {
    id: 'shifa-38',
    title: { en: 'Surah Al-Mulk Grace Verse (Curing Neurological Diseases)', ur: 'سورۃ الملک (اعصاب، دماغی امراض اور وسوسوں کا روحانی علاج)' },
    arabic: 'أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ',
    urdu: 'بھلا کیا وہ نہیں جانے گا جس نے پیدا کیا؟ حالانکہ وہ نہایت باریک بین، خوب باخبر ہے۔',
    english: 'Does He not know who He created, while He is the Subtle, the Acquainted?',
    quranReference: { en: 'Surah Al-Mulk (67:14)', ur: 'سورۃ الملک (آیت ۱۴)' },
    hadithReference: { 
      en: 'Heals neurological disorders, epilepsy, ADHD, and brings ultimate brain clarity. Recite 111 times.', 
      ur: 'مرگی، یادداشت کی کمزوری، لقوہ، رعشہ اور بچوں کے ذہنی مسائل کے حل کے لیے کثرت سے تلاوت فرمائیں۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-39',
    title: { en: 'Surah Al-Ikhlas (Spiritual Immunity & Divine Shield)', ur: 'سورۃ الاخلاص (ایمان کی حفاظت، دلی عافیت اور روحانی قوت)' },
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    urdu: 'آپ کہہ دیجیے کہ وہ اللہ ایک ہے۔ اللہ بے نیاز ہے۔ نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے۔ اور اس کا کوئی ہمسر نہیں ہے۔',
    english: 'Say, "He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent."',
    quranReference: { en: 'Surah Al-Ikhlas (112:1-4)', ur: 'سورۃ الاخلاص (آیات ۱-۴)' },
    hadithReference: { 
      en: 'Equivalent to one-third of the Quran. Cures spiritual stagnation and brings immunity. Recite 111 times.', 
      ur: 'رسول اللہ ﷺ نے فرمایا کہ سورۃ الاخلاص تہائی قرآن کے برابر ہے۔ برکتِ صحت اور روحانی حفاظت کے لیے ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'surah'
  },
  {
    id: 'shifa-40',
    title: { en: 'Prophetic Sunnah Protection Prayer (Deflecting Physical & Spiritual Evil)', ur: 'صبح و شام کی مسنون دعا (ہر قسم کے شر، نظر اور بیماری سے عافیت)' },
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ ۖ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    urdu: 'اللہ کے نام سے جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہ سب کچھ سننے والا اور خوب جاننے والا ہے۔',
    english: 'In the name of Allah, with Whose name nothing can cause harm in the earth nor in the heaven, and He is the All-Hearing, the All-Knowing.',
    quranReference: { en: 'Islamic Adhkar Protection Series', ur: 'صبح و شام کے مسنون اذکار' },
    hadithReference: { 
      en: 'Protects from unexpected calamities, poison, scorpion bites, and paralysis. Recite 111 times.', 
      ur: 'رسول اللہ ﷺ نے فرمایا: جو صبح و شام اس دعا کو پڑھے گا اسے کوئی ناگہانی آفت یا بیماری نقصان نہیں پہنچا سکے گی۔ ۱۱۱ مرتبہ پڑھیں۔' 
    },
    category: 'adhkar'
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
            Official Web: https://hasnain-foundation-com.ai.studio
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
        ctx.fillText('Official Portal: https://hasnain-foundation-com.ai.studio', canvas.width / 2, 1505);

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

        {/* General Permission Announcement Banner */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/80 border border-amber-500/20 text-center relative overflow-hidden shadow-xl shadow-emerald-950/30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`text-sm sm:text-base font-black text-amber-300 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'عام اجازت اور وظیفہ کی تعداد' : 'General Permission & Recitation Count'}
                </h4>
                <p className={`text-xs text-slate-400 mt-1 leading-relaxed ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu 
                    ? 'تمام قرآنی آیات اور دعاؤں کی تلاوت کی ہر خاص و عام کو عام اجازت ہے۔ روحانی شفاء کے لیے ہر وظیفہ ۱۱۱ مرتبہ پڑھنا مجرب ہے۔' 
                    : 'Everyone has general spiritual permission to recite these verses. Reciting each item 111 times is recommended for spiritual healing.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
                {isUrdu ? 'تعداد: ۱۱۱ مرتبہ' : 'Count: 111 Times'}
              </span>
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                {isUrdu ? 'پڑھنے کی عام اجازت ہے' : 'Permission for Everyone'}
              </span>
            </div>
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
                    
                    <span className="text-[10px] sm:text-xs text-amber-400 font-mono px-2.5 py-1 rounded bg-amber-500/5 border border-amber-500/15 shrink-0">
                      {isUrdu ? topic.quranReference.ur : topic.quranReference.en}
                    </span>
                  </div>

                  {/* Recitation Count & General Permission Badges */}
                  <div className="flex flex-wrap gap-2 mb-4 -mt-2">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {isUrdu ? 'تعداد: ۱۱۱ مرتبہ' : 'Count: 111 Times'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {isUrdu ? 'پڑھنے کی عام اجازت ہے' : 'General Permission'}
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
        <div className="mt-16 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/15 text-center max-w-3xl mx-auto space-y-3">
          <p className={`text-xs text-amber-400 font-bold tracking-wide uppercase ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu ? 'عمومی اجازت نامہ برائے تلاوت' : 'General Recitation Permission & Recitation Count'}
          </p>
          <p className={`text-xs text-amber-400/90 leading-relaxed ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu 
              ? 'ضروری نوٹ: تمام احباب کو ان تمام ۴۰ قرآنی آیات اور دعاؤں کو ۱۱۱ مرتبہ پڑھنے کی عام اجازت ہے۔ ہمارا پختہ یقین ہے کہ شفاء دینے والی واحد ذات اللہ تبارک و تعالیٰ کی ہے۔ اس روحانی مواد کو تمام روحانی و جسمانی امراض کی شفاء کے لیے پڑھا جا سکتا ہے۔'
              : 'Important Note: General permission is granted to everyone to recite these 40 Quranic verses and spiritual healing prayers 111 times. We firmly believe that ultimate healing comes only by the Will and Mercy of Allah.'}
          </p>
        </div>

      </div>
    </div>
  );
}
