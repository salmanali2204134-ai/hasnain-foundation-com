/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types';

interface LogoProps {
  lang: Language;
  variant?: 'header' | 'footer' | 'emblem' | 'large';
  className?: string;
}

export default function Logo({ lang, variant = 'header', className = '' }: LogoProps) {
  const isUrdu = lang === 'ur';

  // Premium, high-fidelity SVG of the official circular golden-seal Hasnain Foundation logo
  const renderOfficialEmblemSVG = (sizeClass = "w-12 h-12") => (
    <svg
      viewBox="0 0 500 500"
      className={`${sizeClass} select-none transition-transform duration-300 hover:scale-105 filter drop-shadow-md`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Realistic Premium 3D Metallic Gold Gradient */}
        <linearGradient id="emblem-gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9E6" /> {/* Highlight */}
          <stop offset="15%" stopColor="#F5D061" />
          <stop offset="35%" stopColor="#D4AF37" /> {/* Pure Gold */}
          <stop offset="65%" stopColor="#AA7C11" /> {/* Shadow Gold */}
          <stop offset="85%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8A640F" />
        </linearGradient>

        <linearGradient id="emblem-gold-light" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="30%" stopColor="#DAA520" />
          <stop offset="70%" stopColor="#F4D03F" />
          <stop offset="100%" stopColor="#FFFDF3" />
        </linearGradient>

        <linearGradient id="emblem-gold-dark" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9A7B1C" />
          <stop offset="50%" stopColor="#70540C" />
          <stop offset="100%" stopColor="#4A3605" />
        </linearGradient>

        {/* Deep Royal Sapphire Blue Radial Gradient for Background */}
        <radialGradient id="sapphire-radial" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#1E3E75" />
          <stop offset="45%" stopColor="#0B1D3A" />
          <stop offset="85%" stopColor="#050C1B" />
          <stop offset="100%" stopColor="#02050D" />
        </radialGradient>

        {/* Subtle drop shadows to elevate elements */}
        <filter id="gold-emboss" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.65" />
        </filter>

        <filter id="text-emboss" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="1.5" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.8" />
        </filter>

        {/* Dynamic circular text paths */}
        {/* Top Text Path (Sweeps clockwise over top, left-to-right) */}
        <path
          id="text-path-top"
          d="M 62,250 A 188,188 0 0,1 438,250"
          fill="none"
        />

        {/* Bottom Text Path (Sweeps counter-clockwise under bottom, left-to-right for upright letters) */}
        <path
          id="text-path-bottom"
          d="M 68,250 A 182,182 0 0,0 432,250"
          fill="none"
        />
      </defs>

      {/* Outer Golden Beaded Circular Border */}
      <circle cx="250" cy="250" r="242" fill="url(#emblem-gold-dark)" />
      <circle cx="250" cy="250" r="236" fill="url(#emblem-gold-primary)" />
      <circle cx="250" cy="250" r="226" fill="url(#emblem-gold-dark)" />

      {/* Decorative Outer Beads (Circular pattern of 90 small gold spheres) */}
      <g fill="url(#emblem-gold-primary)" filter="url(#gold-emboss)">
        {Array.from({ length: 85 }).map((_, i) => {
          const angle = (i * 360) / 85;
          const rad = (angle * Math.PI) / 180;
          const x = 250 + Math.cos(rad) * 231;
          const y = 250 + Math.sin(rad) * 231;
          return <circle key={i} cx={x} cy={y} r="2.8" />;
        })}
      </g>

      {/* Inner Rim */}
      <circle cx="250" cy="250" r="223" fill="url(#emblem-gold-primary)" />
      <circle cx="250" cy="250" r="215" fill="url(#emblem-gold-dark)" />

      {/* Central Sapphire Blue Shield Background */}
      <circle cx="250" cy="250" r="212" fill="url(#sapphire-radial)" />

      {/* Inner Golden Rib */}
      <circle cx="250" cy="250" r="156" stroke="url(#emblem-gold-primary)" strokeWidth="3" fill="none" opacity="0.85" />

      {/* =================================================================== */}
      {/* 1. RADIATING SUNRAYS (Golden lines from center behind mosque) */}
      {/* =================================================================== */}
      <g stroke="url(#emblem-gold-light)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" filter="url(#gold-emboss)">
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = -180 + (i * 180) / 31; // strictly semi-circle over the top half
          const rad = (angle * Math.PI) / 180;
          const startRadius = 75;
          const endRadius = 150;
          const x1 = 250 + Math.cos(rad) * startRadius;
          const y1 = 225 + Math.sin(rad) * startRadius;
          const x2 = 250 + Math.cos(rad) * endRadius;
          const y2 = 225 + Math.sin(rad) * endRadius;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* =================================================================== */}
      {/* 2. MOSQUE ARCHITECTURE (Domes, Pillars & Minarets) */}
      {/* =================================================================== */}
      <g filter="url(#gold-emboss)" fill="url(#emblem-gold-primary)">
        
        {/* Symmetrical Left Dome */}
        <path d="M 180,230 C 180,210 192,200 200,200 C 208,200 220,210 220,230 Z" fill="url(#emblem-gold-light)" />
        <rect x="180" y="230" width="40" height="15" rx="1" fill="url(#emblem-gold-primary)" />
        {/* Left Dome Spire */}
        <line x1="200" y1="200" x2="200" y2="185" stroke="url(#emblem-gold-primary)" strokeWidth="2.5" />
        <circle cx="200" cy="184" r="2" />

        {/* Symmetrical Right Dome */}
        <path d="M 280,230 C 280,210 292,200 300,200 C 308,200 320,210 320,230 Z" fill="url(#emblem-gold-light)" />
        <rect x="280" y="230" width="40" height="15" rx="1" fill="url(#emblem-gold-primary)" />
        {/* Right Dome Spire */}
        <line x1="300" y1="200" x2="300" y2="185" stroke="url(#emblem-gold-primary)" strokeWidth="2.5" />
        <circle cx="300" cy="184" r="2" />

        {/* Central Large Bulbous Golden Dome */}
        <path d="M 215,225 C 215,175 235,145 250,145 C 265,145 285,175 285,225 Z" fill="url(#emblem-gold-light)" />
        <rect x="215" y="222" width="70" height="12" rx="1" />
        
        {/* Central Spire Pin & Crescent */}
        <line x1="250" y1="145" x2="250" y2="120" stroke="url(#emblem-gold-light)" strokeWidth="3.5" />
        <circle cx="250" cy="118" r="3" />
        <path d="M 250,118 C 250,112 255,108 260,110 C 255,112 255,117 258,120 C 261,123 255,125 250,118" fill="url(#emblem-gold-light)" />

        {/* Main Mosque Facade Body Block */}
        <path d="M 175,242 H 325 V 275 H 175 Z" />
        
        {/* Symmetric Arched Windows on Facade */}
        <path d="M 190,275 V 252 Q 190,246 195,246 Q 200,246 200,252 V 275 Z" fill="url(#emblem-gold-dark)" />
        <path d="M 205,275 V 252 Q 205,246 210,246 Q 215,246 215,252 V 275 Z" fill="url(#emblem-gold-dark)" />
        
        {/* Central Portal pointed gate */}
        <path d="M 232,275 V 250 Q 232,240 250,238 Q 268,240 268,250 V 275 Z" fill="url(#emblem-gold-dark)" />
        <path d="M 238,275 V 253 Q 238,245 250,244 Q 262,245 262,253 V 275 Z" fill="url(#emblem-gold-light)" />

        <path d="M 285,275 V 252 Q 285,246 290,246 Q 295,246 295,252 V 275 Z" fill="url(#emblem-gold-dark)" />
        <path d="M 300,275 V 252 Q 300,246 305,246 Q 310,246 310,252 V 275 Z" fill="url(#emblem-gold-dark)" />

        {/* Symmetrical Corner Columns */}
        <rect x="171" y="235" width="6" height="40" fill="url(#emblem-gold-light)" />
        <rect x="323" y="235" width="6" height="40" fill="url(#emblem-gold-light)" />

        {/* Right Grand Minaret (resembling original logo architecture) */}
        <g>
          {/* Minaret Base Pillar */}
          <path d="M 326,275 H 344 V 230 H 326 Z" fill="url(#emblem-gold-primary)" />
          {/* First Stage Balcony */}
          <path d="M 323,230 H 347 V 222 H 323 Z" fill="url(#emblem-gold-light)" />
          {/* Middle Pillar Shaft */}
          <path d="M 329,222 H 341 V 165 H 329 Z" fill="url(#emblem-gold-primary)" />
          {/* Upper Balcony */}
          <path d="M 326,165 H 344 V 158 H 326 Z" fill="url(#emblem-gold-light)" />
          {/* Upper Lantern pillar */}
          <path d="M 331,158 H 339 V 142 H 331 Z" fill="url(#emblem-gold-primary)" />
          {/* Cupola Dome top */}
          <path d="M 330,142 C 328,131 342,131 340,142 Z" fill="url(#emblem-gold-light)" />
          {/* Spire Pin */}
          <line x1="335" y1="131" x2="335" y2="114" stroke="url(#emblem-gold-light)" strokeWidth="2" />
          <circle cx="335" cy="113" r="1.5" />
        </g>
      </g>

      {/* =================================================================== */}
      {/* 3. URDU NASTALIQ CALLIGRAPHY (Golden "حسنین فاؤنڈیشن" centered in seal) */}
      {/* =================================================================== */}
      <g filter="url(#text-emboss)" fill="url(#emblem-gold-primary)">
        <text
          x="250"
          y="320"
          textAnchor="middle"
          style={{
            fontFamily: '"Noto Nastaliq Urdu", "Noto Naskh Arabic", "Urdu Typesetting", serif',
            fontSize: "44px",
            fontWeight: "700"
          }}
        >
          حسنین فاؤنڈیشن
        </text>
      </g>

      {/* =================================================================== */}
      {/* 4. OPEN HOLY QURAN ON REHAL STAND (Bottom centerpiece in seal) */}
      {/* =================================================================== */}
      <g filter="url(#gold-emboss)" stroke="url(#emblem-gold-primary)" strokeLinecap="round" strokeLinejoin="round">
        {/* Rehal bookstand bottom overlap */}
        <path d="M 205,395 L 250,378 L 295,395" fill="none" strokeWidth="4.5" />
        <path d="M 215,390 L 250,380 L 285,390" fill="none" strokeWidth="3" />
        <path d="M 220,402 L 250,384 L 280,402" fill="none" strokeWidth="3.5" />

        {/* Quran Left Page */}
        <path
          d="M 250,375 C 232,352 210,352 198,361 L 198,340 C 210,331 232,331 250,354 Z"
          fill="url(#emblem-gold-light)"
          stroke="url(#emblem-gold-dark)"
          strokeWidth="1.5"
        />

        {/* Quran Right Page */}
        <path
          d="M 250,375 C 268,352 290,352 302,361 L 302,340 C 290,331 268,331 250,354 Z"
          fill="url(#emblem-gold-light)"
          stroke="url(#emblem-gold-dark)"
          strokeWidth="1.5"
        />

        {/* Central bookmark / Spine divide */}
        <line x1="250" y1="345" x2="250" y2="378" stroke="url(#emblem-gold-dark)" strokeWidth="3.5" />

        {/* Gold page text simulation lines */}
        <path d="M 210,349 Q 223,342 236,350" fill="none" stroke="url(#emblem-gold-dark)" strokeWidth="1.2" opacity="0.8" />
        <path d="M 208,355 Q 222,348 238,356" fill="none" stroke="url(#emblem-gold-dark)" strokeWidth="1.2" opacity="0.8" />
        <path d="M 206,361 Q 221,354 239,362" fill="none" stroke="url(#emblem-gold-dark)" strokeWidth="1.2" opacity="0.8" />

        <path d="M 264,350 Q 277,342 290,349" fill="none" stroke="url(#emblem-gold-dark)" strokeWidth="1.2" opacity="0.8" />
        <path d="M 262,356 Q 278,348 292,355" fill="none" stroke="url(#emblem-gold-dark)" strokeWidth="1.2" opacity="0.8" />
        <path d="M 261,362 Q 279,354 294,361" fill="none" stroke="url(#emblem-gold-dark)" strokeWidth="1.2" opacity="0.8" />
      </g>

      {/* =================================================================== */}
      {/* 5. TOP RING TEXT: "HASNAIN FOUNDATION" (Symmetric Gold letters) */}
      {/* =================================================================== */}
      <g filter="url(#text-emboss)" fill="url(#emblem-gold-primary)">
        <text
          fontSize="28.5px"
          fontWeight="900"
          letterSpacing="4"
          style={{
            fontFamily: '"Cinzel", "Times New Roman", "Georgia", "Playfair Display", serif',
          }}
        >
          <textPath href="#text-path-top" startOffset="50%" textAnchor="middle">
            HASNAIN FOUNDATION
          </textPath>
        </text>
      </g>

      {/* Left and Right Golden Separator Dots in Ring */}
      <circle cx="85" cy="250" r="6" fill="url(#emblem-gold-primary)" filter="url(#gold-emboss)" />
      <circle cx="415" cy="250" r="6" fill="url(#emblem-gold-primary)" filter="url(#gold-emboss)" />

      {/* =================================================================== */}
      {/* 6. BOTTOM RING TEXT: "KAR NO. 263" (Symmetric Gold letters) */}
      {/* =================================================================== */}
      <g filter="url(#text-emboss)" fill="url(#emblem-gold-primary)">
        <text
          fontSize="26.5px"
          fontWeight="900"
          letterSpacing="5"
          style={{
            fontFamily: '"Cinzel", "Times New Roman", "Georgia", "Playfair Display", serif',
          }}
        >
          {/* Note: sweep-flag=0 curves under the bottom so text reads left-to-right upright */}
          <textPath href="#text-path-bottom" startOffset="50%" textAnchor="middle">
            KAR NO. 263
          </textPath>
        </text>
      </g>
    </svg>
  );

  if (variant === 'emblem') {
    return renderOfficialEmblemSVG(className || "w-11 h-11");
  }

  // Beautiful large logo for landing displays or heroic blocks
  if (variant === 'large') {
    return (
      <div className={`flex flex-col items-center text-center p-6 bg-slate-950 rounded-2xl border border-slate-900 shadow-xl ${className}`}>
        {renderOfficialEmblemSVG("w-48 h-48 sm:w-56 h-56")}
        
        <div className="mt-6 space-y-2">
          <h1 className="font-sans font-black tracking-widest text-2xl sm:text-3xl leading-none">
            <span className="text-[#38bdf8]">HASNAIN</span> <span className="text-[#f59e0b]">FOUNDATION</span>
          </h1>
          
          <h2 className="font-urdu text-3xl font-semibold text-emerald-400 leading-relaxed pt-2">
            حسنین فاؤنڈیشن
          </h2>

          <p className="font-sans font-bold text-xs uppercase tracking-widest text-slate-500 mt-2">
            Serving Humanity, Spreading Hope
          </p>
        </div>
      </div>
    );
  }

  const headerTextStyle = variant === 'header' 
    ? 'text-slate-900' 
    : 'text-white';

  const subtitleTextStyle = variant === 'header'
    ? 'text-emerald-700'
    : 'text-slate-400';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className} ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
      {renderOfficialEmblemSVG(variant === 'header' ? "w-11 h-11 sm:w-12 h-12" : "w-12 h-12 sm:w-14 h-14")}
      
      <div className={`flex flex-col ${isUrdu ? 'items-end text-right' : 'items-start text-left'}`}>
        <h1 className={`font-black tracking-tight leading-none text-base sm:text-lg md:text-xl font-sans ${headerTextStyle}`}>
          {isUrdu ? (
            <span className="font-urdu text-lg sm:text-xl tracking-normal leading-tight font-semibold text-emerald-800">حسنین فاؤنڈیشن</span>
          ) : (
            <span className="flex items-center gap-1.5 font-sans font-black tracking-wider text-sm sm:text-base">
              <span className="text-[#0284c7]">HASNAIN</span> <span className="text-[#ca8a04]">FOUNDATION</span>
            </span>
          )}
        </h1>
        <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1 ${subtitleTextStyle}`}>
          {isUrdu ? (
            <span className="font-urdu text-xs tracking-normal leading-none text-emerald-600">انسانیت کی خدمت، ہمارا عزم</span>
          ) : (
            "Serving Humanity, Spreading Hope"
          )}
        </p>
      </div>
    </div>
  );
}
