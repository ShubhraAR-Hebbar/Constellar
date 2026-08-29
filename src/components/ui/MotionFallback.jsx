import React from 'react'
import { profile, experience, projects, leadership, certifications } from '../../data/content'
import { Mail, Phone, MapPin, GraduationCap, Briefcase, Sparkles, Award, ExternalLink, Layers, CheckCircle2 } from 'lucide-react'

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export default function MotionFallback() {
  return (
    <div className="relative min-h-screen bg-[#05060f] text-slate-100 px-6 py-20 max-w-5xl mx-auto space-y-20">
      {/* 1. HERO */}
      <section className="text-center space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Sparkles size={14} className="text-cyan-400" />
          <span>ACCESSIBLE STATIC PORTFOLIO</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-serif-hero font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-300">
          {profile.name}
        </h1>
        <h2 className="text-xl sm:text-2xl font-sans-ui text-cyan-300 font-medium">
          {profile.title}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5"><GraduationCap size={15} className="text-cyan-400" /> MCA candidate</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><MapPin size={15} className="text-cyan-400" /> {profile.location}</span>
        </div>
      </section>

      {/* 2. ABOUT */}
      <section className="glass-panel-glow p-8 rounded-3xl border border-cyan-500/30 space-y-4">
        <h3 className="text-xl font-serif-hero font-bold text-cyan-300 flex items-center gap-2">
          <span>About & Background</span>
        </h3>
        <p className="text-slate-300 leading-relaxed font-sans-ui text-sm sm:text-base">
          {profile.summary}
        </p>
      </section>

      {/* 3. EXPERIENCE */}
      <section className="space-y-6">
        <h3 className="text-2xl font-serif-hero font-bold text-white flex items-center gap-2">
          <Briefcase className="text-cyan-400" size={20} />
          <span>Experience</span>
        </h3>
        <div className="space-y-6">
          {experience.map((exp, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-lg font-bold text-white">{exp.company} — <span className="text-cyan-300 font-normal">{exp.role}</span></h4>
                <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">{exp.dates}</span>
              </div>
              <div className="space-y-2">
                {exp.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROJECTS */}
      <section className="space-y-6">
        <h3 className="text-2xl font-serif-hero font-bold text-white flex items-center gap-2">
          <Layers className="text-orange-400" size={20} />
          <span>Featured Projects</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-700/60 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{proj.name}</h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.stack.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-cyan-200 border border-slate-700">{s}</span>
                  ))}
                </div>
              </div>
              <a href={proj.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline">
                <GithubIcon size={14} /> View Code
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ACHIEVEMENTS & CERTS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 space-y-4">
          <h4 className="text-lg font-bold text-purple-300 flex items-center gap-2">
            <Award size={18} /> Leadership Roles
          </h4>
          <div className="space-y-3">
            {leadership.map((l, i) => (
              <div key={i} className="text-xs space-y-1">
                <div className="font-bold text-slate-100">{l.role} | {l.organization}</div>
                <div className="text-slate-400">{l.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 space-y-4">
          <h4 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
            <Award size={18} /> Certifications
          </h4>
          <div className="space-y-2.5">
            {certifications.map((c, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="font-bold text-slate-200">{c.title}</span>
                <span className="text-emerald-400 font-mono">{c.year}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT */}
      <section className="glass-panel-glow p-8 rounded-3xl border border-cyan-400/40 text-center space-y-6">
        <h3 className="text-3xl font-serif-hero font-bold text-white">Let’s Build Something</h3>
        <p className="text-slate-300 text-sm font-sans-ui max-w-md mx-auto">{profile.email} • {profile.phone}</p>
        <div className="flex justify-center gap-4">
          <a href={`mailto:${profile.email}`} className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold font-mono text-xs uppercase">Contact Me</a>
        </div>
      </section>
    </div>
  )
}
