import { useEffect } from 'react';
import { Language } from '../types';

interface UseMetaTagsProps {
  lang: Language;
  activeSection: string;
}

export default function useMetaTags({ lang, activeSection }: UseMetaTagsProps) {
  useEffect(() => {
    const isUrdu = lang === 'ur';

    // Section-specific metadata mapped for English and Urdu
    const metadata: Record<string, { title: string; description: string; keywords: string }> = {
      home: {
        title: isUrdu 
          ? 'حسنین فاؤنڈیشن | خدمتِ انسانیت، امید کی کرن' 
          : 'Hasnain Foundation | Serving Humanity, Spreading Hope',
        description: isUrdu
          ? 'مسجد عبدالقادر جیلانی کی تعمیر، صاف پانی کے فلٹریشن پلانٹس، روزانہ راشن اور مستحقین کی مدد کے لیے حسنین فاؤنڈیشن کراچی کے باضابطہ فلاحی کاموں کا حصہ بنیں۔'
          : 'Support Hasnain Foundation Karachi. Active in constructing Masjid Abdul Qadir Jilani, RO water plant setup, daily food drives, and orphan education.',
        keywords: isUrdu
          ? 'حسنین فاؤنڈیشن, فلاحی ادارہ کراچی, صدقہ و زکوٰۃ, راشن اسکیم, پینے کا صاف پانی, مسجد تعمیر'
          : 'Hasnain Foundation, charity Karachi, Pakistan NGO, daily food drive, clean RO water, orphan support, Zakat donation, Masjid build'
      },
      about: {
        title: isUrdu 
          ? 'ہمارے بارے میں | شفافیت اور انتھک جدوجہد' 
          : 'About Us | Transparency & Dedication | Hasnain Foundation',
        description: isUrdu
          ? 'ہماری تاریخ، مکمل آڈٹ رپورٹ، شفاف فنانس لیجر اور کراچی کے پسماندہ علاقوں میں مستحق خاندانوں کی خدمت کرنے والے رضا کاروں کے متعلق جانیں۔'
          : 'Discover our history, comprehensive transparent audit reports, live donation tracker ledger, and our volunteer network across Karachi.',
        keywords: isUrdu
          ? 'حسنین فاؤنڈیشن پس منظر, فلاحی آڈٹ, فنانشل شفافیت, کراچی رضاکار'
          : 'Hasnain Foundation history, NGO audit reports, financial transparency, Karachi volunteer network'
      },
      services: {
        title: isUrdu 
          ? 'ہماری خدمات | انسانیت کا درد اور فلاحی کام' 
          : 'Our Services | Making an Impact in Karachi',
        description: isUrdu
          ? 'پینے کے صاف پانی کی فراہمی، روزانہ کی بنیاد پر کھانا، تعلیمی وظائف، مسجد کی تعمیر اور ہنگامی حالات میں امدادی فلاحی سرگرمیاں۔'
          : 'Learn about our services: clean drinking water plants, daily hot meal drives, educational kits for orphans, building mosques, and medical relief.',
        keywords: isUrdu
          ? 'راشن سروس, پانی پلانٹ کراچی, اسکول بیگ تقسیم, ہنگامی فلاحی کام'
          : 'hot meals drive, water filtration services, school uniform distribution, disaster relief'
      },
      projects: {
        title: isUrdu 
          ? 'فلاحی منصوبے | تعمیرِ مسجد اور صاف پانی فلٹریشن' 
          : 'Welfare Projects | Masjid & Water Plants | Hasnain Foundation',
        description: isUrdu
          ? 'سرجانی ٹاؤن، اورنگی ٹاؤن اور کورنگی میں جاری فلاحی منصوبے بشمول مسجد عبدالقادر جیلانی، امینہ آر او فلٹریشن پلانٹس اور یتیم بچوں کے اسکول کٹس۔'
          : 'Explore our key projects: Masjid Abdul Qadir Jilani Surjani, Amina RO clean water filtration, daily food drives, and active orphan support classes.',
        keywords: isUrdu
          ? 'مسجد عبدالقادر جیلانی سرجانی, امینہ واٹر فلٹریشن, اورنگی ٹاؤن فلاح, فلاحی منصوبے'
          : 'Masjid Abdul Qadir Jilani Surjani, Amina RO water plant, Orangi Town welfare, project tracking'
      },
      events: {
        title: isUrdu 
          ? 'تقاریب اور سرگرمیاں | مستحقین میں امداد کی تقسیم' 
          : 'Events & Gatherings | Compassion in Action',
        description: isUrdu
          ? 'ہمارے تازہ ترین سیمینارز، سانحہ کربلا کانفرنس، سالانہ فلاحی محافل اور کراچی کے غریب ترین علاقوں میں امدادی سامان کی تقسیم۔'
          : 'Stay updated with our community conferences, spiritual gatherings, naat recitation events, and massive public relief distribution campaigns in Karachi.',
        keywords: isUrdu
          ? 'کرنٹ ایونٹس کراچی, کانفرنس فلاحی, امدادی کیمپ'
          : 'Karachi NGO gatherings, charity events, food distribution camps, relief programs'
      },
      gallery: {
        title: isUrdu 
          ? 'تصویری اور ویڈیو البم | حقیقی اثرات کا مظاہرہ' 
          : 'Photo & Video Gallery | Transparent Impact Gallery',
        description: isUrdu
          ? 'ہمارے تمام فلاحی اور تعمیراتی منصوبوں کی شفاف تصویری گیلری اور اثرانگیز دستاویزی ویڈیوز دیکھیں۔'
          : 'Browse dynamic, high-resolution media galleries showcasing our food distribution, water filtration plant setup, and mosque construction progress.',
        keywords: isUrdu
          ? 'فلاحی تصاویر, راشن تقسیم ویڈیوز, مسجد تعمیر فوٹوز'
          : 'charity photos, food drive videos, transparent project imagery'
      },
      donate: {
        title: isUrdu 
          ? 'عطیات اور زکوٰۃ | انسانی زندگیاں بچانے میں مدد کریں' 
          : 'Donate Generously | Zakat & Sadqah | Hasnain Foundation',
        description: isUrdu
          ? 'زکوٰۃ، صدقات اور دیگر فنڈز کے ذریعے کراچی کے مستحقین کا سہارا بنیں۔ ۱۰۰ فیصد شفافیت اور ریئل ٹائم لائیو عطیات کی معلومات۔'
          : 'Support humanity with your Zakat and Sadqah donations. 100% donation policy with a fully transparent live public ledger.',
        keywords: isUrdu
          ? 'زکوٰۃ آن لائن, صدقہ جاریہ, پے پال عطیہ, آن لائن ڈونیشن پاکستان'
          : 'online Zakat payment, Sadqah Jariyah, digital donation ledger, online charity Pakistan'
      }
    };

    // Get metadata for current active section, or default to 'home'
    const sectionKey = metadata[activeSection] ? activeSection : 'home';
    const activeMeta = metadata[sectionKey];

    // 1. Update Document Title
    document.title = activeMeta.title;

    // Helper function to set or update meta tag elements
    const updateMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const parts = selector.replace('meta[', '').replace(']', '').split('=');
        if (parts.length === 2) {
          const attrName = parts[0];
          const attrVal = parts[1].replace(/['"]/g, '');
          element.setAttribute(attrName, attrVal);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 2. Update Primary SEO Tags
    updateMetaTag('meta[name="title"]', 'content', activeMeta.title);
    updateMetaTag('meta[name="description"]', 'content', activeMeta.description);
    updateMetaTag('meta[name="keywords"]', 'content', activeMeta.keywords);

    // 3. Update Open Graph (OG) Tags
    updateMetaTag('meta[property="og:title"]', 'content', activeMeta.title);
    updateMetaTag('meta[property="og:description"]', 'content', activeMeta.description);
    updateMetaTag('meta[property="og:locale"]', 'content', isUrdu ? 'ur_PK' : 'en_US');
    
    // Choose specific og:image based on the section
    let ogImage = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=95&w=1920';
    if (sectionKey === 'projects') {
      ogImage = 'https://images.unsplash.com/photo-1597935258735-e254c1839512?auto=format&fit=crop&q=95&w=1920';
    } else if (sectionKey === 'donate') {
      ogImage = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=95&w=1920';
    } else if (sectionKey === 'services') {
      ogImage = 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&q=95&w=1920';
    }
    updateMetaTag('meta[property="og:image"]', 'content', ogImage);

    // 4. Update Twitter Card Tags
    updateMetaTag('meta[name="twitter:title"]', 'content', activeMeta.title);
    updateMetaTag('meta[name="twitter:description"]', 'content', activeMeta.description);
    updateMetaTag('meta[name="twitter:image"]', 'content', ogImage);

    // 5. Update Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    const sectionSlug = sectionKey === 'home' ? '' : `#${sectionKey}`;
    canonicalLink.setAttribute('href', `https://hasnain-foundation-com.ai.studio/${sectionSlug}`);

  }, [lang, activeSection]);
}
