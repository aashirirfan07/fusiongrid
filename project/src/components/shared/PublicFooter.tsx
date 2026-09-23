import { FusionGridLogo } from './FusionGridLogo';
import { ShieldCheck, Lock, FileCheck, AlertTriangle } from 'lucide-react';

interface PublicFooterProps {
  navigate: (to: string) => void;
}

export function PublicFooter({ navigate }: PublicFooterProps) {
  return (
    <footer className="relative border-t border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center">
              <FusionGridLogo className="[&_span]:text-white [&_.text-primary]:text-blue-400" />
            </div>
            <p className="mt-4 max-w-md text-sm text-slate-400 leading-relaxed">
              FusionGrid is a Government of Maharashtra interoperability platform connecting
              departments through secure, consent-based data sharing for unified citizen services.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5 text-xs">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> ISO 27001 Aligned
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-slate-300">
                <Lock className="h-3.5 w-3.5 text-emerald-400" /> End-to-End Encrypted
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-slate-300">
                <FileCheck className="h-3.5 w-3.5 text-amber-400" /> DPDP Act Compliant
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Platform</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About FusionGrid</button></li>
              <li><button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
              <li><button onClick={() => navigate('/architecture')} className="hover:text-white transition-colors">Architecture</button></li>
              <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">Services Directory</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Citizen Portal</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Standards & Trust</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">Privacy & Data Protection</button></li>
              <li><button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">Consent Management Protocol</button></li>
              <li><button onClick={() => navigate('/architecture')} className="hover:text-white transition-colors">Interoperability Standards</button></li>
              <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">Grievance Redressal</button></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © 2026 Government of Maharashtra. All rights reserved.
          </p>
          <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5" />
            Prototype Simulation Environment — State Interoperability Architecture
          </div>
        </div>
      </div>
    </footer>
  );
}
