import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Loader2, XCircle, AlertCircle, Circle, HelpCircle, SkipForward } from 'lucide-react';
import type { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const config: Record<ApplicationStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  draft: { label: 'Draft', className: 'bg-slate-100/80 text-slate-700 border-slate-200/80 ring-slate-400/20', icon: Circle },
  submitted: { label: 'Submitted', className: 'bg-blue-500/10 text-blue-700 border-blue-200/80 ring-blue-500/20', icon: Loader2 },
  under_verification: { label: 'Under Verification', className: 'bg-amber-500/10 text-amber-700 border-amber-200/80 ring-amber-500/20', icon: Clock },
  processing: { label: 'Processing', className: 'bg-indigo-500/10 text-indigo-700 border-indigo-200/80 ring-indigo-500/20', icon: Loader2 },
  approved: { label: 'Approved', className: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80 ring-emerald-500/20', icon: CheckCircle2 },
  rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-700 border-red-200/80 ring-red-500/20', icon: XCircle },
  info_requested: { label: 'Info Requested', className: 'bg-orange-500/10 text-orange-700 border-orange-200/80 ring-orange-500/20', icon: HelpCircle },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md px-3 py-1 text-xs font-semibold ring-1 shadow-xs transition-all', c.className, className)}>
      <Icon className={cn('h-3 w-3', status === 'processing' || status === 'submitted' ? 'animate-spin' : '')} />
      {c.label}
    </span>
  );
}

export function TimelineDot({ status }: { status: 'done' | 'current' | 'pending' | 'skipped' }) {
  if (status === 'done') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground animate-check-pop">
        <CheckCircle2 className="h-5 w-5" />
      </div>
    );
  }
  if (status === 'current') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 animate-pulse-ring">
        <Clock className="h-5 w-5" />
      </div>
    );
  }
  if (status === 'skipped') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SkipForward className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-muted bg-background text-muted-foreground">
      <Circle className="h-4 w-4" />
    </div>
  );
}

export function SlaBadge({ status }: { status: 'on_track' | 'due_soon' | 'breached' }) {
  const cfg = {
    on_track: { label: 'On Track', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    due_soon: { label: 'Due Soon', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    breached: { label: 'Breached', className: 'bg-red-50 text-red-700 border-red-200' },
  };
  const c = cfg[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', c.className)}>
      {c.label}
    </span>
  );
}

export function NotificationDot({ type }: { type: 'info' | 'success' | 'warning' | 'action' }) {
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    action: 'bg-orange-500',
  };
  const icons = {
    info: AlertCircle,
    success: CheckCircle2,
    warning: AlertCircle,
    action: AlertCircle,
  };
  const Icon = icons[type];
  return (
    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white', colors[type])}>
      <Icon className="h-4.5 w-4.5" />
    </div>
  );
}
