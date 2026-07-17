import React, { useState } from 'react';
import { SUCCESS_STORIES } from '../data';
import { SuccessStory, Language } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Languages, 
  Plus, 
  Heart, 
  User, 
  Quote, 
  BookOpen, 
  RefreshCw, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SuccessStoriesProps {
  lang: Language;
}

export default function SuccessStories({ lang }: SuccessStoriesProps) {
  const isUrdu = lang === 'ur';

  // State management
  const [stories, setStories] = useState<SuccessStory[]>(SUCCESS_STORIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Custom Story Generator Form State
  const [genCategory, setGenCategory] = useState('Food Relief & Distribution');
  const [genTone, setGenTone] = useState('Inspirational');
  const [showGenModal, setShowGenModal] = useState(false);
  
  // Custom Testimonial Submission State
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customProject, setCustomProject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [customLang, setCustomLang] = useState<Language>('en');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  // Status logs
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeStory = stories[currentIndex] || stories[0];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
  };

  // 1. Dynamic Translation using Gemini API
  const handleTranslateActiveStory = async () => {
    if (!activeStory) return;
    setIsTranslating(true);
    setErrorMessage(null);
    setStatusMessage(isUrdu ? "ترجمہ کیا جا رہا ہے..." : "Translating narrative...");

    try {
      const sourceText = isUrdu ? activeStory.story.ur : activeStory.story.en;
      const targetLanguage = isUrdu ? "en" : "ur";

      const response = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, targetLang: targetLanguage })
      });

      const data = await response.json();
      if (data.success && data.translation) {
        // Update the story's translated content dynamically in state
        const updatedStories = stories.map((s, idx) => {
          if (idx === currentIndex) {
            return {
              ...s,
              story: {
                ...s.story,
                [targetLanguage]: data.translation
              }
            };
          }
          return s;
        });
        setStories(updatedStories);
        setStatusMessage(isUrdu ? "ترجمہ کامیابی سے مکمل ہو گیا!" : "Translated successfully!");
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        throw new Error(data.error || "Failed to translate");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(isUrdu ? "ترجمہ کرنے میں خرابی پیش آئی ہے۔" : `Translation failed: ${err.message}`);
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsTranslating(false);
    }
  };

  // 2. Generate New Inspirational Story using Gemini API
  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);
    setStatusMessage(isUrdu ? "نئی کہانی تیار کی جا رہی ہے..." : "Generating community story...");

    try {
      const response = await fetch('/api/gemini/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: genCategory, tone: genTone })
      });

      const data = await response.json();
      if (data.success && data.story) {
        const newStory: SuccessStory = {
          id: `ai-story-${Date.now()}`,
          title: {
            en: data.story.titleEn,
            ur: data.story.titleUr
          },
          beneficiaryName: data.story.beneficiaryName,
          project: {
            en: data.story.project,
            ur: data.story.project // Can be direct English/Urdu translation as returned
          },
          story: {
            en: data.story.storyEn,
            ur: data.story.storyUr
          },
          isAiGenerated: true
        };

        // Add story to list and jump to it
        setStories(prev => [newStory, ...prev]);
        setCurrentIndex(0);
        setShowGenModal(false);
        setStatusMessage(isUrdu ? "نئی کہانی کامیابی سے شامل ہو گئی!" : "Generated and added to your feed!");
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        throw new Error(data.error || "Failed to generate");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(isUrdu ? "کہانی تیار کرنے میں ناکامی" : `Generation failed: ${err.message}`);
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Translate and Submit Custom Testimonial using Gemini API
  const handleSubmitCustomStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customContent.trim() || !customName.trim()) return;

    setIsSubmittingCustom(true);
    setErrorMessage(null);
    setStatusMessage(isUrdu ? "ترجمہ اور فارمیٹنگ کی جا رہی ہے..." : "Translating and styling testimonial...");

    try {
      // Translate to the opposite language
      const targetLang: Language = customLang === 'en' ? 'ur' : 'en';
      const response = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: customContent, targetLang })
      });

      const data = await response.json();
      if (data.success && data.translation) {
        const newStory: SuccessStory = {
          id: `custom-story-${Date.now()}`,
          title: {
            en: customLang === 'en' ? "Community Voice" : "Communal Feedback",
            ur: customLang === 'ur' ? "کمیونٹی کا تاثر" : "ہمدردانہ رائے"
          },
          beneficiaryName: customName,
          project: {
            en: customProject || "General Welfare Feedback",
            ur: customProject || "عمومی فلاحی رائے"
          },
          story: {
            en: customLang === 'en' ? customContent : data.translation,
            ur: customLang === 'ur' ? customContent : data.translation
          },
          isAiGenerated: false
        };

        setStories(prev => [newStory, ...prev]);
        setCurrentIndex(0);
        setShowWriteModal(false);
        setCustomName('');
        setCustomProject('');
        setCustomContent('');
        setStatusMessage(isUrdu ? "آپ کا تاثر کامیابی سے اپلوڈ ہو گیا!" : "Your feedback has been translated and added!");
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        throw new Error(data.error || "Failed to translate feedback");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(isUrdu ? "رابطہ کرنے یا ترجمہ کرنے میں خرابی" : `Submission failed: ${err.message}`);
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  return (
    <section id="success-stories-section" className="py-20 bg-slate-50 relative overflow-hidden font-sans border-t border-slate-200">
      
      {/* Decorative ambient elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-50 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3 h-3 fill-emerald-800 text-emerald-800" />
            <span>{isUrdu ? 'کمیونٹی اثرات اور کہانیاں' : 'Community Impact & Voices'}</span>
          </span>
          <h2 className={`text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu ? 'کامیابی کی کہانیاں' : 'Success Stories & Testimonials'}
          </h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {isUrdu 
              ? 'حسنین فاؤنڈیشن کی جانب سے مستحقین کی بحالی، عطیات کی رسائی اور پائیدار فلاحی اقدامات کے حقیقی تاثرات اور ایمان افروز نتائج۔'
              : 'Real-life impact narratives and testimonials from beneficiaries, highlighting dignity, empowerment, and direct welfare delivery.'}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 sm:p-10 mb-8 overflow-hidden min-h-[380px] flex flex-col justify-between">
          <Quote className={`absolute top-6 ${isUrdu ? 'left-6' : 'right-6'} w-14 h-14 text-emerald-500/10 rotate-180 pointer-events-none`} />

          <AnimatePresence mode="wait">
            {activeStory && (
              <motion.div
                key={activeStory.id}
                initial={{ opacity: 0, x: isUrdu ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isUrdu ? 15 : -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 flex-grow flex flex-col justify-between"
              >
                <div>
                  {/* Category & Project Tag Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase font-mono">
                      {isUrdu ? activeStory.project.ur : activeStory.project.en}
                    </span>
                    {activeStory.isAiGenerated && (
                      <span className="inline-flex items-center gap-1 text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600 animate-pulse" />
                        <span>{isUrdu ? 'اے آئی کے ذریعے تالیف شدہ' : 'AI Inspired Narrative'}</span>
                      </span>
                    )}
                  </div>

                  {/* Testimonial Title */}
                  <h3 className={`text-lg sm:text-xl font-bold text-slate-900 mb-4 ${isUrdu ? 'font-urdu leading-relaxed' : 'leading-snug'}`}>
                    {isUrdu ? activeStory.title.ur : activeStory.title.en}
                  </h3>

                  {/* Testimonial Core Body */}
                  <p className={`text-slate-600 text-sm sm:text-base leading-relaxed ${isUrdu ? 'font-urdu leading-loose text-right' : 'text-left'}`}>
                    {isUrdu ? activeStory.story.ur : activeStory.story.en}
                  </p>
                </div>

                {/* Beneficiary Details & Action Row */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">{activeStory.beneficiaryName}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {isUrdu ? 'مستفید ہونے والا خاندان' : 'Verified Beneficiary Family'}
                      </p>
                    </div>
                  </div>

                  {/* Translation Action Trigger */}
                  <button
                    onClick={handleTranslateActiveStory}
                    disabled={isTranslating}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {isTranslating ? (
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
                    ) : (
                      <Languages className="w-3.5 h-3.5 text-emerald-700" />
                    )}
                    <span>
                      {isUrdu 
                        ? (isTranslating ? 'ترجمہ ہو رہا ہے...' : 'انگریزی میں ترجمہ دیکھیں (Gemini AI)')
                        : (isTranslating ? 'Translating...' : 'Translate to Urdu (Gemini AI)')}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slider controls */}
          <div className="flex items-center justify-between mt-8 border-t border-slate-100 pt-4">
            <div className="text-xs text-slate-400 font-mono">
              {currentIndex + 1} / {stories.length}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                title={isUrdu ? 'پچھلی کہانی' : 'Previous'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                title={isUrdu ? 'اگلی کہانی' : 'Next'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic System Notices / Alerts */}
        {statusMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Action Trays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Action Card 1: AI Story Generator */}
          <button
            onClick={() => setShowGenModal(true)}
            className="p-4 bg-white border border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl hover:bg-slate-50 text-left transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-5 h-5 text-slate-900" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-800 group-hover:text-emerald-800 transition-colors">
                  {isUrdu ? 'اے آئی کہانی جنریٹر' : 'AI Narrative Generator'}
                </h4>
                <p className="text-xs text-slate-400 leading-normal">
                  {isUrdu 
                    ? 'منصوبے کی بنیاد پر لائیو ایمان افروز کہانی تالیف کریں۔'
                    : 'Generate inspirational welfare narratives with Gemini.'}
                </p>
              </div>
            </div>
          </button>

          {/* Action Card 2: Write Custom Testimonial */}
          <button
            onClick={() => setShowWriteModal(true)}
            className="p-4 bg-white border border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl hover:bg-slate-50 text-left transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform shrink-0">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-800 group-hover:text-emerald-800 transition-colors">
                  {isUrdu ? 'اپنا تاثر درج کریں' : 'Share Your Testimonial'}
                </h4>
                <p className="text-xs text-slate-400 leading-normal">
                  {isUrdu 
                    ? 'تاثرات لکھیں اور اسے انگریزی/اردو میں خودکار ترجمہ کریں۔'
                    : 'Draft custom feedback and translate bilingual instantly.'}
                </p>
              </div>
            </div>
          </button>

        </div>

      </div>

      {/* MODAL 1: AI STORY GENERATOR FORM */}
      <AnimatePresence>
        {showGenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            >
              <h3 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{isUrdu ? 'اے آئی کہانی جنریٹر' : 'AI Inspirational Generator'}</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {isUrdu 
                  ? 'رابطہ زمرہ اور لہجہ منتخب کریں تاکہ حسنین فاؤنڈیشن کے منصوبوں کی روشنی میں ایک خوبصورت لائیو کہانی تیار کی جا سکے۔'
                  : 'Specify the welfare sector and narrative tone. Gemini will synthesize a respectful bilingual story highlighting local Karachi impact.'}
              </p>

              <form onSubmit={handleGenerateStory} className="space-y-4 text-left">
                {/* Category Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isUrdu ? 'منصوبہ زمرہ:' : 'Welfare Project Category:'}
                  </label>
                  <select
                    value={genCategory}
                    onChange={(e) => setGenCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Daily Food Drive & Ration Distribution">Daily Food Drive (راشن تقسیم)</option>
                    <option value="Clean Drinking RO Water Filtration Plant">RO Water Filtration Plants (آر او فلٹریشن پلانٹ)</option>
                    <option value="Orphan Education Sponsorship & Supplies">Orphan & School Support (یتیموں کی تعلیم)</option>
                    <option value="Jamia Masjid Abdul Qadir Jilani Construction">Mosque Infrastructure & Construction (تعمیرِ مسجد)</option>
                    <option value="Emergency Welfare Medical & Financial Aid">Medical & Emergency Aid (طبی و مالی امداد)</option>
                  </select>
                </div>

                {/* Tone Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isUrdu ? 'لہجہ و جذبہ:' : 'Narrative Tone / Emotion:'}
                  </label>
                  <select
                    value={genTone}
                    onChange={(e) => setGenTone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Inspirational and empowering">Inspirational (ایمان افروز)</option>
                    <option value="Heartwarming and deep gratitude">Heartwarming Gratitude (شکر گزاری سے لبریز)</option>
                    <option value="Resilience and community bonding">Community Resilience (ثابت قدمی اور عزم)</option>
                    <option value="Spiritual and faith-focused">Spiritual Focus (روحانی و مذہبی اصلاح)</option>
                  </select>
                </div>

                {/* Submit button */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGenModal(false)}
                    className="w-1/2 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-1/2 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{isUrdu ? 'تیار ہو رہا ہے...' : 'Synthesizing...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isUrdu ? 'کہانی تیار کریں' : 'Generate Narrative'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: WRITE TESTIMONIAL FORM */}
      <AnimatePresence>
        {showWriteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left"
            >
              <h3 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>{isUrdu ? 'اپنا تاثر یا گواہی شیئر کریں' : 'Share Custom Testimonial'}</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {isUrdu 
                  ? 'اپنی گواہی لکھیں۔ ہمارا سسٹم خود کار طریقے سے Gemini AI کا استعمال کر کے اس کا متبادل زبان میں ترجمہ کرے گا اور لائیو لسٹ میں شامل کرے گا۔'
                  : 'Write your testimonial. Our system will use Gemini AI to automatically translate and add a bilingual version directly into the carousel.'}
              </p>

              <form onSubmit={handleSubmitCustomStory} className="space-y-4">
                {/* Source Language selection */}
                <div className="flex gap-4">
                  <span className="text-xs font-bold text-slate-700 self-center">
                    {isUrdu ? 'لکھنے کی زبان:' : 'Writing Language:'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomLang('en')}
                      className={`px-3 py-1 text-xs rounded-md font-bold cursor-pointer transition-colors ${customLang === 'en' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomLang('ur')}
                      className={`px-3 py-1 text-xs rounded-md font-bold cursor-pointer transition-colors ${customLang === 'ur' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      اردو
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isUrdu ? 'آپ کا نام اور رہائشی علاقہ:' : 'Your Name & Location (e.g., Haris - Surjani Town):'}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    placeholder={customLang === 'ur' ? 'مثال: محمد ساجد، سرجانی ٹاؤن' : 'e.g. Sajid Khan, Surjani Town'}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Project Context */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isUrdu ? 'منصوبہ جس سے آپ نے فائدہ حاصل کیا:' : 'Welfare Project/Service used:'}
                  </label>
                  <input
                    type="text"
                    value={customProject}
                    onChange={(e) => setCustomProject(e.target.value)}
                    placeholder={customLang === 'ur' ? 'مثال: راشن تقسیم، فلٹریشن پلانٹ' : 'e.g. RO Filtered Water, Ramadan Ration'}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isUrdu ? 'آپ کے تاثرات:' : 'Your Testimonial Content:'}
                  </label>
                  <textarea
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    required
                    rows={4}
                    placeholder={customLang === 'ur' ? 'اپنے مخلصانہ احساسات درج کریں...' : 'Enter your sincere thoughts and experience...'}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Submit buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWriteModal(false)}
                    className="w-1/2 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCustom}
                    className="w-1/2 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingCustom ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{isUrdu ? 'جمع ہو رہا ہے...' : 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <Languages className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{isUrdu ? 'ترجمہ اور جمع کریں' : 'Translate & Submit'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
