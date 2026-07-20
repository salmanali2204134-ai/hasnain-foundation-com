/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Project, Event, GalleryItem, TransparencyReport, NewsArticle, SuccessStory, SocialPost } from './types';

// Import local images as ES modules for reliable bundling and display
import heroBgImg from './assets/images/hero_charity_mosque_1784223601396.jpg';
import masjidProjectImg from './assets/images/masjid_abdul_qadir_jilani_1784223622458.jpg';
import foodProjectImg from './assets/images/food_dist_children_1784344146034.jpg';
import educationProjectImg from './assets/images/school_children_1784344168521.jpg';
import communityProjectImg from './assets/images/orphanage_children_1784344188831.jpg';
import futureProjectImg from './assets/images/clinic_children_1784344209945.jpg';
import aboutVolunteersImg from './assets/images/about_volunteers_1784228540277.jpg';
import waterProjectImg from './assets/images/water_filtration_plant_1784481328361.jpg';

// Events and assemblies
import karbalaEventImg from './assets/images/karbala_conference_1784228487695.jpg';
import gatheringEventImg from './assets/images/mosque_gathering_1784228503408.jpg';
import naatEventImg from './assets/images/naat_gathering_1784228521736.jpg';
import welfareEventImg from './assets/images/emergency_relief_1784228465999.jpg';

// Additional on-ground welfare, education, and health images
import charityClinicImg from './assets/images/charity_clinic_1784228563831.jpg';
import communityWelfareImg from './assets/images/community_welfare_1784228447787.jpg';
import educationalSupportImg from './assets/images/educational_support_1784228429812.jpg';
import foodDistributionImg from './assets/images/food_distribution_1784228414416.jpg';

// Newly added Hazrat Sahib and foundation activity images
import ruhaniIlajHealingImg from './assets/images/ruhani_ilaj_healing_1784539076055.jpg';
import onlineIstikharaZoomImg from './assets/images/online_istikhara_zoom_1784539097542.jpg';
import massWeddingCharityImg from './assets/images/mass_wedding_charity_1784539112843.jpg';
import eidGiftsDistributionImg from './assets/images/eid_gifts_distribution_1784539132887.jpg';
import hazratSahibQuranClassImg from './assets/images/hazrat_sahib_quran_class_1784539149702.jpg';

export const IMAGES = {
  heroBg: heroBgImg,
  masjidProject: masjidProjectImg,
  foodProject: foodProjectImg,
  educationProject: educationProjectImg,
  communityProject: communityProjectImg,
  futureProject: futureProjectImg,
  aboutVolunteers: aboutVolunteersImg,
  waterProject: waterProjectImg,
  
  // Events
  karbalaEvent: karbalaEventImg,
  gatheringEvent: gatheringEventImg,
  naatEvent: naatEventImg,
  welfareEvent: welfareEventImg,

  // Additional
  charityClinic: charityClinicImg,
  communityWelfare: communityWelfareImg,
  educationalSupport: educationalSupportImg,
  foodDistribution: foodDistributionImg,

  // Newly added
  ruhaniIlajHealing: ruhaniIlajHealingImg,
  onlineIstikharaZoom: onlineIstikharaZoomImg,
  massWeddingCharity: massWeddingCharityImg,
  eidGiftsDistribution: eidGiftsDistributionImg,
  hazratSahibQuranClass: hazratSahibQuranClassImg
};

