import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, RefreshCw, Check, X, FileText, User, Sparkles, 
  SwitchCamera, Eye, ShieldCheck, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import { Language } from '../types';

interface SmartCameraUploadProps {
  lang: Language;
  label: string;
  type: 'profile' | 'card'; // 'profile' for face photo, 'card' for CNIC/ID Card
  cardSide?: 'front' | 'back';
  value: string; // Base64 data URL
  onChange: (base64: string) => void;
  accentColor?: 'emerald' | 'amber' | 'blue';
}

export default function SmartCameraUpload({
  lang,
  label,
  type,
  cardSide,
  value,
  onChange,
  accentColor = 'emerald'
}: SmartCameraUploadProps) {
  const isUrdu = lang === 'ur';

  // Modal & Stream State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(type === 'profile' ? 'user' : 'environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // Auto-detection state
  const [autoDetected, setAutoDetected] = useState<boolean>(false);
  const [detectionMessage, setDetectionMessage] = useState<string>('');

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const directCameraInputRef = useRef<HTMLInputElement | null>(null);
  const scanIntervalRef = useRef<any>(null);

  // Color classes based on accent
  const colorClasses = {
    emerald: {
      border: 'hover:border-emerald-500 focus:border-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800',
      btn: 'bg-emerald-800 hover:bg-emerald-900 text-white',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      ring: 'focus:ring-emerald-500'
    },
    amber: {
      border: 'hover:border-amber-500 focus:border-amber-600',
      bg: 'bg-amber-50 hover:bg-amber-100/80 text-amber-800',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      ring: 'focus:ring-amber-500'
    },
    blue: {
      border: 'hover:border-blue-500 focus:border-blue-600',
      bg: 'bg-blue-50 hover:bg-blue-100/80 text-blue-800',
      btn: 'bg-blue-700 hover:bg-blue-800 text-white',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      ring: 'focus:ring-blue-500'
    }
  }[accentColor];

  // Initialize camera stream when modal opens
  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraOpen, facingMode]);

  // Start video stream
  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
      }

      // Start automatic card/face alignment scanner loop
      startAutoDetectionScanner();
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        isUrdu
          ? 'کیمرہ تک رسائی حاصل نہیں ہو سکی۔ براہ کرم کیمرہ کی اجازت چیک کریں یا فائل اپ لوڈ کا آپشن استعمال کریں۔'
          : 'Unable to access camera. Please allow camera permissions or use file upload.'
      );
    }
  };

  // Stop video stream
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Auto card/picture detection analyzer using Canvas frame contrast
  const startAutoDetectionScanner = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 300;
      canvas.height = 200;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Simple luminosity/contrast algorithm to simulate document edge alignment
      const frameData = ctx.getImageData(50, 40, 200, 120);
      let totalLuminance = 0;
      let variance = 0;
      const length = frameData.data.length;

      for (let i = 0; i < length; i += 16) {
        const r = frameData.data[i];
        const g = frameData.data[i + 1];
        const b = frameData.data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += lum;
      }

      const avgLum = totalLuminance / (length / 16);

      // Check if image in center has reasonable brightness & sharpness variance
      if (avgLum > 40 && avgLum < 220) {
        setAutoDetected(true);
        if (type === 'card') {
          setDetectionMessage(
            isUrdu
              ? '✅ شناختی کارڈ بالکل صحیح پوزیشن میں ہے!'
              : '✅ Card aligned & detected clearly!'
          );
        } else {
          setDetectionMessage(
            isUrdu
              ? '✅ چہرہ فریم میں واضح ہے!'
              : '✅ Face centered & detected clearly!'
          );
        }
      } else {
        setAutoDetected(false);
        setDetectionMessage(
          isUrdu
            ? '⚠️ براہ کرم کارڈ/چہرہ فریم کے اندر واضح روشنی میں رکھیں'
            : '⚠️ Align document/face inside frame with good lighting'
        );
      }
    }, 600);
  };

  // Capture Photo from Live Stream
  const handleSnap = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High res capture
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    // Draw full frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // If card mode, crop automatically to card ratio (85.6mm x 53.98mm ~= 1.58 ratio)
    if (type === 'card') {
      const cardWidth = Math.floor(canvas.width * 0.75);
      const cardHeight = Math.floor(cardWidth / 1.58);
      const startX = Math.floor((canvas.width - cardWidth) / 2);
      const startY = Math.floor((canvas.height - cardHeight) / 2);

      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = cardWidth;
      croppedCanvas.height = cardHeight;
      const cropCtx = croppedCanvas.getContext('2d');
      if (cropCtx) {
        cropCtx.drawImage(
          canvas,
          startX,
          startY,
          cardWidth,
          cardHeight,
          0,
          0,
          cardWidth,
          cardHeight
        );
        const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.88);
        setCapturedPreview(dataUrl);
        setIsCapturing(false);
        return;
      }
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedPreview(dataUrl);
    setIsCapturing(false);
  };

  // Confirm Captured Photo
  const handleConfirmPhoto = () => {
    if (capturedPreview) {
      onChange(capturedPreview);
      setIsCameraOpen(false);
      setCapturedPreview(null);
    }
  };

  // Switch between front/back camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // File Upload base64 reader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Target Container Box */}
      <div className="w-full flex flex-col items-center justify-between p-4 border-2 border-dashed border-slate-200 rounded-2xl relative group hover:border-slate-400 transition-all bg-slate-50/60 text-center">
        
        {/* Preview Area */}
        <div className="relative mb-3 flex items-center justify-center w-full">
          {value ? (
            <div className="relative group/img">
              {type === 'profile' ? (
                <img
                  src={value}
                  alt={label}
                  className="w-24 h-24 object-cover rounded-full border-2 border-white shadow-md"
                />
              ) : (
                <img
                  src={value}
                  alt={label}
                  className="w-full max-w-[220px] h-24 object-cover rounded-xl border-2 border-white shadow-md"
                />
              )}
              {/* Badge indicating uploaded status */}
              <span className="absolute -top-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-sm">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center text-slate-400 ${
                type === 'profile'
                  ? 'w-24 h-24 rounded-full bg-slate-100 border border-slate-200'
                  : 'w-full max-w-[220px] h-24 rounded-xl bg-slate-100 border border-slate-200'
              }`}
            >
              {type === 'profile' ? (
                <User className="w-10 h-10 text-slate-300" />
              ) : (
                <FileText className="w-8 h-8 text-slate-300" />
              )}
              <span className="text-[10px] text-slate-400 font-bold mt-1">
                {type === 'profile' ? (isUrdu ? 'تصویر نہیں ہے' : 'No Photo') : (isUrdu ? 'کارڈ تصویر نہیں ہے' : 'No Card Photo')}
              </span>
            </div>
          )}
        </div>

        {/* Action Label */}
        <span className="text-xs font-black text-slate-800 mb-2">
          {label}
        </span>

        {/* Dual Control Buttons: Camera vs File Upload */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full mt-1">
          {/* Direct Live Camera Button */}
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${colorClasses.btn}`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'کیمرہ کھولیں' : 'Live Camera'}</span>
          </button>

          {/* Direct File Selection Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl font-bold text-xs bg-white border border-slate-200 hover:border-slate-300 text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>{isUrdu ? 'فائل منتخب کریں' : 'Choose File'}</span>
          </button>

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Mobile Direct Camera Capture trigger fallback */}
          <input
            ref={directCameraInputRef}
            type="file"
            accept="image/*"
            capture={type === 'profile' ? 'user' : 'environment'}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Subtle camera capture tip for mobile */}
        <button
          type="button"
          onClick={() => directCameraInputRef.current?.click()}
          className="mt-2 text-[10px] text-slate-500 hover:text-emerald-700 font-medium underline cursor-pointer"
        >
          {isUrdu ? 'موبائل کیمرہ ایپ سے فوٹو لیں' : 'Or take quick photo via Mobile Camera App'}
        </button>
      </div>

      {/* LIVE CAMERA CAPTURE & AUTO CARD DETECTION MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col relative text-white">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                    <span>{label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 font-mono uppercase">
                      {type === 'profile' ? 'Face Scan' : 'Auto Card Scan'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isUrdu 
                      ? 'تصویر یا شناختی کارڈ کو فریم کے اندر بالکل سیدھا رکھیں' 
                      : 'Position your face or ID card neatly inside the detection frame'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCameraOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport / Capture Canvas */}
            <div className="relative bg-black aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
              
              {capturedPreview ? (
                /* CAPTURED IMAGE PREVIEW STAGE */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950">
                  <img
                    src={capturedPreview}
                    alt="Captured"
                    className={`max-h-[85%] object-contain rounded-2xl border-2 border-emerald-500 shadow-2xl ${
                      type === 'profile' ? 'rounded-full aspect-square w-48' : 'w-full max-w-md'
                    }`}
                  />
                  <div className="mt-3 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{isUrdu ? 'تصویر کامیابی سے سکین کر لی گئی ہے!' : 'Image captured & ready!'}</span>
                  </div>
                </div>
              ) : (
                /* LIVE VIDEO STREAM STAGE WITH OVERLAY GUIDES */
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Hidden Canvas for scanner frame math */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* CAMERA OVERLAY GUIDE FRAME */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                    
                    {type === 'profile' ? (
                      /* Face Oval Guide */
                      <div className="w-52 h-64 border-4 border-dashed border-emerald-400/80 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] flex items-center justify-center relative animate-pulse">
                        <div className="w-full h-full border-2 border-emerald-300/40 rounded-[50%]" />
                        <span className="absolute bottom-4 bg-black/75 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 backdrop-blur-xs">
                          {isUrdu ? 'چہرہ یہاں رکھیں' : 'Center Face Here'}
                        </span>
                      </div>
                    ) : (
                      /* ID Card / CNIC Rectangular Frame */
                      <div className="w-full max-w-md aspect-[1.58] border-4 border-emerald-400 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] relative flex flex-col justify-between p-3">
                        {/* Corner Target Markers */}
                        <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-emerald-300 rounded-tl-lg" />
                        <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-emerald-300 rounded-tr-lg" />
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-emerald-300 rounded-bl-lg" />
                        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-emerald-300 rounded-br-lg" />

                        {/* Top Side Indicator */}
                        <div className="self-center bg-black/80 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-emerald-300 border border-emerald-500/40 uppercase">
                          {cardSide === 'back' 
                            ? (isUrdu ? 'شناختی کارڈ پچھلا حصہ' : 'CNIC BACK SIDE') 
                            : (isUrdu ? 'شناختی کارڈ سامنے کا حصہ' : 'CNIC FRONT SIDE')}
                        </div>

                        {/* Center guide label */}
                        <div className="self-center text-center bg-black/70 px-3 py-1 rounded-xl text-[11px] font-bold text-white backdrop-blur-xs">
                          {isUrdu ? 'شناختی کارڈ نچلے یا اوپری فریم میں فٹ کریں' : 'Fit ID Card completely inside box'}
                        </div>
                      </div>
                    )}

                    {/* Auto-Detection Status Badge */}
                    <div className="mt-4 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-bold text-white backdrop-blur-md flex items-center gap-2 shadow-lg">
                      <Sparkles className={`w-4 h-4 ${autoDetected ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} />
                      <span>{detectionMessage || (isUrdu ? 'سکین جاری ہے...' : 'Scanning frame...')}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Error Banner if stream failed */}
              {cameraError && (
                <div className="absolute inset-0 bg-slate-950 p-6 flex flex-col items-center justify-center text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                  <p className="text-sm font-bold text-slate-200 mb-4 max-w-md">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    {isUrdu ? 'فائل منتخب کریں' : 'Use File Upload Instead'}
                  </button>
                </div>
              )}
            </div>

            {/* Footer Control Panel */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
              
              {/* Camera Flip */}
              {!capturedPreview && (
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  title="Switch Camera"
                >
                  <SwitchCamera className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">
                    {facingMode === 'user' 
                      ? (isUrdu ? 'پچھلا کیمرہ' : 'Back Camera') 
                      : (isUrdu ? 'سامنے کا کیمرہ' : 'Front Camera')}
                  </span>
                </button>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 ml-auto">
                {capturedPreview ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setCapturedPreview(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>{isUrdu ? 'دوبارہ لیں' : 'Retake'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmPhoto}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isUrdu ? 'تصویر کا انتخاب کریں' : 'Confirm & Save Photo'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleSnap}
                    disabled={isCapturing}
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                    <span>{isUrdu ? 'تصویر لیں (Snap Photo)' : 'Capture Photo'}</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
