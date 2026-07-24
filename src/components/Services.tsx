/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, Service } from '../types';
import { DICTIONARY, SERVICES_DATA } from '../data';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesProps {
  lang: Language;
  onOpenSpiritual?: () => void;
  onNavigateDonate?: () => void;
}

// Map strings to Lucide components safely
function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'Soup': return Icons.Soup;
    case 'HandCoins': return Icons.HandCoins;
    case 'GraduationCap': return Icons.GraduationCap;
    case 'HeartHandshake': return Icons.HeartHandshake;
    case 'Church': return Icons.Home; // Elegant Mosque building representation fallback
    case 'Users': return Icons.Users;
    case 'HeartPulse': return Icons.HeartPulse;
    case 'Megaphone': return Icons.Megaphone;
    case 'Sparkles': return Icons.Sparkles;
    default: return Icons.Heart;
  }
}

// Comprehensive details map for each service
const SERVICE_DETAILS: Record<string, { en: { highlights: string[]; process: string; impact: string }; ur: { highlights: string[]; process: string; impact: string } }> = {
  'food-dist': {
    en: {
      highlights: [
        "Daily cooked Dastarkhwan for 1,000+ needy workers and daily wagers",
        "Monthly dry ration packages (Atta, Rice, Ghee, Sugar, Pulses, Tea)",
        "Special Ramadan Ration Drives & Sehri/Iftar distributions",
        "Emergency food supply packs for flood and disaster victims"
      ],
      process: "Families are registered after verification by field volunteers. Ration bags are distributed monthly with complete respect and privacy.",
      impact: "Over 50,000 families fed annually across Karachi slum settlements."
    },
    ur: {
      highlights: [
        "روزانہ ۱۰۰۰+ مستحقین اور دیہاڑی دار مزدوروں کے لیے دسترخوان",
        "ماہانہ خشک راشن پیکیج (آٹا، چاول، گھی، چینی، دالیں، پتی)",
        "خصوصی رمضان راشن ڈرائیو اور سحری و افطاری کا اہتمام",
        "سیلاب و ناگہانی آفات کے متاثرین کے لیے ایمرجنسی فوڈ پیکس"
      ],
      process: "فیلڈ رضاکاروں کی تصدیق کے بعد مستحق خاندانوں کو مکمل عزت و احترام کے ساتھ راشن کی فراہمی۔",
      impact: "سالانہ ۵۰,۰۰۰ سے زائد خاندانوں کی راشن اور کھانے سے کفالت۔"
    }
  },
  'fin-assist': {
    en: {
      highlights: [
        "Monthly cash stipends for registered widows and elderly",
        "Emergency rent and electricity bill clearance assistance",
        "Self-reliance micro-grants for small pushcart vendors",
        "Medical bill and emergency surgery financial support"
      ],
      process: "Requests are reviewed confidentially by our welfare committee to ensure Zakat and Sadaqah reach the most deserving.",
      impact: "Hundreds of families saved from eviction and extreme poverty every year."
    },
    ur: {
      highlights: [
        "بیواؤں اور معذور افراد کے لیے ماہانہ نقد الائونس",
        "گھر کے کرائے اور بجلی کے بلوں کی ادائیگی میں ہنگامی مدد",
        "چھوٹے کاروبار اور ریڑھی بانوں کے لیے روزگار اسکیم",
        "علاج و معالجے اور آپریشنز کے اخراجات کی ادائیگی"
      ],
      process: "زکوۃ و صدقات کا مستحقین تک پہنچنا یقینی بنانے کے لیے ہر درخواست کا رازداری سے جائزہ لیا جاتا ہے۔",
      impact: "سیکنڑوں خاندان بے گھر ہونے اور شدید معاشی بحران سے محفوظ۔"
    }
  },
  'edu-support': {
    en: {
      highlights: [
        "Full school tuition fees coverage for orphan and destitute kids",
        "Free uniforms, bags, shoes, and complete curriculum books",
        "After-school free coaching centers & Quranic studies",
        "Higher education scholarship program for meritorious youth"
      ],
      process: "We partner with local schools and Islamic institutions to sponsor students directly.",
      impact: "500+ children kept off street labor and enrolled in schools."
    },
    ur: {
      highlights: [
        "یتیم اور غریب بچوں کی اسکول فیسوں کی ۱۰۰٪ ادائیگی",
        "مفت یونیفارم، اسکول بیگز، جوتے اور درسی کتب کی تقسیم",
        "مفت افٹر اسکول ٹیوشن اور مذہبی تعلیم کے مراکز",
        "ذہین طلباء کے لیے اعلیٰ تعلیمی اسکالرشپ اسکیم"
      ],
      process: "اسکولوں اور دینی مدارس کے ساتھ اشتراک سے بچوں کو براہِ راست تعلیمی سرپرستی فراہم کی جاتی ہے۔",
      impact: "۵۰۰ سے زائد بچے چائلڈ لیبر سے نکل کر زیورِ تعلیم سے آراستہ۔"
    }
  },
  'rel-programs': {
    en: {
      highlights: [
        "Weekly Dars-e-Quran and Sunnah learning circles",
        "Grand Mehfil-e-Naat and Seerah-un-Nabi (PBUH) conferences",
        "Tajweed & Quran Hifz classes for kids and adults",
        "Youth moral character-building workshops"
      ],
      process: "Open to all brothers and sisters with dedicated arrangements and online streaming.",
      impact: "Thousands spiritually connected to authentic Sunnah and Islamic teachings."
    },
    ur: {
      highlights: [
        "ہفتہ وار درسِ قرآن و سنت کے روح پرور اجتماعات",
        "عظیم الشان محافلِ نعت و سیرت النبی ﷺ کانفرنسز",
        "بچوں اور بڑوں کے لیے تجوید و حفظِ قرآن کی کلاسز",
        "نوجوانوں کے لیے اخلاقی و تربیتی ورکشاپس"
      ],
      process: "تمام اسلامی بہنوں اور بھائیوں کے لیے باوقار اور علیحدہ انتظامات۔",
      impact: "ہزاروں قلوب و اذہان سیرتِ طیبہ کے نور سے منور۔"
    }
  },
  'mosque-dev': {
    en: {
      highlights: [
        "Construction of Jamia Masjid Abdul Qadir Jilani (Surjani Town)",
        "Solar power energy installation for uninterrupted lighting & fans",
        "Clean water filtration and modern Wudu (ablution) facility",
        "Free Islamic library and carpet replacement drives"
      ],
      process: "Managed transparently by civil engineers and Islamic scholars.",
      impact: "Providing a peaceful house of Allah for 1,500+ daily worshippers."
    },
    ur: {
      highlights: [
        "جامع مسجد عبدالقادر جیلانی (سرجانی ٹاؤن) کی تعمیر و توسیع",
        "بلا تعطل روشنی و پنکھوں کے لیے سولر پاور پلانٹ کی تنصیب",
        "جدید وضو خانہ اور پینے کے صاف پانی کا نظام",
        "مفت دینی کتب خانہ اور صفوں و قالینوں کی فراہمی"
      ],
      process: "ماہر سول انجینئرز اور علمائے کرام کی زیرِ نگرانی مکمل شفاف تعمیر۔",
      impact: "۱۵۰۰ سے زائد نمازیوں کے لیے باوقار عبادت گاہ کا قیام۔"
    }
  },
  'comm-welfare': {
    en: {
      highlights: [
        "Clean drinking water filtration plants in water-scarce areas",
        "Free medical diagnostic camps and medicine distribution",
        "Dowry & marriage support packages for poor daughters",
        "Wheelchair and handicap assistance gear distribution"
      ],
      process: "Community projects executed directly on ground with local elders.",
      impact: "Clean water and medical access provided to 20,000+ residents."
    },
    ur: {
      highlights: [
        "پانی کی قلت والے علاقوں میں واٹر فلٹریشن پلانٹس کا قیام",
        "مفت طبی معائنہ کیمپس اور مفت ادویات کی تقسیم",
        "مستحق والدین کی بیٹیوں کے لیے جہیز و شادی سپورٹ پیکیج",
        "معذور افراد کے لیے ویل چیئرز اور دیگر آلات کی فراہمی"
      ],
      process: "علاقائی معززین اور رضاکاروں کے ساتھ مل کر زمینی سطح پر فوری اقدامات۔",
      impact: "۲۰,۰۰۰ سے زائد شہریوں کو پینے کے صاف پانی اور طبی سہولیات کی فراہمی۔"
    }
  },
  'emerg-relief': {
    en: {
      highlights: [
        "Rapid response flood emergency rescue and ration packs",
        "Free ambulance coordination for critical patients",
        "Disaster shelter tents and warm blanket distribution",
        "Emergency medical first aid kit setups"
      ],
      process: "Emergency taskforce active 24/7 during natural calamities.",
      impact: "Immediate relief delivered within hours of urban or rural emergencies."
    },
    ur: {
      highlights: [
        "شہری سیلاب اور آفات میں فوری ایمرجنسی ریسکیو و راشن",
        "شدید مریضوں کے لیے ایمبولینس کی فوری فراہمی",
        "خیموں اور سردیوں میں گرم کمبلوں کی ہنگامی تقسیم",
        "ایمرجنسی فرسٹ ایڈ اور طبی امداد کی فراہمی"
      ],
      process: "ناگہانی آفات کے دوران ۲۴ گھنٹے متحرک ایمرجنسی ٹیم۔",
      impact: "کسی بھی آفت کے چند گھنٹوں کے اندر متاثرین تک امداد کی پہنچ۔"
    }
  }
};