export const DICTIONARY = {
  nav: {
    home: { en: "Home", ur: "صفحہ اول" },
    about: { en: "About Us", ur: "ہمارے بارے میں" },
    services: { en: "Services", ur: "خدمات" },
    appointment: { en: "Book Session", ur: "رجسٹریشن معائنہ" },
    library: { en: "Islamic Library", ur: "روحانی لائبریری" },
    projects: { en: "Projects", ur: "منصوبے" },
    events: { en: "Events", ur: "تقاریب" },
    gallery: { en: "Gallery", ur: "گیلری" },
    transparency: { en: "Transparency", ur: "شفافیت" },
    news: { en: "News", ur: "خبریں" },
    contact: { en: "Contact Us", ur: "رابطہ کریں" },
    volunteer: { en: "Volunteer", ur: "رضاکار بنیں" },
    patientPortal: { en: "Patient Portal", ur: "مریضوں کا ریکارڈ" },
    duroodBank: { en: "Durood Bank", ur: "درود بینک" },
    donate: { en: "Donate Now", ur: "عطیہ کریں" }
  },
  general: {
    whatsappContact: { en: "Contact on WhatsApp", ur: "واٹس ایپ پر رابطہ کریں" },
    donateNow: { en: "Donate Now", ur: "عطیہ کریں" },
    servingHumanity: { en: "Serving Humanity, Spreading Hope", ur: "انسانیت کی خدمت، ہمارا عزم" },
    hasnainFoundation: { en: "Hasnain Foundation", ur: "حسنین فاؤنڈیشن" },
    readMore: { en: "Read More", ur: "مزید پڑھیں" },
    showLess: { en: "Show Less", ur: "کم دکھائیں" },
    viewAll: { en: "View All", ur: "تمام دیکھیں" },
    contactUs: { en: "Contact Us", ur: "رابطہ کریں" },
    backToHome: { en: "Back to Home", ur: "صفحہ اول پر واپس جائیں" },
    close: { en: "Close", ur: "بند کریں" },
    copied: { en: "Copied!", ur: "کاپی ہو گیا!" },
    copyError: { en: "Failed to copy", ur: "کاپی کرنے میں ناکامی" },
    whatsappDonationAlert: { en: "I would like to donate to Hasnain Foundation.", ur: "میں حسنین فاؤنڈیشن کے لیے عطیہ کرنا چاہتا ہوں۔" }
  },
  hero: {
    title: {
      en: "Authentic Spiritual Healing in the Light of Quran & Sunnah",
      ur: "قرآن و سنت کی روشنی میں مستند روحانی علاج"
    },
    subtitle: {
      en: "Complete treatment of Black Magic, Jinn possession, obstacles, Evil Eye, and other spiritual & physical ailments according to Shariah methods.",
      ur: "جادو، جنات، بندش، نظر بد، آسیب اور دیگر روحانی و جسمانی امراض کا شرعی طریقہ کار کے مطابق مکمل علاج"
    }
  },
  stats: {
    families: { en: "Families Supported", ur: "مدد یافتہ خاندان" },
    projects: { en: "Charity Projects", ur: "فلاحی منصوبے" },
    programs: { en: "Religious Programs", ur: "مذہبی پروگرام" },
    volunteers: { en: "Active Volunteers", ur: "سرگرم رضاکار" }
  },
  about: {
    title: { en: "About Hasnain Foundation", ur: "حسنین فاؤنڈیشن کے بارے میں" },
    subtitle: { 
      en: "A welfare and religious organization dedicated to helping humanity for the sake of Allah.",
      ur: "ایک فلاحی اور مذہبی تنظیم جو خالصتاً رضائے الٰہی کے لیے انسانیت کی خدمت میں مصروفِ عمل ہے۔" 
    },
    description: {
      en: "Hasnain Foundation is a registered non-profit organization operating in Karachi, Pakistan. Guided by Islamic principles of charity, empathy, and social justice, we design and implement high-impact welfare programs. We strive to uplift the impoverished, deliver sound educational opportunities to the underprivileged, support community development, and establish vibrant hubs of spiritual growth such as Jamia Masjid Abdul Qadir Jilani.",
      ur: "حسنین فاؤنڈیشن کراچی، پاکستان میں رجسٹرڈ شدہ ایک غیر منافع بخش فلاحی اور مذہبی تنظیم ہے۔ اسلامی تعلیمات، جذبہ ہمدردی اور سماجی انصاف کے سنہری اصولوں کے تحت، ہم فلاحی اور اصلاحی کام سرانجام دے رہے ہیں۔ ہمارا مقصد مستحقین کی دستگیری، غریب بچوں کو زیورِ تعلیم سے آراستہ کرنا، اور جامع مسجد عبدالقادر جیلانی جیسے روحانی مراکز کے قیام کے ذریعے معاشرے کی علمی و روحانی اصلاح کرنا ہے۔"
    },
    mission: { en: "Mission", ur: "ہمارا مقصد (مشن)" },
    missionText: {
      en: "Serve humanity with honesty, compassion and absolute transparency, strictly for the pleasure of Almighty Allah.",
      ur: "خالصتاً اللہ تعالیٰ کی خوشنودی کے لیے، انتہائی دیانتداری، ہمدردی اور مکمل شفافیت کے ساتھ دکھی انسانیت کی خدمت کرنا۔"
    },
    vision: { en: "Vision", ur: "ہمارا نظریہ (ویژن)" },
    visionText: {
      en: "Build a highly compassionate and self-reliant society where every needy person receives respect, dignity, education and essential support.",
      ur: "ایک ایسے ہمدرد اور خود کفیل معاشرے کی تشکیل جہاں ہر ضرورت مند کو عزتِ نفس، بہترین تعلیم، صحت اور بنیادی زندگی کی سہولیات میسر ہوں۔"
    },
    coreValues: { en: "Our Core Values", ur: "ہمارے بنیادی اقدار" },
    valuesList: [
      {
        title: { en: "Humanity", ur: "انسانیت" },
        desc: { en: "Serving everyone regardless of social status or origin.", ur: "ہر انسان کی بلا تفریق مذہب و ملت اور رنگ و نسل خدمت کرنا۔" }
      },
      {
        title: { en: "Trust", ur: "اعتماد و امانت" },
        desc: { en: "Upholding donor and community trust as a sacred bond.", ur: "عطیات کی امانت اور لوگوں کے اعتماد کو سب سے اہم فریضہ سمجھنا۔" }
      },
      {
        title: { en: "Transparency", ur: "شفافیت" },
        desc: { en: "Ensuring 100% traceabilty of every rupee spent.", ur: "عطیات کے ایک ایک روپے کے استعمال کو مکمل طور پر واضح اور شفاف رکھنا۔" }
      },
      {
        title: { en: "Compassion", ur: "ہمدردی" },
        desc: { en: "Approaching every individual with warmth and dignity.", ur: "ہر پریشان حال انسان کے ساتھ انتہائی نرمی، شفقت اور عزت سے پیش آنا۔" }
      },
      {
        title: { en: "Service", ur: "خدمتِ خلق" },
        desc: { en: "Working tirelessly to bring positive, lasting change.", ur: "معاشرے میں مثبت اور پائیدار تبدیلی لانے کے لیے شب و روز کوشاں رہنا۔" }
      }
    ]
  },
  services: {
    title: { en: "Our Services", ur: "ہماری خدمات" },
    subtitle: {
      en: "Comprehensive welfare and spiritual programs designed to support Karachi's most vulnerable communities.",
      ur: "کراچی کے پسماندہ طبقات کی مدد کے لیے تیار کردہ جامع فلاحی اور روحانی پروگرام۔"
    }
  },
  projects: {
    title: { en: "Our Ongoing & Future Projects", ur: "ہمارے جاری اور مستقبل کے منصوبے" },
    subtitle: {
      en: "Direct community interventions building sustainable foundations for future generations.",
      ur: "مستقبل کی نسلوں کے لیے پائیدار اور ٹھوس بنیادیں فراہم کرنے والے فلاحی منصوبے۔"
    },
    progressLabel: { en: "Fundraising Goal Progress", ur: "تعمیراتی و فنڈز کا ہدف" },
    raised: { en: "Raised", ur: "جمع شدہ" },
    goal: { en: "Goal", ur: "ہدف" },
    viewDetails: { en: "View Project Details", ur: "منصوبے کی تفصیلات" }
  },
  events: {
    title: { en: "Events & Gatherings", ur: "تقاریب اور اجتماعات" },
    subtitle: {
      en: "Join us in our regular religious gatherings, spiritual conferences, and welfare distribution events.",
      ur: "ہماری باقاعدہ مذہبی تقاریب، روحانی کانفرنسز اور فلاحی سامان کی تقسیم میں شرکت فرمائیں۔"
    },
    upcoming: { en: "Upcoming Events", ur: "آنے والی تقاریب" },
    past: { en: "Past Gatherings", ur: "سابقہ تقاریب" },
    date: { en: "Date", ur: "تاریخ" },
    time: { en: "Time", ur: "وقت" },
    venue: { en: "Venue", ur: "مقام" }
  },
  gallery: {
    title: { en: "Our Media Gallery", ur: "میڈیا گیلری" },
    subtitle: {
      en: "Glimpses of our welfare programs, construction updates, and religious gatherings.",
      ur: "ہمارے فلاحی پروگراموں، تعمیری کاموں اور مذہبی اجتماعات کی تصویری و ویڈیو جھلکیاں۔"
    },
    all: { en: "All Media", ur: "تمام میڈیا" },
    photos: { en: "Photos", ur: "تصاویر" },
    videos: { en: "Videos", ur: "ویڈیوز" },
    catMosque: { en: "Masjid Project", ur: "مسجد پراجیکٹ" },
    catFood: { en: "Food Drive", ur: "راشن تقسیم" },
    catEducation: { en: "Education", ur: "تعلیم و تربیت" },
    catWelfare: { en: "Welfare", ur: "فلاح و بہبود" },
    catEvents: { en: "Events", ur: "اجتماعات" },
    catSpiritual: { en: "Spiritual Healing", ur: "روحانی علاج" }
  },
  transparency: {
    title: { en: "Financial Transparency", ur: "مالی شفافیت" },
    subtitle: {
      en: "Every single rupee donated to Hasnain Foundation is fully documented, audited, and utilized responsibly.",
      ur: "حسنین فاؤنڈیشن کو دیا جانے والا ایک ایک روپیہ مکمل طور پر دستاویزی، آڈٹ شدہ اور انتہائی ذمہ داری سے استعمال کیا جاتا ہے۔"
    },
    utilizationTitle: { en: "Where Your Donations Go (Fund Utilization)", ur: "آپ کے عطیات کہاں خرچ ہوتے ہیں؟" },
    reportsTitle: { en: "Audit & Progress Reports", ur: "آڈٹ اور کارکردگی رپورٹس" },
    photoEvidenceTitle: { en: "On-Ground Evidence", ur: "زمین پر حقیقی کام کے تصویری ثبوت" },
    photoEvidenceDesc: { 
      en: "We document our activities transparency-first. Every food pack given, every brick laid at Jamia Masjid Abdul Qadir Jilani is fully accounted for.", 
      ur: "ہم اپنی سرگرمیوں کو مکمل شفافیت کے ساتھ ریکارڈ کرتے ہیں۔ تقسیم کیا گیا ہر راشن پیکیج اور مسجد کی تعمیر کا ہر مرحلہ دستاویزی ثبوت کے ساتھ موجود ہے۔" 
    },
    downloadReport: { en: "Download PDF Report", ur: "پی ڈی ایف رپورٹ ڈاؤن لوڈ کریں" },
    monthly: { en: "Monthly Report", ur: "ماہانہ رپورٹ" },
    annual: { en: "Annual Report", ur: "سالانہ رپورٹ" }
  },
  news: {
    title: { en: "News & Recent Activities", ur: "خبریں اور تازہ ترین سرگرمیاں" },
    subtitle: {
      en: "Stay updated with our latest welfare announcements, upcoming projects, and milestones.",
      ur: "ہماری فلاحی سرگرمیوں، نئے اعلانات اور اہم سنگِ میل سے باخبر رہیں۔"
    },
    published: { en: "Published on", ur: "شائع کردہ" }
  },
  donate: {
    title: { en: "Support Hasnain Foundation", ur: "عطیات کے ذریعے تعاون کریں" },
    subtitle: {
      en: "Your Small Contribution Can Change Someone's Life.",
      ur: "آپ کا ایک چھوٹا سا حصہ کسی کی زندگی میں بڑی تبدیلی لا سکتا ہے۔"
    },
    appealText: {
      en: "Donations to Hasnain Foundation fuel daily food distribution, provide orphan education, finance clean water systems, and complete the construction of Jamia Masjid Abdul Qadir Jilani. Choose any of our verified, direct-transfer methods below to contribute securely.",
      ur: "حسنین فاؤنڈیشن کو دیئے گئے عطیات روزانہ راشن کی تقسیم، یتیموں کی تعلیم، صاف پانی کی فراہمی، اور جامع مسجد عبدالقادر جیلانی کی تعمیر کو یقینی بناتے ہیں۔ محفوظ طریقے سے عطیہ کرنے کے لیے ذیل میں دیئے گئے تصدیق شدہ اکاؤنٹس میں سے کسی کا بھی انتخاب کریں۔"
    },
    copyAccount: { en: "Copy Account Number", ur: "اکاؤنٹ نمبر کاپی کریں" },
    copyIban: { en: "Copy IBAN", ur: "آئی بی اے این (IBAN) کاپی کریں" },
    copyWallet: { en: "Copy Wallet Number", ur: "موبائل والٹ کاپی کریں" },
    whatsappReceipt: { en: "Send Payment Proof on WhatsApp", ur: "رقم کی منتقلی کی رسید واٹس ایپ پر بھیجیں" },
    qrPlaceholder: { en: "Scan QR Code for Direct Transfer", ur: "براہِ راست منتقلی کے لیے کیو آر کوڈ اسکین کریں" },
    bankSection: { en: "Islamic Bank Account", ur: "اسلامک بینک اکاؤنٹ" },
    walletSection: { en: "Mobile Wallets", ur: "موبائل والٹس (آسان پیسہ / جیز کیش)" },
    thankYouTitle: { en: "JazakAllahu Khairan!", ur: "جزاک اللہ خیراً!" },
    thankYouMsg: {
      en: "Thank you for your generous intention to support Hasnain Foundation. Your contribution supports families, spreads education, and helps build Allah's house. May Allah accept your donation and bless you abundantly in this life and the hereafter.",
      ur: "حسنین فاؤنڈیشن کی مدد کے لیے آپ کے نیک جذبے کا بیحد شکریہ۔ آپ کا عطیہ غریب خاندانوں کی کفالت، تعلیم کی ترویج اور اللہ کے گھر کی تعمیر میں معاون ثابت ہوگا۔ اللہ تعالی آپ کا عطیہ قبول فرمائے اور آپ کو دنیا و آخرت میں جزائے خیر عطا فرمائے۔ آمین۔"
    }
  },
  contact: {
    title: { en: "Get In Touch", ur: "رابطہ کیجیے" },
    subtitle: {
      en: "Have questions, want to volunteer, or need more information? Reach out to us anytime.",
      ur: "کوئی سوال پوچھنا چاہتے ہیں، رضاکار بننا چاہتے ہیں یا معلومات درکار ہیں؟ ہم سے رابطہ کریں۔"
    },
    addressLabel: { en: "Head Office & Masjid Address", ur: "دفتر اور مسجد کا پتہ" },
    phoneLabel: { en: "Call Us", ur: "فون نمبر" },
    whatsappLabel: { en: "WhatsApp Support", ur: "واٹس ایپ" },
    emailLabel: { en: "Email Address", ur: "ای میل ایڈریس" },
    formName: { en: "Your Full Name", ur: "آپ کا پورا نام" },
    formEmail: { en: "Your Email Address", ur: "آپ کا ای میل پتہ" },
    formPhone: { en: "Your Phone Number", ur: "فون نمبر" },
    formSubject: { en: "Subject", ur: "موضوع / عنوان" },
    formMessage: { en: "Your Message", ur: "پیغام" },
    formSubmit: { en: "Send Message", ur: "پیغام بھیجیں" },
    formSending: { en: "Sending...", ur: "پیغام بھیجا جا رہا ہے..." },
    formSuccess: { en: "Thank you! Your message has been sent successfully. We will get back to you soon.", ur: "شکریہ! آپ کا پیغام کامیابی کے ساتھ بھیج دیا گیا ہے۔ ہم جلد ہی آپ سے رابطہ کریں گے۔" },
    mapPlaceholder: { en: "Interactive Google Map Location", ur: "گوگل میپ لوکیشن" }
  },
  footer: {
    tagline: {
      en: "Serving Humanity, Spreading Hope for the sake of Allah.",
      ur: "رضائے الٰہی کے حصول کے لیے دکھی انسانیت کی خدمت اور امیدوں کا چراغ روشن کرنا۔"
    },
    quickLinks: { en: "Quick Links", ur: "اہم روابط" },
    legal: { en: "Legal Documents", ur: "قانونی دستاویزات" },
    privacy: { en: "Privacy Policy", ur: "رازداری کی پالیسی" },
    terms: { en: "Terms & Conditions", ur: "شرائط و ضوابط" },
    allRightsReserved: { en: "All rights reserved. Hasnain Foundation is a registered non-profit organization under the Laws of Pakistan.", ur: "جملہ حقوق محفوظ ہیں۔ حسنین فاؤنڈیشن قوانینِ پاکستان کے تحت ایک رجسٹرڈ غیر منافع بخش فلاحی ادارہ ہے۔" }
  }
};

