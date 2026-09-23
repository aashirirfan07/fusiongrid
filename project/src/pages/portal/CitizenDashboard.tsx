import {
  FileText, CheckCircle2, Clock, Bell, ArrowRight, MapPin,
  ShieldCheck, TrendingUp, ChevronRight, Zap, Radio, Lock, Activity, User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useApp } from '@/context/AppContext';

interface DashboardProps {
  navigate: (to: string) => void;
}

export function CitizenDashboard({ navigate }: DashboardProps) {
  const { applications, notifications, unreadCount, citizenProfile, user } = useApp();

  const citizenName = citizenProfile?.full_name || user?.name || 'Citizen';
  const citizenId = user?.id ? `${user.id.slice(0, 8)}…` : '—';
  const district = citizenProfile?.district || 'Maharashtra, India';

  const submittedApplications = applications.filter(
    (app) => app.status !== 'draft'
  );

  const activeCount = submittedApplications.filter(
    (a) => a.status === 'under_verification' || a.status === 'processing' || a.status === 'submitted'
  ).length;

  const completedCount = submittedApplications.filter(
    (a) => a.status === 'approved'
  ).length;

  const pendingActions = notifications.filter((n) => n.type === 'action' && !n.read).length;

  const metrics = [
    { label: 'Active Applications', value: activeCount, icon: FileText, color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
    { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Pending Actions', value: pendingActions, icon: Clock, color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
    { label: 'Notifications', value: unreadCount, icon: Bell, color: 'text-rose-600 bg-rose-500/10 border-rose-500/20' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {citizenName.split(' ')[0]}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
            <button
              onClick={() => navigate('/portal/profile')}
              className="font-mono text-xs bg-white/80 hover:bg-blue-50 px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all flex items-center gap-1 group text-slate-700"
              title="View & Edit Citizen Profile"
            >
              <User className="h-3 w-3 text-blue-600" />
              <span>ID: {citizenId}</span>
              <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              {district}
            </span>
          </div>
        </div>

        {/* Live Interoperability Status Chip */}
        <div className="flex items-center gap-2">
          <span className="pill-live rounded-full px-3.5 py-1 text-xs font-semibold flex items-center gap-2 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Interoperability Sync Active
          </span>
        </div>
      </div>

      {/* Frosted Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-white/80 shadow-lg flex items-center justify-between"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div>
                <p className="text-xs font-medium text-slate-500">{m.label}</p>
                <p className="mt-1 font-display text-3xl font-bold text-slate-900">{m.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${m.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Centerpiece: Real-Time Interoperability Pulse (Dark Glass Telemetry Card) */}
      <div className="glass-dark-card rounded-3xl p-6 sm:p-7 text-white border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">Citizen Interoperability Pulse</h2>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] text-emerald-300 font-mono border border-emerald-500/30">
              AES-256 Secured
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Zero-Trust Real-time Verification</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          <div className="rounded-2xl bg-slate-900/80 p-3.5 border border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>DigiLocker Connector</span>
              <Lock className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <p className="text-sm font-semibold text-emerald-400 font-mono">● Synchronized</p>
            <p className="text-[10px] text-slate-400 mt-1">Direct state vault linkage</p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 p-3.5 border border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Aadhaar Gateway</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-emerald-400 font-mono">● Verified Token</p>
            <p className="text-[10px] text-slate-400 mt-1">Cryptographic match</p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 p-3.5 border border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Consent Registry</span>
              <Activity className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <p className="text-sm font-semibold text-cyan-300 font-mono">● DPDP Compliant</p>
            <p className="text-[10px] text-slate-400 mt-1">Purpose-scoped exchange</p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 p-3.5 border border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Response Latency</span>
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
            </div>
            <p className="text-sm font-semibold text-white font-mono">18ms Avg</p>
            <p className="text-[10px] text-emerald-400 mt-1">Zero verification delays</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="truncate">Active Session Hash: 0x8F9A...B342 · Identity Bound</span>
          <span className="text-emerald-400 shrink-0">99.98% Gateway Uptime</span>
        </div>
      </div>

      {/* Applications + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Applications Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Your Applications</h2>
              <p className="text-xs text-slate-500">Live tracking across government departments</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/portal/applications')}
              className="gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 rounded-full"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {submittedApplications.map((app, i) => (
              <div
                key={app.id}
                className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer border border-white/80 shadow-md"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/portal/applications/${app.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display font-semibold text-slate-900">{app.serviceName}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="mt-1 font-mono text-xs text-slate-500">{app.id}</p>
                    {app.requestId && (
                      <p className="mt-0.5 font-mono text-xs text-slate-400">Request: {app.requestId}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-2">
                      <Progress value={app.progress} className="h-2 w-24 bg-slate-200" />
                      <span className="text-xs font-bold text-slate-700 font-mono">{app.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {submittedApplications.length === 0 && (
              <div className="glass-card rounded-2xl py-12 text-center border border-white/80">
                <FileText className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm text-slate-500">
                  No submitted applications yet.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate('/portal/services')}
                  className="mt-4 rounded-full bg-slate-950 px-5 text-white"
                >
                  Apply for a Service
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Impact Column */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-white/80 shadow-md">
            <h3 className="font-display font-bold text-slate-900 text-sm">Quick Actions</h3>
            <div className="mt-3 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 rounded-xl border-slate-200/80 bg-white/60 hover:bg-white text-xs font-medium text-slate-800"
                onClick={() => navigate('/portal/profile')}
              >
                <User className="h-4 w-4 text-indigo-600" />
                View & Edit Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 rounded-xl border-slate-200/80 bg-white/60 hover:bg-white text-xs font-medium text-slate-800"
                onClick={() => navigate('/portal/services')}
              >
                <FileText className="h-4 w-4 text-blue-600" />
                Apply for New Service
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 rounded-xl border-slate-200/80 bg-white/60 hover:bg-white text-xs font-medium text-slate-800"
                onClick={() => navigate('/portal/consent')}
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Manage Consents
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 rounded-xl border-slate-200/80 bg-white/60 hover:bg-white text-xs font-medium text-slate-800"
                onClick={() => navigate('/portal/notifications')}
              >
                <Bell className="h-4 w-4 text-amber-600" />
                View Notifications
              </Button>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="glass-card rounded-2xl p-5 border border-white/80 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <h3 className="font-display font-bold text-slate-900 text-sm">Recent Notifications</h3>
              <button
                onClick={() => navigate('/portal/notifications')}
                className="text-xs text-blue-600 font-semibold hover:text-blue-800"
              >
                View all
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="flex items-start gap-2.5">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-slate-300' : 'bg-blue-600 animate-pulse'}`} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-800">{n.title}</p>
                    <p className="truncate text-[10px] text-slate-400">{n.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact card */}
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 shadow-md relative overflow-hidden bg-gradient-to-br from-white/90 to-emerald-500/5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <h3 className="font-display text-sm font-bold text-slate-900">Your Interoperability Impact</h3>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              With FusionGrid cross-department orchestration, you've saved <span className="font-semibold text-slate-900">3 duplicate submissions</span> and <span className="font-semibold text-emerald-700">12 days</span> in processing time.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 gap-1 px-0 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              onClick={() => navigate('/portal/history')}
            >
              See verification details
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
