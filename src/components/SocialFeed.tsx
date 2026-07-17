import React, { useState } from 'react';
import { SOCIAL_POSTS } from '../data';
import { SocialPost, Language } from '../types';
import { 
  Facebook, 
  Youtube, 
  Instagram, 
  MessageCircle, 
  Share2, 
  Heart, 
  Sparkles, 
  RefreshCw, 
  Plus, 
  Languages, 
  Play, 
  Check, 
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialFeedProps {
  lang: Language;
}

export default function SocialFeed({ lang }: SocialFeedProps) {
  const isUrdu = lang === 'ur';

  // State Management
  const [posts, setPosts] = useState<SocialPost[]>(SOCIAL_POSTS);
  const [activeTab, setActiveTab] = useState<'all' | 'facebook' | 'youtube' | 'instagram'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Custom Post creation state
  const [showAddModal, setShowAddModal] = useState(false);
  const [postPlatform, setPostPlatform] = useState<'facebook' | 'instagram' | 'youtube'>('facebook');
  const [postContent, setPostContent] = useState('');
  const [postLang, setPostLang] = useState<Language>('en');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Status/Logs
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter posts based on tab
  const filteredPosts = posts.filter(p => {
    if (activeTab === 'all') return true;
    return p.platform === activeTab;
  });

  // 1. Live Fetch Updates via Gemini with Grounding Search
  const handleFetchLiveUpdates = async () => {
    setIsRefreshing(true);
    setErrorMsg(null);
    setStatusMsg(isUrdu ? "گوگل سرچ کے ذریعے تازہ ترین خبریں اور سرگرمیاں تلاش کی جا رہی ہیں..." : "Querying Google Search grounding for Hasnain Foundation updates...");

    try {
      const response = await fetch('/api/social/feed');
      const data = await response.json();

      if (data.success && data.posts) {
        // Map raw API posts to local SocialPost schema
        const fetchedPosts: SocialPost[] = data.posts.map((p: any, idx: number) => ({
          id: `live-post-${Date.now()}-${idx}`,
          platform: p.platform || 'facebook',
          author: p.author || 'Hasnain Foundation',
          date: p.date || 'Just now',
          content: {
            en: p.contentEn,
            ur: p.contentUr
          },
          likes: p.likes || Math.floor(Math.random() * 200) + 100,
          shares: p.shares || Math.floor(Math.random() * 50) + 10,
          comments: p.comments || Math.floor(Math.random() * 30) + 5,
          videoDuration: p.videoDuration,
          isAiGenerated: true
        }));

        // Merge keeping uniqueness or placing new ones at top
        setPosts(prev => [...fetchedPosts, ...prev]);
        setStatusMsg(isUrdu ? "سوشل میڈیا فیڈ کامیابی سے اپ ڈیٹ ہو گئی!" : "Social media feed updated successfully with live search results!");
        setTimeout(() => setStatusMsg(null), 3500);
      } else {
        throw new Error(data.error || "Could not retrieve live posts");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(isUrdu ? "تازہ ترین اپ ڈیٹس حاصل کرنے میں دشواری پیش آئی۔" : `Failed to fetch updates: ${err.message}`);
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 2. Draft & Translate custom update
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsSubmittingPost(true);
    setErrorMsg(null);
    setStatusMsg(isUrdu ? "ترجمہ اور اشاعت کا عمل جاری ہے..." : "Translating and publishing update...");

    try {
      const targetLanguage: Language = postLang === 'en' ? 'ur' : 'en';

      // Call translation API
      const response = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: postContent, targetLang: targetLanguage })
      });

      const data = await response.json();
      if (data.success && data.translation) {
        const newPost: SocialPost = {
          id: `custom-post-${Date.now()}`,
          platform: postPlatform,
          author: postPlatform === 'instagram' ? 'hasnain.foundation' : 'Hasnain Foundation',
          date: isUrdu ? 'ابھی' : 'Just now',
          content: {
            en: postLang === 'en' ? postContent : data.translation,
            ur: postLang === 'ur' ? postContent : data.translation
          },
          likes: 0,
          shares: 0,
          comments: 0,
          isAiGenerated: false
        };

        setPosts(prev => [newPost, ...prev]);
        setShowAddModal(false);
        setPostContent('');
        setStatusMsg(isUrdu ? "آپ کا تاثر کامیابی سے شائع ہو گیا!" : "Announcement translated and posted!");
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        throw new Error(data.error || "Translation failed");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(isUrdu ? "پوسٹ اپ لوڈ کرنے میں ناکامی" : `Post creation failed: ${err.message}`);
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <section id="social-feed-section" className="py-20 bg-white relative overflow-hidden font-sans border-t border-slate-100">
      
      {/* Decorative vectors */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-30 pointer-events-none -translate-x-1/2" />
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-emerald-50 rounded-full blur-3xl opacity-30 pointer-events-none translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className={isUrdu ? 'text-right md:order-2' : 'text-left md:order-1'}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" />
              <span>{isUrdu ? 'لائیو سوشل سرگرمیاں' : 'Live Social Hub'}</span>
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu ? 'سوشل میڈیا لائیو اپ ڈیٹس' : 'Social Media Stream'}
            </h2>
            <p className="mt-2 text-slate-500 max-w-xl text-sm leading-relaxed">
              {isUrdu 
                ? 'حسنین فاؤنڈیشن کے فیس بک، یوٹیوب اور انسٹاگرام سے لائیو سرگرمیاں اور تازہ ترین راشن، پانی اور مسجد پراجیکٹس کی خبریں۔'
                : 'Stay informed with automatically grounded real-time search updates from our official social channels.'}
            </p>
          </div>

          <div className={`flex flex-wrap gap-2 shrink-0 ${isUrdu ? 'md:order-1' : 'md:order-2'}`}>
            {/* Live Grounded Search Trigger */}
            <button
              onClick={handleFetchLiveUpdates}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg shadow-blue-200 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isUrdu ? 'تازہ ترین لائیو خبریں تلاش کریں (Gemini AI)' : 'Sync Live Search (Gemini AI)'}</span>
            </button>

            {/* Add Custom Simulated Announcement */}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'لائیو اعلان درج کریں' : 'Draft Live Update'}</span>
            </button>
          </div>
        </div>

        {/* Tab Selection Filter */}
        <div className={`flex justify-start border-b border-slate-100 mb-8 overflow-x-auto no-scrollbar ${isUrdu ? 'flex-row-reverse' : ''}`}>
          {(['all', 'facebook', 'youtube', 'instagram'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-bold border-b-2 uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'all' && (isUrdu ? 'تمام اپ ڈیٹس' : 'All Feeds')}
              {tab === 'facebook' && 'Facebook'}
              {tab === 'youtube' && 'YouTube'}
              {tab === 'instagram' && 'Instagram'}
            </button>
          ))}
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {statusMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-blue-600" />
              <span>{statusMsg}</span>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <motion.div
                layout
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-50 hover:bg-white border border-slate-150/60 rounded-2xl shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group overflow-hidden relative"
              >
                {/* AI / Grounded Ribbon Indicator */}
                {post.isAiGenerated && (
                  <div className="absolute top-0 right-0 bg-blue-50 text-blue-800 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-bl-lg border-l border-b border-blue-200/50 flex items-center gap-1">
                    <Sparkles className="w-2 h-2 text-blue-600 animate-pulse" />
                    <span>Live Search</span>
                  </div>
                )}

                <div>
                  {/* Author, Platform and Date row */}
                  <div className={`flex items-center justify-between mb-4 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2.5 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                      <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-100 flex items-center justify-center text-slate-800 uppercase font-bold text-xs shrink-0 font-mono">
                        {post.author.charAt(0)}
                      </div>
                      <div className={isUrdu ? 'text-right font-urdu' : 'text-left font-sans'}>
                        <h4 className="text-xs font-extrabold text-slate-800">{post.author}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                      {getPlatformIcon(post.platform)}
                    </div>
                  </div>

                  {/* Core Content Body */}
                  <div className="space-y-4 mb-4">
                    <p className={`text-slate-600 text-xs sm:text-sm leading-relaxed ${isUrdu ? 'font-urdu text-right' : 'text-left'}`}>
                      {isUrdu ? post.content.ur : post.content.en}
                    </p>

                    {/* Media Representation */}
                    {post.platform === 'youtube' ? (
                      <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center group/yt">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/35 group-hover/yt:from-black/90 transition-all" />
                        
                        {/* Play overlay button */}
                        <div className="relative z-10 w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-transform group-hover/yt:scale-105 shadow-md">
                          <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                        </div>

                        {/* Duration Overlay */}
                        {post.videoDuration && (
                          <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold font-mono rounded">
                            {post.videoDuration}
                          </span>
                        )}

                        <span className="absolute bottom-2.5 left-2.5 text-[9px] font-extrabold text-white/90 font-mono tracking-wider uppercase">
                          {isUrdu ? 'ویڈیو دیکھیں' : 'Watch Video'}
                        </span>
                      </div>
                    ) : post.mediaUrl ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 border border-slate-100">
                        <img 
                          src={post.mediaUrl} 
                          alt="Feed visual" 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Engagement / Social Interactions Row */}
                <div className={`pt-3.5 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px] font-bold font-mono ${
                  isUrdu ? 'flex-row-reverse' : ''
                }`}>
                  <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.comments}</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{post.shares || 0}</span>
                  </button>

                  <a 
                    href={post.platform === 'facebook' ? 'https://facebook.com/hasnainfoundation' : post.platform === 'youtube' ? 'https://youtube.com/hasnainfoundation' : 'https://instagram.com/hasnainfoundation'} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1 hover:text-blue-600 transition-colors"
                    title="View Original"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state when no posts found */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">{isUrdu ? 'کوئی پوسٹ نہیں ملی' : 'No posts found'}</h4>
            <p className="text-xs text-slate-400 mt-1">
              {isUrdu ? 'منتخب کردہ میڈیا سے لائیو پوسٹس فیڈ دستیاب نہیں ہے۔' : 'No posts are currently listed under this tab.'}
            </p>
          </div>
        )}

      </div>

      {/* MODAL: CREATE CUSTOM SIMULATED POST */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left"
            >
              <h3 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-1.5">
                <Send className="w-5 h-5 text-blue-600" />
                <span>{isUrdu ? 'لائیو سوشل اپ ڈیٹ تیار کریں' : 'Draft Live Hub Post'}</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {isUrdu 
                  ? 'سوشل اپ ڈیٹ لکھیں۔ ہمارا خودکار مترجم Gemini AI اسے انگریزی اور اردو دونوں زبانوں میں تبدیل کر کے آپ کی لائیو فیڈ میں شامل کرے گا۔'
                  : 'Draft a short update. Gemini AI will instantly translate it to provide a bilingual version, placing it live at the top of the feed.'}
              </p>

              <form onSubmit={handleCreatePost} className="space-y-4">
                {/* Platform select */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isUrdu ? 'سوشل میڈیا پلیٹ فارم:' : 'Select Target Channel:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['facebook', 'instagram', 'youtube'] as const).map((plat) => (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setPostPlatform(plat)}
                        className={`py-2 text-xs font-bold rounded-lg border capitalize cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                          postPlatform === plat 
                            ? 'bg-blue-50 border-blue-500 text-blue-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {getPlatformIcon(plat)}
                        <span>{plat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Source Language select */}
                <div className="flex gap-4">
                  <span className="text-xs font-bold text-slate-700 self-center">
                    {isUrdu ? 'لکھنے کی زبان:' : 'Drafting Language:'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPostLang('en')}
                      className={`px-3 py-1 text-xs rounded-md font-bold cursor-pointer transition-colors ${postLang === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostLang('ur')}
                      className={`px-3 py-1 text-xs rounded-md font-bold cursor-pointer transition-colors ${postLang === 'ur' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      اردو
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isUrdu ? 'اپ ڈیٹ کا مواد:' : 'Update Content:'}
                  </label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                    rows={4}
                    placeholder={postLang === 'ur' ? 'سرجانی ٹاؤن، راشن تقسیم اور لائیو فلاحی مہم کا احوال لکھیں...' : 'Share what is happening at the foundation...'}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Submit button row */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPost}
                    className="w-1/2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingPost ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{isUrdu ? 'شائع ہو رہا ہے...' : 'Publishing...'}</span>
                      </>
                    ) : (
                      <>
                        <Languages className="w-3.5 h-3.5 text-blue-200" />
                        <span>{isUrdu ? 'شائع کریں' : 'Translate & Post'}</span>
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