export const SERVICES_DATA: Service[] = [
  {
    id: "food-dist",
    iconName: "Soup",
    title: { en: "Food Distribution", ur: "راشن اور کھانا تقسیم" },
    description: {
      en: "Providing daily cooked meals and monthly dry ration bags ( आटा, چاول, دالیں, گھی ) to thousands of underprivileged and daily-wage families across Karachi.",
      ur: "کراچی بھر میں ہزاروں مستحق اور دیہاڑی دار خاندانوں کو روزانہ پکا ہوا کھانا اور ماہانہ خشک راشن بیگز (آٹا، چاول، دالیں، گھی) کی فراہمی۔"
    }
  },
  {
    id: "fin-assist",
    iconName: "HandCoins",
    title: { en: "Financial Assistance", ur: "مالی امداد و کفالت" },
    description: {
      en: "Direct financial support for widows, disabled persons, and low-income families to cover urgent rent, utility bills, or household survival costs with total dignity.",
      ur: "بیواؤں، معذور افراد اور کم آمدنی والے خاندانوں کو کرایہ، بجلی کے بل اور گھریلو اخراجات کی ادائیگی کے لیے نقد مالی امداد کی عزت و احترام کے ساتھ فراہمی۔"
    }
  },
  {
    id: "edu-support",
    iconName: "GraduationCap",
    title: { en: "Educational Support", ur: "تعلیمی سرپرستی" },
    description: {
      en: "Ensuring children of impoverished families can access modern education. We cover school fees, distribute uniforms, books, and stationeries, and run student tuition support.",
      ur: "غریب خاندانوں کے بچوں کے لیے جدید تعلیم تک رسائی یقینی بنانا۔ ہم اسکول فیس ادا کرتے ہیں، یونیفارم، کتب، اور اسٹیشنری تقسیم کرتے ہیں۔"
    }
  },
  {
    id: "rel-programs",
    iconName: "HeartHandshake",
    title: { en: "Religious Programs", ur: "مذہبی و تربیتی پروگرام" },
    description: {
      en: "Hosting spiritual conferences, Weekly Quranic Tafseer circles, Naat gatherings, and youth orientation camps to foster deep love for Sunnah and Islamic morality.",
      ur: "روحانی کانفرنسز، ہفتہ وار تفسیرِ قرآن، محافلِ نعت اور نوجوانوں کے تربیتی کیمپوں کا انعقاد تاکہ سنتِ نبوی اور اسلامی اخلاق کو فروغ دیا جا سکے۔"
    }
  },
  {
    id: "mosque-dev",
    iconName: "Church", // Using Church or Dome representation (will render gorgeous custom Masjid icon or Lucide Church mapped elegantly)
    title: { en: "Mosque Development", ur: "مساجد کی تعمیر و دیکھ بھال" },
    description: {
      en: "Constructing and expanding Jamia Masjid Abdul Qadir Jilani in Surjani Town, providing clean ablution facilities, solar power setups, and continuous operational support.",
      ur: "سرجانی ٹاؤن کراچی میں جامع مسجد عبدالقادر جیلانی کی تعمیر اور توسیع، وضو خانوں، سولر پاور پلانٹ اور مسجد کے مستقل انتظامات کی دیکھ بھال۔"
    }
  },
  {
    id: "comm-welfare",
    iconName: "Users",
    title: { en: "Community Welfare", ur: "معاشرتی بہبود" },
    description: {
      en: "Installing clean drinking water filtration plants, organizing free health screening camps, and assisting poor parents with daughter marriage expenses.",
      ur: "پینے کے صاف پانی کے لیے واٹر فلٹریشن پلانٹس کی تنصیب، مفت میڈیکل کیمپس کا انعقاد اور مستحق والدین کی بچیوں کی شادی کے اخراجات میں مدد کرنا۔"
    }
  },
  {
    id: "emerg-relief",
    iconName: "HeartPulse",
    title: { en: "Emergency Relief", ur: "ہنگامی امداد" },
    description: {
      en: "Providing rapid medical aid, ambulance support coordination, and special food supplies during unexpected urban floods or emergency lockdowns.",
      ur: "کراچی میں مون سون کی شدید بارشوں، شہری سیلاب یا کسی بھی ناگہانی آفت کی صورت میں ہنگامی طبی امداد، پکے ہوئے کھانے کی فوری ترسیل۔"
    }
  },
  {
    id: "charity-camp",
    iconName: "Megaphone",
    title: { en: "Charity Campaigns", ur: "خصوصی فلاحی مہمات" },
    description: {
      en: "Seasonal drives like Ramadan Rashan, Eid Gift Distribution for orphans, and Winter Blankets/warm clothing drives for street sleepers.",
      ur: "موسمی مہمات جیسے رمضان راشن پیکیجز، یتیم بچوں کے لیے عید گفٹس اور سردیوں میں غریبوں کے لیے گرم کمبل اور بستروں کی تقسیم۔"
    }
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "masjid-abdul-qadir",
    title: { en: "Jamia Masjid Abdul Qadir Jilani Construction", ur: "جامع مسجد عبدالقادر جیلانی کی تعمیر" },
    category: { en: "Mosque Project", ur: "تعمیرِ مسجد" },
    description: {
      en: "Building a beautiful, multi-story spiritual complex in Surjani Town, Karachi. The project will accommodate 1,500+ worshippers and include a free Islamic learning center for orphan kids.",
      ur: "سرجانی ٹاؤن کراچی میں ایک خوبصورت، کثیر المنزلہ روحانی مرکز کی تعمیر۔ اس منصوبے میں ۱۵۰۰ سے زائد نمازیوں کی گنجائش کے ساتھ ساتھ یتیم بچوں کے لیے مفت تعلیمی مرکز بھی قائم کیا جائے گا۔"
    },
    image: IMAGES.masjidProject,
    completed: false,
    progress: 68,
    raised: "PKR 12,240,000",
    goal: "PKR 18,000,000",
    details: {
      en: [
        "Constructing RCC pillars and roof of the main prayer hall (Completed).",
        "Setting up solar power energy systems for uninterrupted mosque operations (Completed).",
        "Currently fundraising for marble flooring, wood carvings, and extensive ablution (Wudu) areas.",
        "Establishing a fully stocked public Islamic Library on the first floor."
      ],
      ur: [
        "مرکزی نماز ہال کے ستونوں اور چھت کا لنٹر (کامیابی سے مکمل)۔",
        "مسجد کی بلاتعطل بجلی کے لیے سولر انرجی سسٹم کی تنصیب (مکمل)۔",
        "فی الوقت مسجد کے فرش پر سنگِ مرمر، لکڑی کے کام اور وسیع وضو خانے کی تعمیر کے لیے فنڈز درکار ہیں۔",
        "پہلی منزل پر ایک وسیع اسلامی لائبریری کا قیام۔"
      ]
    }
  },
  {
    id: "food-distribution-drive",
    title: { en: "Daily Rashan & Children's Dastarkhwan", ur: "روزانہ راشن اور بچوں کا لنگر" },
    category: { en: "Food Security", ur: "بچوں کی خوراک" },
    description: {
      en: "Distributing Dry Ration packs to verified low-income households and supplying daily nutritious, warm cooked meals to underprivileged children and orphans to combat childhood malnutrition across Karachi.",
      ur: "کراچی کے پسماندہ علاقوں میں معصوم بچوں اور یتیموں میں روزانہ کی بنیاد پر پکا ہوا غذائیت سے بھرپور کھانا اور مستحق خاندانوں کو ماہانہ خشک راشن بیگز کی فراہمی۔"
    },
    image: IMAGES.foodProject,
    completed: false,
    progress: 85,
    raised: "PKR 4,250,000",
    goal: "PKR 5,000,000",
    details: {
      en: [
        "Specifically focusing on child nutrition to safeguard young minds and bodies.",
        "A single monthly food bag (worth PKR 4,500) supports an average family of 6.",
        "Ration bags contain wheat flour, basmati rice, lentils, sugar, cooking oil, and tea.",
        "Every distribution is monitored and performed with absolute human dignity."
      ],
      ur: [
        "بچوں میں غذائیت کی کمی کو دور کرنے اور صحت مند نشوونما کے لیے خصوصی دسترخوان کا اہتمام۔",
        "ایک خاندان کا ماہانہ راشن بیگ (جس کی قیمت ۴,۵۰۰ روپے ہے) ۶ افراد کے کنبے کی کفالت کرتا ہے۔",
        "راشن بیگ میں آٹا، چاول، دالیں، چینی، کوکنگ آئل اور پتی شامل ہوتی ہے۔",
        "تقسیم کا ہر مرحلہ انسانی عزتِ نفس کو مدنظر رکھتے ہوئے سرانجام دیا جاتا ہے۔"
      ]
    }
  },
  {
    id: "education-orphans",
    title: { en: "Al-Hasnain Model School & Orphanage Support", ur: "الاحسنین ماڈل اسکول اور یتیم خانہ سرپرستی" },
    category: { en: "Education & Orphans", ur: "تعلیم و یتیم خانہ" },
    description: {
      en: "Sponsoring comprehensive services for children in our Model Schools and supporting local orphanages. We cover high-quality school fees, distribute blue uniforms, books, stationery, and winter clothing to vulnerable South Asian children.",
      ur: "ہمارے ماڈل اسکولوں اور یتیم خانوں کے غریب و یتیم بچوں کے تمام اخراجات بشمول فیس، یونیفارم، بستے، گرم کپڑے اور کتب کی فراہمی۔ ہمارا مقصد بچوں کے لیے روشن تعلیمی مستقبل قائم کرنا ہے۔"
    },
    image: IMAGES.educationProject,
    completed: false,
    progress: 72,
    raised: "PKR 2,160,000",
    goal: "PKR 3,000,000",
    details: {
      en: [
        "Directly sponsoring 200+ students in state-of-the-art charitable Model Schools.",
        "Providing safe shelter, nutritious meals, and Islamic schooling for orphans.",
        "Distributing high-quality blue & white uniforms, stationery, and books annually.",
        "Regular monitoring of student academic progress and professional counselor support."
      ],
      ur: [
        "جدید اور بہترین معیار کے فلاحی ماڈل اسکولوں میں ۲۰۰ سے زائد یتیم و غریب بچوں کی فیسوں کی براہ راست ادائیگی۔",
        "یتیم بچوں کے لیے رہائش، متوازن غذا اور معیاری دینی و دنیاوی تعلیم کی فراہمی۔",
        "ہر سال طلبہ میں نئے اسکول یونیفارم، جوتے، بیگز اور مکمل تعلیمی کٹ کی تقسیم۔",
        "بچوں کے تعلیمی سفر اور نفسیاتی نشوونما کی باقاعدہ نگرانی کرنا۔"
      ]
    }
  },
  {
    id: "community-clean-water",
    title: { en: "Community Water & Welfare Plants", ur: "معاشرتی بہبود اور فلٹریشن پلانٹ" },
    category: { en: "Welfare", ur: "عوامی فلاح" },
    description: {
      en: "Setting up Clean Water RO plants in water-scarce sectors of Surjani Town to protect citizens from waterborne diseases, and assisting poor girls with standard marriage kits.",
      ur: "سرجانی ٹاؤن کے پانی کی شدید قلت والے علاقوں میں واٹر فلٹریشن (آر او) پلانٹس کی تنصیب اور غریب و یتیم بچیوں کی شادی کے لیے جہیز فنڈز۔"
    },
    image: IMAGES.waterProject,
    completed: false,
    progress: 90,
    raised: "PKR 2,700,000",
    goal: "PKR 3,000,000",
    details: {
      en: [
        "Water filtration plant providing 5,000+ liters of purified drinking water daily.",
        "Zero-cost water supply to neighboring streets.",
        "Marriage assistance kits contain beddings, basic utensils, a sewing machine, and household furniture."
      ],
      ur: [
        "فلٹریشن پلانٹ روزانہ ۵,۰۰۰ لیٹر سے زائد پینے کا صاف پانی مہیا کرتا ہے۔",
        "شہریوں کو بالکل مفت پانی کی فراہمی۔"
      ]
    }
  },
  {
    id: "future-clinic",
    title: { en: "Future Project: Al-Hasnain Children & Family Free Hospital", ur: "مستقبل کا منصوبہ: الاحسنین چلڈرن اینڈ فیملی فری ہاسپٹل" },
    category: { en: "Upcoming", ur: "طبی منصوبہ" },
    description: {
      en: "Planning a state-of-the-art charitable hospital to provide 100% free expert pediatrician diagnostics, mother-and-child maternity services, and essential pharmacy medicines to Surjani Town families.",
      ur: "سرجانی ٹاؤن کراچی کے خاندانوں بالخصوص بچوں کے لیے ۱۰۰٪ مفت ماہر ڈاکٹرز، پیڈیاٹرک معائنہ، اور زچگی کے ساتھ مفت ادویات کی فراہمی کے لیے ایک اسٹیٹ آف دی آرٹ اسپتال کا قیام۔"
    },
    image: IMAGES.futureProject,
    completed: false,
    progress: 15,
    raised: "PKR 750,000",
    goal: "PKR 5,000,000",
    details: {
      en: [
        "Establishing a dedicated Pediatrics Emergency Ward for young children.",
        "Acquiring adjacent land plot near Jamia Masjid Abdul Qadir Jilani.",
        "Planned departments: General Outpatient (OPD), Pediatrics, and Maternity Care.",
        "Free dispensary supplying vital cardiovascular, pediatric, and diabetes medicines."
      ],
      ur: [
        "بچوں کے علاج کے لیے ایک مخصوص اور جدید پیڈیاٹرک ایمرجنسی وارڈ کا قیام۔",
        "جامع مسجد عبدالقادر جیلانی کے قریب زمین کے حصول کے مراحل۔",
        "مجوزہ شعبہ جات: جنرل او پی ڈی، بچوں کا علاج، اور گائنی وارڈ۔"
      ]
    }
  }
];