export default function Services({ lang, onOpenSpiritual, onNavigateDonate }: ServicesProps) {
  const isUrdu = lang === 'ur';
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const openServiceModal = (service: Service) => {
    if ((service.id === 'spiritual-healing' || service.isPremium) && onOpenSpiritual) {
      onOpenSpiritual();
    } else {
      setSelectedService(service);
    }
  };

  return (
    <section id="services-section" className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm"
          >
            <Icons.HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'ہماری تمام فلاحی خدمات' : 'All Official Welfare Services'}
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
            {DICTIONARY.services.title[lang]}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-slate-600 text-sm sm:text-base mt-4 leading-relaxed ${
              isUrdu ? 'font-urdu leading-loose text-base' : 'font-sans'
            }`}
          >
            {isUrdu 
              ? "حسنین فاؤنڈیشن تمام انسانیت کے لیے بلا تفریقِ رنگ و نسل درج ذیل تمام ۷ بنیادی شعبہ جات میں شب و روز خدمات سرانجام دے رہی ہے۔ تفصیلات دیکھنے کے لیے کسی بھی خدمت پر کلک فرمائیں۔"
              : "Hasnain Foundation serves humanity across 7 primary welfare domains. Click on any service below to view comprehensive details, process, and impact."
            }
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_DATA.map((service, index) => {
            const IconComponent = getIconComponent(service.iconName);
            const isSpiritualCard = service.id === 'spiritual-healing' || service.isPremium;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openServiceModal(service)}
                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-xl ${
                  isSpiritualCard
                    ? 'border-amber-400 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 border-2 ring-1 ring-amber-300/40'
                    : 'border-slate-200 bg-white hover:border-emerald-600'
                } ${isUrdu ? 'text-right' : 'text-left'}`}
              >
                {/* Premium Card Special Badge */}
                {isSpiritualCard && (
                  <div className={`absolute top-4 ${isUrdu ? 'left-4' : 'right-4'}`}>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                      <Icons.Sparkles className="w-3 h-3 fill-slate-950" />
                      <span>{isUrdu ? 'مفت شرعی خدمت' : '100% Free Service'}</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Icon Emblem */}
                  <div className={`p-3.5 rounded-2xl w-13 h-13 flex items-center justify-center transition-all duration-300 mb-5 ${
                    isSpiritualCard
                      ? 'bg-amber-500 text-slate-950 shadow-md border border-amber-400 group-hover:scale-105'
                      : 'bg-emerald-50 border border-emerald-100 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700'
                  } ${isUrdu ? 'ml-auto' : ''}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg sm:text-xl font-black text-slate-900 leading-tight mb-2.5 transition-colors duration-150 ${
                    isSpiritualCard ? 'text-amber-950 group-hover:text-amber-800' : 'group-hover:text-emerald-800'
                  } ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {service.title[lang]}
                  </h3>

                  {/* Description */}
                  <p className={`text-slate-600 text-xs sm:text-sm leading-relaxed ${
                    isUrdu ? 'font-urdu leading-loose' : 'font-sans'
                  }`}>
                    {service.description[lang]}
                  </p>
                </div>

                {/* Card Footer Click Indicator */}
                <div className={`mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold ${
                  isSpiritualCard ? 'text-amber-800 border-amber-200/60' : 'text-emerald-700 group-hover:text-emerald-800'
                } ${isUrdu ? 'flex-row-reverse font-urdu' : 'font-sans'}`}>
                  <span className="flex items-center gap-1">
                    <Icons.Info className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'تفصیلات دیکھیں' : 'View Full Details'}</span>
                  </span>
                  <Icons.ArrowRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${isUrdu ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8 overflow-hidden ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <Icons.X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className={`flex items-center gap-4 mb-6 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  {React.createElement(getIconComponent(selectedService.iconName), { className: "w-8 h-8 text-emerald-700" })}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 inline-block mb-1">
                    {isUrdu ? 'شعبہ فلاح و بہبود' : 'Official Welfare Service'}
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-black text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {selectedService.title[lang]}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className={`text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 ${
                isUrdu ? 'font-urdu leading-loose' : 'font-sans'
              }`}>
                {selectedService.description[lang]}
              </p>

              {/* Specific Highlights list if available */}
              {SERVICE_DETAILS[selectedService.id] && (
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className={`text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 ${isUrdu ? 'font-urdu text-right' : 'font-sans'}`}>
                      {isUrdu ? 'اہم خصوصیات و عملی کارکردگی:' : 'Key Service Highlights & Delivery:'}
                    </h4>
                    <ul className="space-y-2">
                      {SERVICE_DETAILS[selectedService.id][lang].highlights.map((item, idx) => (
                        <li key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 ${isUrdu ? 'flex-row-reverse text-right font-urdu' : 'font-sans'}`}>
                          <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                      <span className={`text-xs font-bold text-emerald-900 block mb-1 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'طریقہ کار:' : 'Execution Method:'}
                      </span>
                      <p className={`text-xs text-emerald-800 leading-relaxed ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {SERVICE_DETAILS[selectedService.id][lang].process}
                      </p>
                    </div>

                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100">
                      <span className={`text-xs font-bold text-amber-900 block mb-1 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'عوامی اثرات:' : 'Annual Community Impact:'}
                      </span>
                      <p className={`text-xs text-amber-800 leading-relaxed ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {SERVICE_DETAILS[selectedService.id][lang].impact}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className={`mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3 ${
                isUrdu ? 'sm:flex-row-reverse' : ''
              }`}>
                {onNavigateDonate && (
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      onNavigateDonate();
                    }}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 px-5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-95"
                  >
                    <Icons.Heart className="w-4 h-4 text-white fill-current" />
                    <span>{isUrdu ? 'اس شعبے کے لیے عطیہ دیں' : 'Donate For This Service'}</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/923180202424?text=${encodeURIComponent(`Assalamu Alaikum! I want to inquire about your service: ${selectedService.title.en}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Icons.Phone className="w-4 h-4 text-emerald-400" />
                  <span>{isUrdu ? 'معلومات یا ہیلپ لائن' : 'Inquire on WhatsApp'}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

