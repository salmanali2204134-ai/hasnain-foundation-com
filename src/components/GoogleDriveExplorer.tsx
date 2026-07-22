/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
  googleSignIn, 
  logout, 
  initAuth, 
  listDriveFiles, 
  createDriveFolder, 
  uploadFileToDrive, 
  deleteDriveFile, 
  DriveFile 
} from '../lib/googleDrive';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileSpreadsheet, 
  Download, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Search, 
  HardDrive, 
  Loader2, 
  CloudUpload, 
  ChevronRight, 
  ChevronLeft, 
  LogOut, 
  RefreshCw, 
  Lock, 
  ShieldCheck, 
  FolderPlus,
  AlertCircle,
  CheckCircle,
  FileCode,
  File
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';

interface GoogleDriveExplorerProps {
  lang: Language;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

// Beautiful Photo-Only Demo Data for Public View
const DEMO_FILES: DriveFile[] = [
  {
    id: 'demo-1',
    name: 'Emergency_Relief_Photo_Gallery',
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: '2026-07-18T12:00:00.000Z',
    webViewLink: '#'
  },
  {
    id: 'demo-2',
    name: 'Jamia_Masjid_Construction_Photo_Archive',
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: '2026-07-15T14:30:00.000Z',
    webViewLink: '#'
  },
  {
    id: 'demo-3',
    name: 'Food_Ration_Drive_On_Ground_Pictures',
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: '2026-07-10T09:15:00.000Z',
    webViewLink: '#'
  },
  {
    id: 'demo-4',
    name: 'RO_Water_Plant_Installation_Photos',
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: '2026-07-05T11:00:00.000Z',
    webViewLink: '#'
  }
];

export default function GoogleDriveExplorer({ lang }: GoogleDriveExplorerProps) {
  const isUrdu = lang === 'ur';
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Drive state
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [folderPath, setFolderPath] = useState<BreadcrumbItem[]>([{ id: 'root', name: isUrdu ? 'مرکزی فولڈر' : 'Main Drive' }]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload and Folder Create states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translate dictionary for explorer
  const t = {
    title: {
      en: 'Hasnain Foundation Cloud Storage',
      ur: 'حسنین فاؤنڈیشن کلاؤڈ اسٹوریج'
    },
    subtitle: {
      en: 'Access, upload and manage charity documents, reports, and welfare records directly inside your Google Drive.',
      ur: 'اپنے گوگل ڈرائیو میں براہ راست فلاحی دستاویزات، آڈٹ رپورٹس اور امدادی ریکارڈز کا انتظام کریں۔'
    },
    connectedAs: {
      en: 'Connected as',
      ur: 'منسلک بحیثیت'
    },
    connectBtn: {
      en: 'Connect Google Drive',
      ur: 'گوگل ڈرائیو منسلک کریں'
    },
    disconnectBtn: {
      en: 'Disconnect',
      ur: 'علیحدہ کریں'
    },
    publicDemo: {
      en: 'Public Photo Archive (Private Documents Protected)',
      ur: 'عوامی تصویری آرکائیو (حساس دستاویزات محفوظ)'
    },
    demoNotice: {
      en: 'Financial audit reports, Zakat ledgers, and transaction files are private to prevent misuse. Public storage displays on-ground activity photos only. Login as Admin for authorized document access.',
      ur: 'زکوٰۃ تقسیم، حسن فاؤنڈیشن کی آڈٹ رپورٹس، اور مالیاتی ٹرانزیکشنز کی حفاظت کی خاطر انہیں پرائیویٹ رکھا گیا ہے۔ عام منظر میں صرف امدادی کام کی تصاویر دکھائی دیتی ہیں۔'
    },
    searchPlaceholder: {
      en: 'Search files and reports...',
      ur: 'فائلیں اور رپورٹس تلاش کریں...'
    },
    uploadBtn: {
      en: 'Upload File',
      ur: 'فائل اپ لوڈ کریں'
    },
    newFolderBtn: {
      en: 'New Folder',
      ur: 'نیا فولڈر بنائیں'
    },
    emptyFolder: {
      en: 'This folder is empty',
      ur: 'یہ فولڈر خالی ہے'
    },
    fileName: {
      en: 'Name',
      ur: 'نام'
    },
    fileSize: {
      en: 'Size',
      ur: 'سائز'
    },
    modified: {
      en: 'Last Modified',
      ur: 'آخری ترمیم'
    },
    actions: {
      en: 'Actions',
      ur: 'اقدامات'
    },
    createFolderTitle: {
      en: 'Create New Folder',
      ur: 'نیا فولڈر تیار کریں'
    },
    folderNameLabel: {
      en: 'Folder Name',
      ur: 'فولڈر کا نام'
    },
    cancel: {
      en: 'Cancel',
      ur: 'منسوخ کریں'
    },
    create: {
      en: 'Create',
      ur: 'تخلیق کریں'
    },
    confirmDelete: {
      en: 'Are you sure you want to delete this file? This action is irreversible and will delete it from Google Drive.',
      ur: 'کیا آپ واقعی اس فائل کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں لیا جا سکتا اور یہ گوگل ڈرائیو سے مستقل حذف ہو جائے گی۔'
    },
    unauthorizedMsg: {
      en: 'Google Drive access was unauthorized. Please sign in again.',
      ur: 'گوگل ڈرائیو تک رسائی غیر مجاز تھی۔ براہ کرم دوبارہ لاگ ان کریں۔'
    },
    uploadSuccessMsg: {
      en: 'File uploaded successfully!',
      ur: 'فائل کامیابی کے ساتھ اپ لوڈ ہو گئی!'
    },
    dragDropText: {
      en: 'Drag & drop files here or click to browse',
      ur: 'فائلیں یہاں ڈریگ کریں یا براؤز کرنے کے لیے کلک کریں'
    }
  };

  // Sync folder path title on language change
  useEffect(() => {
    setFolderPath(prev => prev.map(item => {
      if (item.id === 'root') {
        return { id: 'root', name: isUrdu ? 'مرکزی فولڈر' : 'Main Drive' };
      }
      return item;
    }));
  }, [lang]);

  // Auth initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser, accessToken) => {
        setUser(authenticatedUser);
        setToken(accessToken);
        setNeedsAuth(false);
        setAuthLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
        setAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files from Drive
  const fetchFiles = async (folderId: string, searchVal?: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const results = await listDriveFiles(token, folderId === 'root' ? undefined : folderId, searchVal);
      setFiles(results);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('401')) {
        setError(t.unauthorizedMsg[lang]);
        handleLogout();
      } else {
        setError(err.message || 'An error occurred while loading files.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh files list
  useEffect(() => {
    if (token) {
      fetchFiles(currentFolderId, searchQuery);
    } else {
      // Load demo data if not connected
      setFiles(DEMO_FILES.filter(file => {
        if (searchQuery) {
          return file.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      }));
    }
  }, [token, currentFolderId, searchQuery]);

  // Handle Google Login
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login flow failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setCurrentFolderId('root');
      setFolderPath([{ id: 'root', name: isUrdu ? 'مرکزی فولڈر' : 'Main Drive' }]);
      setSearchQuery('');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Navigate inside a folder
  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setFolderPath(prev => [...prev, { id: folderId, name: folderName }]);
  };

  // Breadcrumb navigation
  const handleBreadcrumbClick = (index: number) => {
    const targetItem = folderPath[index];
    setCurrentFolderId(targetItem.id);
    setFolderPath(prev => prev.slice(0, index + 1));
  };

  // Create Folder handler
  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newFolderName.trim()) return;

    setCreatingFolder(true);
    try {
      await createDriveFolder(
        token,
        newFolderName.trim(),
        currentFolderId === 'root' ? undefined : currentFolderId
      );
      setNewFolderName('');
      setIsCreateFolderOpen(false);
      fetchFiles(currentFolderId, searchQuery);
    } catch (err: any) {
      alert(`Folder creation failed: ${err.message}`);
    } finally {
      setCreatingFolder(false);
    }
  };

  // Upload File handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!token || !fileList || fileList.length === 0) return;

    const file = fileList[0];
    setUploading(true);
    setUploadProgress(15);
    setUploadSuccess(false);

    try {
      setUploadProgress(45);
      await uploadFileToDrive(
        token,
        file,
        currentFolderId === 'root' ? undefined : currentFolderId
      );
      setUploadProgress(100);
      setUploadSuccess(true);
      fetchFiles(currentFolderId, searchQuery);
      setTimeout(() => {
        setUploadSuccess(false);
      }, 4000);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Delete file with safety confirmation
  const handleDeleteClick = async (fileId: string, fileName: string) => {
    if (!token) return;

    const confirmed = window.confirm(
      isUrdu 
        ? `کیا آپ واقعی "${fileName}" کو حذف کرنا چاہتے ہیں؟ یہ عمل مستقل ہے اور فائل گوگل ڈرائیو سے ہٹ جائے گی۔`
        : `Are you sure you want to delete "${fileName}"? This action cannot be undone and will permanently remove it from your Google Drive.`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteDriveFile(token, fileId);
      fetchFiles(currentFolderId, searchQuery);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format File Size
  const formatBytes = (bytesStr?: string) => {
    if (!bytesStr) return '—';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return '—';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format Date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get appropriate file icon
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-amber-500 fill-amber-500" />;
    }
    if (mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    if (mimeType.includes('image')) {
      return <ImageIcon className="w-5 h-5 text-sky-500" />;
    }
    if (mimeType.includes('video')) {
      return <VideoIcon className="w-5 h-5 text-indigo-500" />;
    }
    if (mimeType.includes('code') || mimeType.includes('javascript') || mimeType.includes('json')) {
      return <FileCode className="w-5 h-5 text-slate-600" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  // Drag and Drop files upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!token || uploading) return;
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      setUploading(true);
      setUploadProgress(30);
      try {
        await uploadFileToDrive(
          token,
          droppedFiles[0],
          currentFolderId === 'root' ? undefined : currentFolderId
        );
        setUploadProgress(100);
        setUploadSuccess(true);
        fetchFiles(currentFolderId, searchQuery);
        setTimeout(() => setUploadSuccess(false), 4000);
      } catch (err: any) {
        alert(`Drop Upload failed: ${err.message}`);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-8">
      
      {/* Top Banner / Hero Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-700/20 rounded-full blur-2xl" />
        
        <div className={`relative flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          isUrdu ? 'md:flex-row-reverse text-right' : 'text-left'
        }`}>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 ${isUrdu ? 'justify-end' : ''}`}>
              <span className="p-1.5 bg-emerald-700/80 rounded-lg text-emerald-300">
                <HardDrive className="w-5 h-5" />
              </span>
              <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                {t.title[lang]}
              </h3>
            </div>
            <p className={`text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed ${isUrdu ? 'font-urdu leading-loose' : 'font-sans'}`}>
              {t.subtitle[lang]}
            </p>
          </div>

          {/* Authentication Action Panel */}
          <div className={`flex items-center gap-3 ${isUrdu ? 'justify-end' : ''}`}>
            {authLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Session...</span>
              </div>
            ) : !needsAuth && user ? (
              <div className={`flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-xl ${
                isUrdu ? 'flex-row-reverse' : ''
              }`}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-slate-600" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center text-xs font-bold font-mono">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className={`text-left ${isUrdu ? 'text-right' : ''}`}>
                  <span className="text-[10px] text-slate-400 block leading-none font-medium uppercase tracking-wider">
                    {t.connectedAs[lang]}
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5 max-w-[140px] truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title={t.disconnectBtn[lang]}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-xs tracking-wide shadow-md shadow-emerald-900/20 cursor-pointer transition-all border border-emerald-500/30"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.65 4.5 1.8l2.4-2.4C17.3 1.7 14.9 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.595-.061-1.155-.17-1.685H12.24z"/>
                  </svg>
                )}
                <span className={isUrdu ? 'font-urdu' : ''}>{t.connectBtn[lang]}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info Warning Bar for Public Access */}
      {needsAuth && (
        <div className={`bg-amber-50/70 border-b border-amber-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isUrdu ? 'sm:flex-row-reverse text-right font-urdu' : 'text-left'
        }`}>
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-900 block leading-tight">
                {t.publicDemo[lang]}
              </span>
              <span className="text-[11px] text-amber-700 block mt-0.5 leading-relaxed">
                {t.demoNotice[lang]}
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogin}
            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline flex-shrink-0 self-start sm:self-center cursor-pointer"
          >
            {isUrdu ? 'اپنا گوگل اکاؤنٹ منسلک کریں ←' : 'Connect Account Now →'}
          </button>
        </div>
      )}

      {/* Control Tools Header (Search & Actions) */}
      <div className={`p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isUrdu ? 'md:flex-row-reverse' : ''
      }`}>
        
        {/* Search bar */}
        <div className="relative flex-grow max-w-md w-full">
          <input
            type="text"
            placeholder={t.searchPlaceholder[lang]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white border border-slate-200 text-xs sm:text-xs rounded-xl py-2 px-9 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 ${
              isUrdu ? 'text-right font-urdu' : 'text-left font-sans'
            }`}
          />
          <Search className={`absolute w-4 h-4 text-slate-400 top-2.5 ${
            isUrdu ? 'right-3' : 'left-3'
          }`} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute top-2 text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer ${
                isUrdu ? 'left-2' : 'right-2'
              }`}
            >
              ×
            </button>
          )}
        </div>

        {/* Action Buttons for Authenticated Drive */}
        {!needsAuth && token && (
          <div className={`flex items-center gap-2 self-end md:self-auto ${isUrdu ? 'flex-row-reverse' : ''}`}>
            
            {/* Create Folder button */}
            <button
              onClick={() => setIsCreateFolderOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 font-bold text-[11px] transition-colors cursor-pointer shadow-sm"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span className={isUrdu ? 'font-urdu' : ''}>{t.newFolderBtn[lang]}</span>
            </button>

            {/* Direct Upload input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CloudUpload className="w-3.5 h-3.5" />
              )}
              <span className={isUrdu ? 'font-urdu' : ''}>{t.uploadBtn[lang]}</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Breadcrumbs */}
      <div className={`px-5 py-3 bg-white border-b border-slate-100 flex items-center overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none gap-1.5 ${
        isUrdu ? 'flex-row-reverse justify-start font-urdu' : 'flex-row justify-start font-sans'
      }`}>
        {folderPath.map((item, index) => {
          const isLast = index === folderPath.length - 1;
          return (
            <React.Fragment key={item.id}>
              {index > 0 && (
                isUrdu ? <ChevronLeft className="w-3 h-3 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
              )}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                disabled={isLast}
                className={`font-semibold transition-colors cursor-pointer ${
                  isLast 
                    ? 'text-slate-900 font-bold cursor-default' 
                    : 'text-emerald-700 hover:text-emerald-900 hover:underline'
                }`}
              >
                {item.name}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Drag & Drop Upload Zone Overlay when authenticated */}
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative"
      >
        
        {/* Uploading Progress Bar */}
        <AnimatePresence>
          {uploading && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-0 z-10 bg-emerald-50/95 border-b border-emerald-100 p-3 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />
                <span className="text-xs font-bold text-emerald-950">
                  {isUrdu ? 'فائل اپ لوڈ کی جا رہی ہے...' : 'Uploading file to Google Drive...'}
                </span>
              </div>
              <div className="flex-grow max-w-xs bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-700 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">{uploadProgress}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Success Alert */}
        <AnimatePresence>
          {uploadSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-0 z-10 bg-emerald-700 text-white p-3 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span className="text-xs font-bold">{t.uploadSuccessMsg[lang]}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Files Main Table / Viewport */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
              <span className={`text-xs text-slate-500 ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'رپورٹس لوڈ کی جا رہی ہیں...' : 'Fetching live files from Drive...'}
              </span>
            </div>
          ) : error ? (
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className={`text-xs text-slate-600 max-w-md ${isUrdu ? 'font-urdu leading-loose' : ''}`}>
                {error}
              </p>
              <button
                onClick={() => fetchFiles(currentFolderId, searchQuery)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : files.length === 0 ? (
            <div className="py-20 px-4 flex flex-col items-center justify-center text-center gap-2">
              <Folder className="w-12 h-12 text-slate-300" />
              <span className={`text-xs sm:text-sm font-bold text-slate-700 ${isUrdu ? 'font-urdu' : ''}`}>
                {t.emptyFolder[lang]}
              </span>
              <p className={`text-[11px] text-slate-400 max-w-xs ${isUrdu ? 'font-urdu leading-loose' : ''}`}>
                {isUrdu 
                  ? 'اس فولڈر میں اب تک کوئی ریکارڈ اپ لوڈ نہیں کیا گیا۔' 
                  : 'No documents or spreadsheets are currently stored in this directory.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`bg-slate-50/60 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider ${
                  isUrdu ? 'text-right' : 'text-left'
                }`}>
                  <th className="px-5 py-3">{t.fileName[lang]}</th>
                  <th className="px-5 py-3 hidden sm:table-cell">{t.fileSize[lang]}</th>
                  <th className="px-5 py-3 hidden md:table-cell">{t.modified[lang]}</th>
                  <th className="px-5 py-3 text-center">{t.actions[lang]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {files.map((file) => {
                  const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                  return (
                    <tr 
                      key={file.id} 
                      className="hover:bg-slate-50/40 transition-colors group"
                    >
                      {/* Name Col */}
                      <td className="px-5 py-3.5 font-medium text-slate-900 max-w-sm sm:max-w-md">
                        <div className={`flex items-center gap-3 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-shrink-0">
                            {getFileIcon(file.mimeType)}
                          </div>
                          <div className={`truncate ${isUrdu ? 'text-right' : 'text-left'}`}>
                            {isFolder ? (
                              <button
                                onClick={() => handleFolderClick(file.id, file.name)}
                                className={`font-bold text-slate-950 hover:text-emerald-700 hover:underline transition-colors block cursor-pointer text-xs ${isUrdu ? 'font-urdu' : 'font-sans'}`}
                              >
                                {file.name}
                              </button>
                            ) : (
                              <span className={`block truncate ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                {file.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Size Col */}
                      <td className={`px-5 py-3.5 hidden sm:table-cell font-mono text-[11px] text-slate-500 ${
                        isUrdu ? 'text-right' : 'text-left'
                      }`}>
                        {isFolder ? '—' : formatBytes(file.size)}
                      </td>

                      {/* Date Col */}
                      <td className={`px-5 py-3.5 hidden md:table-cell font-mono text-[11px] text-slate-500 ${
                        isUrdu ? 'text-right' : 'text-left'
                      }`}>
                        {formatDate(file.modifiedTime)}
                      </td>

                      {/* Actions Col */}
                      <td className="px-5 py-3.5">
                        <div className={`flex items-center justify-center gap-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                          
                          {/* Main Web View action */}
                          {file.webViewLink && file.webViewLink !== '#' && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-sm cursor-pointer"
                              title="Open in Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Demo Report Alert/Download */}
                          {needsAuth && !isFolder && (
                            <button
                              onClick={() => alert(`Downloading Demo Document: "${file.name}"`)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-sm cursor-pointer"
                              title="Download Report"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Action (only if connected with Token & not a parent) */}
                          {!needsAuth && token && (
                            <button
                              onClick={() => handleDeleteClick(file.id, file.name)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-red-600 hover:text-red-700 transition-colors shadow-sm cursor-pointer"
                              title="Delete File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Folder Creation Modal Overlay */}
      <AnimatePresence>
        {isCreateFolderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-xl"
            >
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <h4 className={`text-sm font-bold flex items-center gap-1.5 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  <FolderPlus className="w-4 h-4 text-emerald-400" />
                  <span>{t.createFolderTitle[lang]}</span>
                </h4>
                <button
                  onClick={() => {
                    setIsCreateFolderOpen(false);
                    setNewFolderName('');
                  }}
                  className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateFolderSubmit} className="p-5 space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold text-slate-700 block ${isUrdu ? 'text-right font-urdu' : ''}`}>
                    {t.folderNameLabel[lang]}
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Audit Receipts 2026"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className={`w-full bg-slate-50 border border-slate-200 text-xs rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 ${
                      isUrdu ? 'text-right font-urdu' : 'text-left font-sans'
                    }`}
                  />
                </div>

                <div className={`flex justify-end gap-2.5 pt-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateFolderOpen(false);
                      setNewFolderName('');
                    }}
                    className={`px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer ${
                      isUrdu ? 'font-urdu' : 'font-sans'
                    }`}
                  >
                    {t.cancel[lang]}
                  </button>
                  <button
                    type="submit"
                    disabled={creatingFolder || !newFolderName.trim()}
                    className={`px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 ${
                      isUrdu ? 'font-urdu' : 'font-sans'
                    }`}
                  >
                    {creatingFolder && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{t.create[lang]}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Safety Notice Badge in Footer */}
      <div className={`p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider ${
        isUrdu ? 'flex-row-reverse' : ''
      }`}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span className={isUrdu ? 'font-urdu' : ''}>
            {isUrdu ? 'محفوظ کلاؤڈ سیکیورٹی' : 'Secure Cloud Sandbox'}
          </span>
        </div>
        <span className="font-mono text-[9px] text-slate-400">v3.2 - API v3</span>
      </div>

    </div>
  );
}