export const EVENTS_DATA: Event[] = [
  {
    id: "karbala-conf",
    title: { en: "Shahenshah-e-Karbala Conference", ur: "شہنشاہِ کربلا کانفرنس" },
    date: "2026-07-28", // Muharram theme event
    time: { en: "8:00 PM to 12:00 AM", ur: "بعد نمازِ عشاء تا ۱۲ بجے رات" },
    location: { en: "Jamia Masjid Abdul Qadir Jilani, Surjani Town", ur: "جامع مسجد عبدالقادر جیلانی، سرجانی ٹاؤن، کراچی" },
    category: "conference",
    description: {
      en: "An inspiring annual spiritual conference to commemorate the supreme sacrifices of Imam Hussain (R.A) and his noble companions in the field of Karbala. Renowned scholars will throw light on the lessons of truth, courage, and faith.",
      ur: "شہدائے کربلا بالخصوص سیدنا امام حسین علیہ السلام کی لازوال قربانیوں کی یاد میں عظیم الشان سالانہ کانفرنس۔ جید علماء کرام حق اور سچائی کے موضوع پر گراں قدر خطابات فرمائیں گے۔"
    },
    image: IMAGES.karbalaEvent,
    status: "upcoming"
  },
  {
    id: "gathering-dars",
    title: { en: "Weekly Quran & Sunnah Dars", ur: "ہفتہ وار درسِ قرآن و سنت" },
    date: "2026-07-19",
    time: { en: "After Maghrib Prayer", ur: "بعد نمازِ مغرب" },
    location: { en: "Jamia Masjid Abdul Qadir Jilani, Surjani Town", ur: "جامع مسجد عبدالقادر جیلانی، سرجانی ٹاؤن، کراچی" },
    category: "gathering",
    description: {
      en: "A spiritual weekly gathering focusing on Quranic Tafseer, Hadith principles, and purification of the soul (Tazkiyah). Separate seating arrangements are fully managed for sisters.",
      ur: "ہفتہ وار باقاعدہ روحانی نشست جس میں قرآن مجید کی تفسیر، ارشاداتِ نبوی اور تزکیہ نفس کے موضوعات پر درس دیا جاتا ہے۔ خواتین کے لیے پردے کا علیحدہ انتظام ہے۔"
    },
    image: IMAGES.gatheringEvent,
    status: "upcoming"
  },
  {
    id: "naat-program",
    title: { en: "Mehfil-e-Naat & Durood-o-Salam", ur: "عظیم الشان محفلِ نعت و سلام" },
    date: "2026-08-05",
    time: { en: "After Isha Prayer", ur: "بعد نمازِ عشاء" },
    location: { en: "Jamia Masjid Abdul Qadir Jilani, Surjani Town", ur: "جامع مسجد عبدالقادر جیلانی، سرجانی ٹاؤن، کراچی" },
    category: "naat",
    description: {
      en: "A beautiful evening of spiritual praise in honor of our Holy Prophet Muhammad (PBUH). Celebrated Naat Khawans from Karachi will recite soulful praises of the Messenger of Allah.",
      ur: "سرورِ کائنات، حضرت محمد مصطفیٰ صلی اللہ علیہ وآلہ وسلم کی بارگاہِ اقدس میں ہدیہ عقیدت پیش کرنے کے لیے روح پرور محفلِ نعت۔ ممتاز نعت خواں حضرات ثناء خوانی فرمائیں گے۔"
    },
    image: IMAGES.naatEvent,
    status: "upcoming"
  },
  {
    id: "welfare-med-camp",
    title: { en: "Free Eye Screening & Medical Camp", ur: "مفت طبی و آنکھوں کے معائنے کا کیمپ" },
    date: "2026-06-15",
    time: { en: "9:00 AM to 5:00 PM", ur: "صبح ۹ بجے تا شام ۵ بجے" },
    location: { en: "Foundation Welfare Center, Surjani Town", ur: "فاؤنڈیشن ویلفیئر سینٹر، سرجانی ٹاؤن، کراچی" },
    category: "welfare",
    description: {
      en: "A comprehensive free medical camp in Surjani Town. Over 450 underprivileged patients received free expert diagnostic advice, sugar/BP testing, custom glasses, and free cataract surgery referrals.",
      ur: "سرجانی ٹاؤن کے غریب شہریوں کے لیے فری میڈیکل کیمپ کا کامیاب انعقاد۔ ۴۵۰ سے زائد مریضوں کا مفت معائنہ، شوگر اور بلڈ پریشر ٹیسٹ، اور آنکھوں کے آپریشن کا مفت انتظام۔"
    },
    image: IMAGES.welfareEvent,
    status: "completed"
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "g1",
    title: { en: "Jamia Masjid Exterior Work", ur: "مسجد کا بیرونی منظر" },
    type: "photo",
    category: "mosque",
    url: IMAGES.masjidProject,
    thumbnail: IMAGES.masjidProject
  },
  {
    id: "g2",
    title: { en: "Ration Pack Storage & Verification", ur: "راشن بیگ کی تیاری" },
    type: "photo",
    category: "food",
    url: IMAGES.foodProject,
    thumbnail: IMAGES.foodProject
  },
  {
    id: "g3",
    title: { en: "Children in Quran Learning Class", ur: "بچے قرآن مجید پڑھتے ہوئے" },
    type: "photo",
    category: "education",
    url: IMAGES.educationProject,
    thumbnail: IMAGES.educationProject
  },
  {
    id: "g4",
    title: { en: "Community Clean Water Plant", ur: "پانی کا فلٹریشن پلانٹ" },
    type: "photo",
    category: "welfare",
    url: IMAGES.waterProject,
    thumbnail: IMAGES.waterProject
  },
  {
    id: "g5",
    title: { en: "Spiritual Conference Gathering", ur: "روحانی اجتماع میں عاشقانِ رسول کا ہجوم" },
    type: "photo",
    category: "events",
    url: IMAGES.karbalaEvent,
    thumbnail: IMAGES.karbalaEvent
  },
  {
    id: "g7",
    title: { en: "Weekly Dars Assembly", ur: "ہفتہ وار درس کی تقریب" },
    type: "photo",
    category: "events",
    url: IMAGES.gatheringEvent,
    thumbnail: IMAGES.gatheringEvent
  },
  {
    id: "g8",
    title: { en: "Emergency Medical Relief Kit Distribution", ur: "طبی سامان کی تقسیم" },
    type: "photo",
    category: "welfare",
    url: IMAGES.welfareEvent,
    thumbnail: IMAGES.welfareEvent
  },
  {
    id: "g9",
    title: { en: "Charity Clinic Diagnostics", ur: "فلاحی کلینک اور تشخیصی مرکز" },
    type: "photo",
    category: "welfare",
    url: IMAGES.charityClinic,
    thumbnail: IMAGES.charityClinic
  },
  {
    id: "g10",
    title: { en: "Community General Welfare Services", ur: "عام سماجی فلاحی خدمات" },
    type: "photo",
    category: "welfare",
    url: IMAGES.communityWelfare,
    thumbnail: IMAGES.communityWelfare
  },
  {
    id: "g11",
    title: { en: "Free Books & Educational Supplies", ur: "مفت کتب اور تعلیمی سامان کی تقسیم" },
    type: "photo",
    category: "education",
    url: IMAGES.educationalSupport,
    thumbnail: IMAGES.educationalSupport
  },
  {
    id: "g12",
    title: { en: "On-Ground Food Distribution Drive", ur: "بچوں اور خاندانوں میں کھانا تقسیم کرنا" },
    type: "photo",
    category: "food",
    url: IMAGES.foodDistribution,
    thumbnail: IMAGES.foodDistribution
  },
  {
    id: "g13",
    title: { en: "Spiritual Healing & Consultations", ur: "مستند روحانی علاج اور رہنمائی" },
    type: "photo",
    category: "spiritual",
    url: IMAGES.ruhaniIlajHealing,
    thumbnail: IMAGES.ruhaniIlajHealing
  },
  {
    id: "g14",
    title: { en: "Online Istikhara & Zoom Sessions", ur: "آن لائن استخارہ اور شرعی رہنمائی" },
    type: "photo",
    category: "spiritual",
    url: IMAGES.onlineIstikharaZoom,
    thumbnail: IMAGES.onlineIstikharaZoom
  },
  {
    id: "g15",
    title: { en: "Collective Mass Wedding Ceremony", ur: "اجتماعی شادی پراجیکٹ کے تحت جہیز کی فراہمی" },
    type: "photo",
    category: "welfare",
    url: IMAGES.massWeddingCharity,
    thumbnail: IMAGES.massWeddingCharity
  },
  {
    id: "g16",
    title: { en: "Eid Gifts Program for Orphan Children", ur: "یتیم اور مستحق بچوں میں عید گفٹ پیکیج کی تقسیم" },
    type: "photo",
    category: "welfare",
    url: IMAGES.eidGiftsDistribution,
    thumbnail: IMAGES.eidGiftsDistribution
  },
  {
    id: "g17",
    title: { en: "Quran Learning & Islamic Education Class", ur: "حضرت صاحب بچوں کو قرآن مجید پڑھاتے ہوئے" },
    type: "photo",
    category: "education",
    url: IMAGES.hazratSahibQuranClass,
    thumbnail: IMAGES.hazratSahibQuranClass
  },
  {
    id: "g18",
    title: { en: "Orphanage Children Activities & Support", ur: "یتیم اور مستحق بچوں کی کفالت اور تفریحی سرگرمیاں" },
    type: "photo",
    category: "welfare",
    url: IMAGES.communityProject,
    thumbnail: IMAGES.communityProject
  },
  {
    id: "g19",
    title: { en: "Children Healthcare & General Checkups", ur: "بچوں کی صحت اور فلاحی طبی معائنہ" },
    type: "photo",
    category: "welfare",
    url: IMAGES.futureProject,
    thumbnail: IMAGES.futureProject
  },
  {
    id: "g20",
    title: { en: "Foundation Volunteers Orientation Meeting", ur: "رضاکاروں کا فلاحی اور تنظیمی معلوماتی سیشن" },
    type: "photo",
    category: "welfare",
    url: IMAGES.aboutVolunteers,
    thumbnail: IMAGES.aboutVolunteers
  },
  {
    id: "g21",
    title: { en: "Great Naat Sharif & Zikr Mehfil", ur: "عظیم الشان محفلِ نعت اور ذکرِ الہٰ" },
    type: "photo",
    category: "events",
    url: IMAGES.naatEvent,
    thumbnail: IMAGES.naatEvent
  },
  {
    id: "g22",
    title: { en: "Masjid Abdul Qadir Jilani Main Hall", ur: "جامع مسجد عبدالقادر جیلانی کا مرکزی ہال" },
    type: "photo",
    category: "mosque",
    url: IMAGES.heroBg,
    thumbnail: IMAGES.heroBg
  }
];

