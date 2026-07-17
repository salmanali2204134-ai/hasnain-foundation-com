/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, Project } from '../types';
import { DICTIONARY, PROJECTS_DATA } from '../data';
import { Heart, ChevronDown, ChevronUp, Construction, ShieldAlert, Sparkles, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsProps {
  lang: Language;
  onDonateClick: (projectId?: string) => void;
}

export default function Projects({ lang, onDonateClick }: ProjectsProps) {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const isUrdu = lang === 'ur';

  const toggleExpand = (id: string) => {
    if (expandedProjectId === id) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(id);
    }
  };

  return (
    <section id="projects-section" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs sm:text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Construction className="w-3.5 h-3.5 text-emerald-700" />
            <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
              {isUrdu ? 'ترقیاتی و فلاحی منصوبے' : 'Active Interventions'}
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
            {DICTIONARY.projects.title[lang]}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-slate-500 text-sm sm:text-base mt-4 leading-relaxed ${
              isUrdu ? 'font-urdu leading-loose text-base' : 'font-sans'
            }`}
          >
            {DICTIONARY.projects.subtitle[lang]}
          </motion.p>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {PROJECTS_DATA.map((project, index) => {
            const isExpanded = expandedProjectId === project.id;
            const progress = project.progress || 0;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-none hover:border-slate-300"
              >
                <div>
                  {/* Image Container with tag */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title[lang]}
                      className="w-full h-full object-cover object-center transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    
                    {/* Category Floating Badge */}
                    <span className={`absolute top-4 ${
                      isUrdu ? 'right-4 font-urdu' : 'left-4 font-sans'
                    } px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-bold tracking-wider shadow-sm flex items-center gap-1`}>
                      {project.id === 'masjid-abdul-qadir' && <Building2 className="w-3.5 h-3.5" />}
                      {project.category[lang]}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className={`p-6 sm:p-8 ${isUrdu ? 'text-right' : 'text-left'}`}>
                    {/* Title */}
                    <h3 className={`text-xl sm:text-2xl font-bold text-slate-900 leading-tight ${
                      isUrdu ? 'font-urdu' : 'font-sans'
                    }`}>
                      {project.title[lang]}
                    </h3>

                    {/* Brief description */}
                    <p className={`text-slate-500 text-sm mt-4 leading-relaxed ${
                      isUrdu ? 'font-urdu leading-loose text-base text-slate-600' : 'font-sans'
                    }`}>
                      {project.description[lang]}
                    </p>

                    {/* Progress Bar representation */}
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className={`flex justify-between items-center text-xs font-bold mb-2 text-slate-500 ${
                        isUrdu ? 'flex-row-reverse' : ''
                      }`}>
                        <span className={isUrdu ? 'font-urdu' : 'font-sans'}>{DICTIONARY.projects.progressLabel[lang]}</span>
                        <span className="font-mono text-emerald-700">{progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-emerald-700 rounded-full"
                        />
                      </div>
                      
                      {/* Financial info */}
                      <div className={`flex justify-between items-center text-xs mt-3 ${
                        isUrdu ? 'flex-row-reverse' : ''
                      }`}>
                        <div>
                          <span className={`text-slate-400 font-semibold ${isUrdu ? 'font-urdu ml-1' : 'mr-1'}`}>
                            {DICTIONARY.projects.raised[lang]}:
                          </span>
                          <span className="font-bold text-slate-700 font-sans">{project.raised}</span>
                        </div>
                        <div>
                          <span className={`text-slate-400 font-semibold ${isUrdu ? 'font-urdu ml-1' : 'mr-1'}`}>
                            {DICTIONARY.projects.goal[lang]}:
                          </span>
                          <span className="font-bold text-slate-900 font-sans">{project.goal}</span>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible expanded milestones */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 pt-6 border-t border-slate-100 overflow-hidden"
                        >
                          <h4 className={`text-sm sm:text-base font-bold text-slate-900 mb-3 ${
                            isUrdu ? 'font-urdu' : 'font-sans'
                          }`}>
                            {isUrdu ? 'اہم تفاصیل و اہداف:' : 'Key Objectives & Milestones:'}
                          </h4>
                          <ul className="space-y-2.5">
                            {project.details[lang].map((detail, dIdx) => (
                              <li key={dIdx} className={`flex items-start gap-2 text-xs sm:text-sm text-slate-500 leading-relaxed ${
                                isUrdu ? 'flex-row-reverse text-right' : 'text-left'
                              }`}>
                                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span className={isUrdu ? 'font-urdu leading-loose text-slate-600' : 'font-sans'}>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer action buttons inside card */}
                <div className={`p-6 sm:p-8 pt-0 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-center ${
                  isUrdu ? 'sm:flex-row-reverse' : ''
                }`}>
                  {/* Expand Milestones Toggle */}
                  <button
                    onClick={() => toggleExpand(project.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors duration-200 text-xs sm:text-xs font-bold cursor-pointer"
                  >
                    <span>{DICTIONARY.projects.viewDetails[lang]}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Immediate Donate to Project Button */}
                  <button
                    onClick={() => onDonateClick(project.id)}
                    className={`w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-xs cursor-pointer hover:shadow-sm transition-all duration-200 ${
                      isUrdu ? 'font-urdu' : 'font-sans'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-white/95" />
                    <span>
                      {isUrdu ? 'اس پروجیکٹ کے لیے عطیہ کریں' : `Donate to this Project`}
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
