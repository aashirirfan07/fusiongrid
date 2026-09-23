import { useEffect, useState } from 'react';
import {
  ShieldCheck, Lock, ArrowRight, FileCheck, Workflow, Bell,
  Zap, CheckCircle2, Building2,
  HeartPulse, Users, Landmark, User, Network, Database,
  Activity, Globe, Cpu, ChevronRight, Sparkles, FileText, Check,
  Layers, MapPin, Radio, KeyRound, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { prototypeMetrics } from '@/data/mockData';

interface LandingProps {
  navigate: (to: string) => void;
}

const featureCards = [
  {
    icon: Network,
    badge: 'LIVE',
    badgeType: 'live',
    title: 'Seamless Integration',
    description: 'Seamless integration and department data exchange with zero friction across legacy systems.',
    deptColors: ['bg-blue-500', 'bg-indigo-500', 'bg-sky-400'],
    stat: '24+ Active Depts',
  },
  {
    icon: Lock,
    badge: 'SECURE',
    badgeType: 'secure',
    title: 'Secure Data Exchange',
    description: 'Secure data exchange that binds purpose-driven consents, cryptographic tokens, and immutable audit logs.',
    deptColors: ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500'],
    stat: '100% Encrypted',
  },
  {
    icon: Users,
    badge: 'LIVE',
    badgeType: 'live',
    title: 'Citizen-Centric Services',
    description: 'Citizen-centric services to eliminate repeated paperwork, pre-fill verified credentials, and track status.',
    deptColors: ['bg-amber-500', 'bg-orange-500', 'bg-rose-500'],
    stat: '1-Click Verification',
  },
  {
    icon: Activity,
    badge: 'LIVE',
    badgeType: 'live',
    title: 'AI-Powered Analytics',
    description: 'AI-powered telemetry to forecast processing bottlenecks, detect data anomalies, and enforce SLAs in real-time.',
    deptColors: ['bg-purple-500', 'bg-violet-500', 'bg-fuchsia-500'],
    stat: '0.02% Anomaly Rate',
  },
];

const departmentTiles = [
  {
    id: 'health',
    title: 'e-Health Records',
    icon: HeartPulse,
    bgClass: 'bg-[#0B1528] border-blue-500/30 text-white',
    badge: 'LIVE',
    desc: 'e-Health records of state agencies with cryptographic consent validation.',
    stat1: '103',
    label1: 'Connected',
    stat2: '96.2%',
    label2: 'Connection Sync',
    accentColor: 'text-blue-400',
  },
  {
    id: 'identity',
    title: 'Unified Identity',
    icon: ShieldCheck,
    bgClass: 'bg-[#06201B] border-emerald-500/30 text-white',
    badge: 'LIVE',
    desc: 'Unified identity, Aadhaar & DigiLocker state verification connectors.',
    stat1: '25M+',
    label1: 'Verified Citizens',
    stat2: '24',
    label2: 'State Connectors',
    accentColor: 'text-emerald-400',
  },
  {
    id: 'logistics',
    title: 'Smart City Logistics',
    icon: Building2,
    bgClass: 'bg-[#0A1A24] border-cyan-500/30 text-white',
    badge: 'LIVE',
    desc: 'Smart city municipal workflows, transport permits, and utilities.',
    stat1: '186',
    label1: 'Agencies',
    stat2: '98.4%',
    label2: 'Live Uptime',
    accentColor: 'text-cyan-400',
  },
  {
    id: 'fiscal',
    title: 'Fiscal Transparency',
    icon: Landmark,
    bgClass: 'bg-[#201808] border-amber-500/30 text-white',
    badge: 'LIVE',
    desc: 'Revenue and treasury department direct disbursement and audit tracking.',
    stat1: '302',
    label1: 'Connected',
    stat2: '24',
    label2: 'Stream Feeds',
    accentColor: 'text-amber-400',
  },
];

const testimonials = [
  {
    quote: 'FusionGrid connected our entire health & revenue databases within weeks with zero security leaks or schema alterations.',
    author: 'Ashir',
    role: 'Lead System Architect & Engineering Lead',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ashir&hair=short01,short02,short03,short04,short05&backgroundColor=b6e3f4',
  },
  {
    quote: 'Patent-backed security protocol and consent architecture saved our citizens 70% of in-person visits to government offices.',
    author: 'Sadiya',
    role: 'Principal Security & DPDP Compliance Officer',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sadiya&hair=long01,long02,long03,long04,long05&backgroundColor=ffd5dc',
  },
  {
    quote: 'Automated cross-departmental verification turned a 15-day application process into an instant, 4-minute approval.',
    author: 'Nahid',
    role: 'Chief Technology Officer & Interoperability Lead',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=NahidGirl&hair=long06,long07,long08,long09,long10&backgroundColor=c0aede',
  },
  {
    quote: 'Handling high-concurrency mTLS gateway traffic seamlessly across 120M+ citizen records with sub-second SLA response times.',
    author: 'Ashif',
    role: 'Distributed Systems & Gateway Architect',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ashif&hair=short06,short07,short08,short09,short10&backgroundColor=d1d4f9',
  },
  {
    quote: 'The canonical transformation bus eliminated weeks of painful manual data reconciliation between legacy department databases.',
    author: 'Ekrama',
    role: 'Canonical Schema & Data Governance Specialist',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=EkramaBoy&hair=short01,short02,short03,short04,short05&backgroundColor=ffdfbf',
  },
  {
    quote: 'Citizens now have a single, unified digital timeline and complete cryptographic control over their personal data consent.',
    author: 'Mariyam',
    role: 'Citizen Experience & Product Strategy Lead',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MariyamGirl&hair=long01,long02,long03,long04,long05&backgroundColor=c1f2dc',
  },
];

const insights = [
  {
    title: 'Future of Digital Government in 2026',
    tag: 'Whitepaper',
    desc: 'How zero-trust interoperability bridges citizen journeys across disjointed ministries.',
    date: 'Oct 2026',
  },
  {
    title: 'Cryptographic Consent Architecture',
    tag: 'Security Deep-Dive',
    desc: 'DPDP Act compliance through purpose-bound one-time token authorization.',
    date: 'Sep 2026',
  },
  {
    title: 'Real-Time Telemetry & SLA Enforcement',
    tag: 'Case Study',
    desc: 'Preventing bureaucratic bottlenecks through AI-orchestrated event streaming.',
    date: 'Aug 2026',
  },
];

export function LandingPage({ navigate }: LandingProps) {
  const [animatedMetrics, setAnimatedMetrics] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    prototypeMetrics.forEach((m, i) => {
      const t = setTimeout(() => {
        let current = 0;
        const step = Math.max(1, Math.ceil(m.value / 40));
        const interval = setInterval(() => {
          current += step;
          if (current >= m.value) {
            current = m.value;
            clearInterval(interval);
          }
          setAnimatedMetrics((prev) => {
            const next = [...prev];
            next[i] = current;
            return next;
          });
        }, 25);
        intervals.push(interval);
      }, 300 + i * 150);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. VIBRANT AMBIENT AURORA MESH GLOWS (Matching Reference Image)            */}
      {/* Placed in z-0 container so glows bloom behind the frosted glass cards     */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Top Left Hero Bloom (Cyan / Sky) */}
        <div className="absolute -top-32 -left-28 w-[720px] h-[720px] rounded-full aurora-orb-cyan" />
        {/* Top Right Hero / Telemetry Bloom (Emerald Mint) */}
        <div className="absolute -top-16 right-[2%] w-[700px] h-[700px] rounded-full aurora-orb-green" />
        {/* Mid-Right Sunset Amber Bloom */}
        <div className="absolute top-[480px] -right-28 w-[680px] h-[680px] rounded-full aurora-orb-amber" />
        {/* Mid-Left Purple/Cyan Bloom */}
        <div className="absolute top-[850px] -left-32 w-[650px] h-[650px] rounded-full aurora-orb-purple" />
        {/* Mid-Page Security Section Bloom */}
        <div className="absolute top-[1400px] right-[5%] w-[680px] h-[680px] rounded-full aurora-orb-cyan" />
        <div className="absolute top-[1650px] -left-20 w-[620px] h-[620px] rounded-full aurora-orb-green" />
        {/* Bottom CTA Amber Bloom */}
        <div className="absolute top-[2200px] right-[10%] w-[750px] h-[750px] rounded-full aurora-orb-amber" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Hero Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-950 leading-[1.1] max-w-4xl mx-auto">
            Connecting Government,
            <br />
            Empowering Citizens.
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Connecting government, interoperability and citizen services platform to
            orchestrate and unceasingly verify data with zero friction.
          </p>

          {/* Center Call to Action Pill Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2.5 rounded-full bg-slate-950 px-8 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-xl shadow-slate-950/20 hover:bg-slate-900 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 uppercase tracking-wider"
            >
              Explore Interoperability
              <ArrowRight className="h-4 w-4 text-emerald-400" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 2. CENTERPIECE: "FusionGrid at a Glance" TELEMETRY DASHBOARD SHOWCASE     */}
          {/* ========================================================================= */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="glass-dark-card rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden border border-white/10 shadow-2xl">
              {/* Subtle internal glowing grid */}
              <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
              <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left Telemetry Column */}
                <div className="w-full lg:w-5/12 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      FusionGrid at a Glance
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Real-time cross-department orchestration telemetry
                    </p>
                  </div>

                  {/* Micro Terminal Graph Box */}
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
                      <span>Real-time system orchestration</span>
                      <span className="text-emerald-400 font-mono">99.98% uptime</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                          <Network className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Events / Sec</p>
                          <p className="text-base font-bold text-white font-mono">8,420</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                          <Zap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Avg Latency</p>
                          <p className="text-base font-bold text-white font-mono">18ms</p>
                        </div>
                      </div>
                    </div>

                    {/* Animated Line Visualizer */}
                    <div className="mt-4 flex items-end gap-1 h-8">
                      {[35, 55, 40, 75, 60, 85, 95, 70, 80, 60, 90, 100, 80, 85, 90, 70, 95, 100].map((h, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-gradient-to-t from-emerald-500/30 to-emerald-400 rounded-xs transition-all duration-500"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Two Main Key Metric Counters */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <p className="text-xs text-slate-400">Active Agencies</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">250+</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <p className="text-xs text-slate-400">Interoperability Score</p>
                      <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono mt-1">98.4%</p>
                    </div>
                  </div>
                </div>

                {/* Right Connectivity Map Visualizer */}
                <div className="w-full lg:w-7/12 relative rounded-2xl border border-white/10 bg-slate-950/70 p-6 overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-cyan-400" />
                      State Distributed Mesh Topology
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/30 font-medium">
                      Live Pulse Sync
                    </span>
                  </div>

                  {/* SVG Node Network Map */}
                  <div className="relative h-64 w-full flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 400 220" fill="none">
                      {/* Grid background lines */}
                      <path d="M20 110 H380 M200 10 V210" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                      {/* Connection Curves */}
                      <path d="M 60,60 Q 150,110 200,110" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" strokeDasharray="3 3" />
                      <path d="M 60,160 Q 150,110 200,110" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" />
                      <path d="M 200,110 Q 250,50 340,60" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                      <path d="M 200,110 Q 260,170 340,160" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="2" />
                      <path d="M 120,40 Q 200,110 280,180" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1.5" />

                      {/* Center FusionGrid Core Node */}
                      <circle cx="200" cy="110" r="28" fill="url(#coreGradient)" stroke="rgba(56, 189, 248, 0.8)" strokeWidth="2" />
                      <circle cx="200" cy="110" r="38" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1" strokeDasharray="2 4" />

                      {/* Peripheral Department Nodes */}
                      <circle cx="60" cy="60" r="14" fill="#0E243A" stroke="#38BDF8" strokeWidth="2" />
                      <circle cx="60" cy="160" r="14" fill="#0C2B22" stroke="#34D399" strokeWidth="2" />
                      <circle cx="340" cy="60" r="14" fill="#2E200B" stroke="#FBBF24" strokeWidth="2" />
                      <circle cx="340" cy="160" r="14" fill="#152238" stroke="#60A5FA" strokeWidth="2" />
                      <circle cx="120" cy="40" r="8" fill="#1E293B" stroke="#A78BFA" strokeWidth="1.5" />
                      <circle cx="280" cy="180" r="8" fill="#1E293B" stroke="#34D399" strokeWidth="1.5" />

                      {/* Node Labels */}
                      <text x="200" y="114" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">CORE</text>
                      <text x="60" y="86" fill="#94A3B8" fontSize="8" textAnchor="middle">Revenue</text>
                      <text x="60" y="186" fill="#94A3B8" fontSize="8" textAnchor="middle">Health</text>
                      <text x="340" y="86" fill="#94A3B8" fontSize="8" textAnchor="middle">Education</text>
                      <text x="340" y="186" fill="#94A3B8" fontSize="8" textAnchor="middle">Welfare</text>

                      <defs>
                        <linearGradient id="coreGradient" x1="180" y1="90" x2="220" y2="130" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#0284C7" />
                          <stop offset="1" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Glowing coordinate markers */}
                    <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500">
                      Mesh: MH-CORE-01 · Active Streams: 124
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 4 FROSTED FEATURE CARDS (Matching Reference Image)                     */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    {feat.badgeType === 'live' ? (
                      <span className="pill-live rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <span className="pill-secure rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        SECURE
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center -space-x-1.5">
                    {feat.deptColors.map((col, idx) => (
                      <div key={idx} className={`h-4 w-4 rounded-full ${col} ring-2 ring-white`} />
                    ))}
                    <span className="pl-2 text-[11px] font-medium text-slate-500">Badges</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 font-mono">{feat.stat}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DEPARTMENT CARDS (Themed Dark/Colored Glass Tiles with High Contrast)   */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">Department Cards</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connectivity with distinct state platform agencies.
            </p>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Show all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {departmentTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.id}
                className={`rounded-2xl p-6 border shadow-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${tile.bgClass}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-white">{tile.title}</h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed min-h-[36px]">
                  {tile.desc}
                </p>

                <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-left">
                  <div>
                    <p className={`text-base font-bold font-mono ${tile.accentColor}`}>{tile.stat1}</p>
                    <p className="text-[10px] text-slate-400">{tile.label1}</p>
                  </div>
                  <div>
                    <p className={`text-base font-bold font-mono ${tile.accentColor}`}>{tile.stat2}</p>
                    <p className="text-[10px] text-slate-400">{tile.label2}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FUSIONGRID SECURITY & FEDRAMP COMPLIANCE (Right Page in Reference Image) */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-950">FusionGrid Security</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Real-time system from e-governance interoperability architecture.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Left Security Badge Card */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-8 flex flex-col justify-between border border-white/90 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 mb-4 border border-blue-500/20">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                FEDRAMP & ISO 27001 Certified
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 leading-tight">
                Zero-Trust State Interoperability Architecture
              </h3>
              <ul className="mt-6 space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Real-time threat detection & telemetry visualization</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Purpose-bound cryptographic token verification</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Encrypted end-to-end communication with DPDP Act alignment</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Immutable audit logging for complete accountability</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span>Security Rating: A+ (Highest)</span>
              <span className="font-mono font-semibold text-slate-700">AES-256-GCM</span>
            </div>
          </div>

          {/* Right Security Threat Telemetry (Dark Glass) */}
          <div className="lg:col-span-7 glass-dark-card rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold">Real-Time Threat Detection</span>
              </div>
              <span className="text-xs font-mono text-slate-400">All systems optimal</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-slate-900/80 p-4 border border-white/5">
                <p className="text-xs text-slate-400">Threat Prevention</p>
                <p className="text-xl font-bold font-mono text-emerald-400 mt-1">0 Anomalies</p>
                <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-full" />
                </div>
              </div>
              <div className="rounded-xl bg-slate-900/80 p-4 border border-white/5">
                <p className="text-xs text-slate-400">Encrypted Protocols</p>
                <p className="text-xl font-bold font-mono text-cyan-400 mt-1">TLS 1.3 / mTLS</p>
                <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-11/12" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5">
              <p className="text-xs text-slate-400 mb-2">Cryptographic Token Stream</p>
              <div className="font-mono text-xs text-slate-300 space-y-1">
                <p className="truncate"><span className="text-emerald-400">[AUTH]</span> TOKEN_MH_9921 -&gt; VERIFIED (0.4ms)</p>
                <p className="truncate"><span className="text-blue-400">[CONSENT]</span> CID_8829 -&gt; PURPOSE_SCOPED_REVENUE</p>
                <p className="truncate"><span className="text-emerald-400">[DISPATCH]</span> DIGILOCKER_CERT_SYNC -&gt; OK</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TESTIMONIALS (From Reference Image)                                    */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">Testimonials</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Government CIOs and leaders on operational excellence across departments.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                <img src={t.avatar} alt={t.author} className="h-12 w-12 rounded-full p-0.5 object-cover ring-2 ring-blue-500/30 shadow-md bg-white/95" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. LATEST INSIGHTS (From Reference Image)                                 */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">Latest Insights</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Articles and architectural insights on digital governance.
            </p>
          </div>
          <button onClick={() => navigate('/about')} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
            View all &gt;
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {insights.map((item, idx) => (
            <div key={idx} className="glass-card glass-card-hover rounded-2xl p-6 group cursor-pointer">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full ring-1 ring-blue-500/20">
                {item.tag}
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                Read Paper <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BOTTOM BANNER (Matching Reference Image)                               */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/90 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full aurora-orb-amber pointer-events-none" />

          <div className="relative">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">
              Build the Future of Governance with FusionGrid.
            </h3>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Connect legacy department databases, configure consent rules, and deliver seamless citizen experiences today.
            </p>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-xs sm:text-sm font-semibold text-white shadow-xl hover:bg-slate-900 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wider"
            >
              Request Demo CTA
              <ArrowRight className="h-4 w-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