export const TRANSPARENCY_REPORTS: TransparencyReport[] = [
  {
    id: "rep-2026-q1",
    title: { en: "Q1 2026 Financial & Welfare Report", ur: "پہلی سہ ماہی ۲۰۲۶ء مالیاتی رپورٹ" },
    month: { en: "January - March", ur: "جنوری تا مارچ" },
    year: "2026",
    type: "monthly",
    downloadUrl: "#",
    utilization: [
      { category: { en: "Mosque Construction", ur: "تعمیرِ مسجد" }, percentage: 45, amount: "PKR 5,400,000" },
      { category: { en: "Food Ration Kits", ur: "راشن تقسیم" }, percentage: 30, amount: "PKR 3,600,000" },
      { category: { en: "Orphan Education Fees", ur: "تعلیمی فنڈ" }, percentage: 12, amount: "PKR 1,440,000" },
      { category: { en: "Water & Medical Camps", ur: "صاف پانی و طبی علاج" }, percentage: 8, amount: "PKR 960,000" },
      { category: { en: "Administrative Costs", ur: "انتظامی اخراجات" }, percentage: 5, amount: "PKR 600,000" }
    ]
  },
  {
    id: "rep-2025-annual",
    title: { en: "Annual Welfare Impact Report 2025", ur: "سالانہ فلاحی رپورٹ ۲۰۲۵ء" },
    month: { en: "Full Year", ur: "مکمل سال" },
    year: "2025",
    type: "annual",
    downloadUrl: "#",
    utilization: [
      { category: { en: "Mosque Infrastructure", ur: "تعمیراتی ڈھانچہ" }, percentage: 40, amount: "PKR 16,000,000" },
      { category: { en: "Ramadan & Daily Food Drive", ur: "کھانا اور راشن تقسیم" }, percentage: 35, amount: "PKR 14,000,000" },
      { category: { en: "Orphan & School Sponsorship", ur: "تعلیمِ اطفال" }, percentage: 12, amount: "PKR 4,800,000" },
      { category: { en: "Emergency Medical & Marriage Kits", ur: "طبی علاج و شادی کی تقاریب" }, percentage: 9, amount: "PKR 3,600,000" },
      { category: { en: "Admin & Operations", ur: "انتظامی اخراجات" }, percentage: 4, amount: "PKR 1,600,000" }
    ]
  }
];

export const NEWS_DATA: NewsArticle[] = [
  {
    id: "news-solar",
    title: { en: "Solarization of Jamia Masjid Abdul Qadir Jilani Complete", ur: "جامع مسجد عبدالقادر جیلانی پر سولر انرجی سسٹم کی کامیاب تنصیب" },
    date: "2026-07-05",
    excerpt: {
      en: "We have successfully installed a high-capacity 15KW hybrid solar energy system, securing uninterrupted power for lighting, sound, and fans, ensuring worshippers' comfort.",
      ur: "الحمدللہ، مسجد میں ۱۵ کلوواٹ کا گرڈ ہائبرڈ سولر سسٹم کامیابی سے نصب کر دیا گیا ہے۔ اب مسجد کی لائٹس، لاؤڈ اسپیکر اور پنکھے بلاتعطل بجلی پر چلیں گے۔"
    },
    content: {
      en: [
        "In our efforts to make the Jamia Masjid self-sufficient and green, we have completed the 15KW solar panel array installation on the mosque roof.",
        "This project was entirely funded by a single local donor from Karachi. The installation will save the mosque approximately PKR 75,000 monthly in utility costs.",
        "Worshippers will now enjoy completely cool prayer sessions even during heavy Karachi summer load-shedding hours. May Allah reward the donors!"
      ],
      ur: [
        "جامع مسجد عبدالقادر جیلانی کو توانائی کے شعبے میں خود کفیل بنانے کے لیے، چھت پر ۱۵ کلوواٹ کے سولر پینلز کی تنصیب مکمل کر لی گئی ہے۔",
        "اس پروجیکٹ کے تمام تر اخراجات کراچی کے ایک مخلص مخیر شخص نے اٹھائے ہیں۔ اس سسٹم کے بعد مسجد کو ماہانہ تقریباً ۷۵ ہزار روپے کے بجلی بل کی بچت ہوگی۔",
        "اب نمازی شدید گرمی اور لوڈ شیڈنگ کے اوقات میں بھی سکون کے ساتھ عبادت سرانجام دے سکیں گے۔ اللہ پاک تمام عطیہ دہندگان کو جزائے خیر عطا فرمائے۔"
      ]
    },
    image: IMAGES.masjidProject,
    tag: { en: "Mosque Project", ur: "تعمیرِ مسجد" }
  },
  {
    id: "news-ramadan",
    title: { en: "Over 2,500 Families Assisted During Ramadan Drive", ur: "رمضان فلاحی مہم: ۲,۵۰۰ سے زائد خاندانوں میں راشن بیگز کی تقسیم" },
    date: "2026-05-10",
    excerpt: {
      en: "By the grace of Allah, Hasnain Foundation successfully prepared, verified, and delivered premium Ramadan dry ration bags to 2,500+ needy households in Karachi.",
      ur: "اللہ کے فضل و کرم سے حسنین فاؤنڈیشن نے رمضان المبارک کے بابرکت مہینے میں کراچی کے غریب ترین خاندانوں کو راشن بیگز تقسیم کیے۔"
    },
    content: {
      en: [
        "Our logistics team worked day and night to assemble high-quality food bags. Each bag weighed 32kg and included essential items like 20kg flour, rice, sugar, oil, chickpeas, and dates.",
        "We followed a strict and respectful verification process to locate deserving widows, disabled citizens, and daily-wage laborers who do not beg in public.",
        "All distributions were conducted in a structured, safe, and respectful manner across Surjani Town, Orangi, and Lyari."
      ],
      ur: [
        "ہماری ٹیموں نے دن رات محنت کر کے ۳۲ کلو وزنی اعلیٰ کوالٹی کے فوڈ بیگز تیار کیے۔ ہر بیگ میں ۲۰ کلو آٹا، فائن چاول، چینی، گھی، دالیں، چنے اور کھجوریں شامل تھیں۔",
        "ہم نے انتہائی خاموشی اور عزتِ نفس کے ساتھ بیواؤں، معذوروں اور دیہاڑی دار مزدوروں کے گھروں تک خود راشن پہنچایا جو سفید پوش ہیں۔",
        "تقسیم کا عمل سرجانی ٹاؤن، اورنگی اور لیاری کے مضافات میں کامیابی سے سرانجام دیا گیا۔"
      ]
    },
    image: IMAGES.foodProject,
    tag: { en: "Food Drive", ur: "راشن تقسیم" }
  },
  {
    id: "news-water-plant",
    title: { en: "New Clean Drinking RO Water Plant Operational in Sector 6-C", ur: "سیکٹر 6-C سرجانی ٹاؤن میں پینے کے صاف پانی کا جدید آر او پلانٹ چالو" },
    date: "2026-04-12",
    excerpt: {
      en: "Residents of Surjani Sector 6-C now have access to 100% clean, virus-free pure drinking water, protecting children from severe typhoid and cholera outbreaks.",
      ur: "سرجانی ٹاؤن سیکٹر 6-C کے رہائشیوں کو پینے کے صاف پانی کی مفت فراہمی شروع کر دی گئی ہے، جس سے معصوم بچوں کو ہیضہ، ٹائیفائیڈ جیسی بیماریوں سے بچایا جا سکے گا۔"
    },
    content: {
      en: [
        "Clean drinking water has been a critical challenge in Surjani Town due to contaminated underground water. Our newly opened RO filtration plant produces 5,000 liters of safe drinking water per day.",
        "The plant is equipped with modern reverse osmosis membranes and UV sterilization filters. Citizens are provided water completely free of charge with simple filling cards.",
        "We plan to install 3 more identical water stations in surrounding sub-sectors by the end of the year."
      ],
      ur: [
        "سرجانی ٹاؤن میں زیرِ زمین پانی آلودہ ہونے کی وجہ سے صاف پانی کی شدید قلت تھی۔ حسنین فاؤنڈیشن نے جدید واٹر فلٹریشن پلانٹ نصب کر دیا ہے جو روزانہ ۵ ہزار لیٹر پانی فلٹر کرتا ہے۔",
        "یہ پلانٹ جدید ریورس اسموسس (RO) اور الٹرا وائلٹ (UV) فلٹرز سے لیس ہے۔ شہریوں کو بالکل مفت پانی فراہم کیا جا رہا ہے۔",
        "انشاء اللہ، رواں سال کے آخر تک قریبی علاقوں میں مزید ۳ واٹر پلانٹس نصب کرنے کا ارادہ ہے۔"
      ]
    },
    image: IMAGES.waterProject,
    tag: { en: "Welfare Drive", ur: "فلاح و بہبود" }
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "story-food",
    title: {
      en: "From Constant Worry to Safe Nourishment",
      ur: "مسلسل پریشانی سے باعزت راشن تک"
    },
    beneficiaryName: "Muhammad Amin, Orangi Town",
    project: {
      en: "Daily Food & Ramadan Drive",
      ur: "روزانہ کھانا اور رمضان راشن اسکیم"
    },
    story: {
      en: "Muhammad Amin, a daily-wage laborer and father of four, struggled to provide two square meals during periods of inflation. Receiving the Hasnain Foundation's premium monthly dry ration pack relieved him of his biggest worry. The savings allowed him to keep his children enrolled in school, preserving both their nutrition and their future.",
      ur: "چار بچوں کے باپ اور دیہاڑی دار مزدور محمد امین کے لیے شدید مہنگائی میں دو وقت کا کھانا فراہم کرنا ناممکن ہو چکا تھا۔ حسنین فاؤنڈیشن کی جانب سے ماہانہ راشن پیکیج کی وصولی نے ان کی سب سے بڑی فکر دور کر دی۔ اس بچت کی بدولت انہوں نے بچوں کو اسکول سے نہیں اٹھایا، جس سے ان کی غذا اور مستقبل دونوں محفوظ ہو گئے۔"
    }
  },
  {
    id: "story-water",
    title: {
      en: "Safe Water, Healthy Children",
      ur: "صاف پانی، صحت مند بچے"
    },
    beneficiaryName: "Zainab Bibi, Surjani Sector 6-C",
    project: {
      en: "Clean Drinking RO Water Station",
      ur: "پینے کے صاف پانی کا فلٹریشن پلانٹ"
    },
    story: {
      en: "Zainab Bibi's household faced constant health crises, with her children regularly falling ill with waterborne infections from the contaminated local tap water. Since the installation of the Hasnain Foundation's free RO purification plant in Sector 6-C, her family drinks safe, pure water daily. Her kids are healthy, active, and no longer miss school.",
      ur: "زینب بی بی کے گھر والے مسلسل بیماریوں کا شکار رہتے تھے، اور ان کے بچے نلکے کے آلودہ پانی کی وجہ سے پیٹ اور ٹائیفائیڈ کی بیماریوں میں مبتلا رہتے تھے۔ جب سے حسنین فاؤنڈیشن نے سیکٹر 6-C میں مفت آر او فلٹریشن پلانٹ لگایا ہے، ان کا خاندان روزانہ پینے کا صاف اور محفوظ پانی حاصل کر رہا ہے۔ اب ان کے بچے بالکل تندرست اور اسکول میں حاضر رہتے ہیں۔"
    }
  },
  {
    id: "story-education",
    title: {
      en: "A Fatherless Boy's Dream Reborn",
      ur: "ایک یتیم بچے کے خوابوں کی نئی اڑان"
    },
    beneficiaryName: "Bilal Rashid, Korangi",
    project: {
      en: "Orphan Education Support",
      ur: "یتیم بچوں کی تعلیمی کفالت"
    },
    story: {
      en: "After losing his father, 9-year-old Bilal was on the verge of leaving school to work. The Hasnain Foundation stepped in with a full educational sponsorship, covering his tuition fees, textbooks, uniform, and bag. Today, Bilal is a top-performing student in his grade, dreaming of becoming a software engineer to serve Pakistan.",
      ur: "اپنے والد کے انتقال کے بعد، ۹ سالہ بلال اسکول چھوڑ کر مزدوری کرنے ہی والا تھا کہ حسنین فاؤنڈیشن نے اس کی مکمل تعلیمی کفالت کا ذمہ لے لیا۔ فاؤنڈیشن نے اس کی اسکول کی فیس، کتابیں، یونیفارم اور بیگ فراہم کیے۔ آج بلال اپنی کلاس کا ایک بہترین طالب علم ہے اور ملک و قوم کی خدمت کے لیے سافٹ ویئر انجینئر بننے کا خواب دیکھ رہا ہے۔"
    }
  }
];

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: "post-1",
    platform: "facebook",
    author: "Hasnain Foundation",
    date: "July 15, 2026",
    content: {
      en: "Alhamdulillah! Over 150 food packs containing flour, sugar, ghee, rice, and pulses were distributed today to widows and orphans in Orangi Town under our 'Daily Food Drive'. Thank you to our compassionate donors who make this continuous support possible.",
      ur: "الحمدللہ! اج ہمارے 'روزانہ راشن پروگرام' کے تحت اورنگی ٹاؤن میں یتیموں اور بیواؤں کے گھرانوں میں آٹا، چینی، گھی، چاول اور دالوں پر مشتمل ۱۵۰ سے زائد راشن بیگز تقسیم کیے گئے۔ ہمارے تمام مخیر عطیہ دہندگان کا شکریہ جن کے تعاون سے یہ سلسلہ جاری ہے۔"
    },
    likes: 245,
    shares: 42,
    comments: 18,
    mediaUrl: IMAGES.foodProject
  },
  {
    id: "post-2",
    platform: "youtube",
    author: "Hasnain Foundation Official",
    date: "July 12, 2026",
    content: {
      en: "Take a virtual tour of our newest Clean Drinking RO Water Plant in Sector 6-C Surjani Town. This plant filters and sanitizes 5,000+ liters of safe, pure water daily, serving hundreds of families in Karachi free of charge. Watch the impact video now!",
      ur: "ہمارے سیکٹر 6-C سرجانی ٹاؤن میں نصب کیے گئے نئے واٹر فلٹریشن پلانٹ کا تصویری دورہ کریں۔ یہ پلانٹ روزانہ ۵ ہزار لیٹر سے زائد صاف اور جراثیم سے پاک پانی فراہم کرتا ہے، جس سے سینکڑوں خاندان بالکل مفت مستفید ہو رہے ہیں۔ ویڈیو دیکھیں۔"
    },
    likes: 512,
    shares: 89,
    comments: 34,
    videoDuration: "4:12"
  },
  {
    id: "post-3",
    platform: "instagram",
    author: "hasnain.foundation",
    date: "July 08, 2026",
    content: {
      en: "Smiling faces! Today our educational desk distributed comprehensive school kits (backpacks, books, notebooks, stationery, and uniforms) to 80 fatherless children in Korangi. Education is the ultimate path to self-reliance and empowerment.",
      ur: "مسکراتے چہرے! آج ہماری تعلیمی کمیٹی نے کورنگی میں ۸۰ سے زائد یتیم اور مستحق بچوں میں اسکول بیگز، کتابیں، کاپیاں اور یونیفارمز تقسیم کیے۔ تعلیم ہی خود انحصاری اور حقیقی ترقی کا واحد راستہ ہے۔"
    },
    likes: 389,
    shares: 15,
    comments: 23,
    mediaUrl: IMAGES.educationProject
  }
];
