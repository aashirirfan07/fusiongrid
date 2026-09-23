import { useState, useEffect, type ReactNode } from 'react';
import {
  LayoutDashboard, ListOrdered, FileSearch, ShieldCheck,
  Gauge, Activity, LogOut, Menu, X, ChevronRight, Building2,
} from 'lucide-react';
import { FusionGridLogo } from '@/components/shared/FusionGridLogo';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { officerInfo } from '@/data/mockData';

interface OfficerLayoutProps {
  currentPath: string;
  navigate: (to: string) => void;
  children: ReactNode;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/officer/dashboard' },
  { label: 'Application Queue', icon: ListOrdered, path: '/officer/queue' },
  { label: 'Application Review', icon: FileSearch, path: '/officer/review' },
  { label: 'Verification Center', icon: ShieldCheck, path: '/officer/verification' },
  { label: 'SLA Monitoring', icon: Gauge, path: '/officer/sla' },
  { label: 'Workflow Monitor', icon: Activity, path: '/officer/workflow' },
];

export function OfficerLayout({ currentPath, navigate, children }: OfficerLayoutProps) {
  const { user, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-5">
        <button onClick={() => navigate('/')} className="flex items-center">
          <FusionGridLogo size="sm" />
        </button>
      </div>

      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            {user?.name?.charAt(0) ?? 'O'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.id}</p>
          </div>
        </div>
        <Badge variant="outline" className="mt-3 w-full justify-center gap-1.5 border-primary/30 bg-primary/5 text-primary">
          <Building2 className="h-3 w-3" />
          {officerInfo.department}
        </Badge>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-3 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md shadow-blue-800/20'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              )}
            >
              <Icon className={cn('h-4 w-4', active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700')} />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="h-4 w-4 text-white/80" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/60 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Global Vibrant Ambient Aurora Glows (Apple Frosted Glassmorphism) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-28 w-[650px] h-[650px] rounded-full aurora-orb-cyan opacity-75" />
        <div className="absolute -top-16 right-[2%] w-[600px] h-[600px] rounded-full aurora-orb-green opacity-75" />
        <div className="absolute top-[40%] -right-24 w-[600px] h-[600px] rounded-full aurora-orb-amber opacity-70" />
        <div className="absolute bottom-10 -left-20 w-[600px] h-[600px] rounded-full aurora-orb-purple opacity-60" />
      </div>

      <aside className="relative z-10 hidden w-64 shrink-0 border-r border-white/80 bg-white/70 backdrop-blur-2xl lg:block shadow-[4px_0_30px_rgba(15,23,42,0.04)]">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-full w-64 bg-white/95 backdrop-blur-2xl shadow-2xl lg:hidden animate-slide-in-right">
            <SidebarContent />
          </aside>
        </>
      )}

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-white/80 bg-white/80 backdrop-blur-xl px-4 lg:hidden">
          <button onClick={() => navigate('/')} className="flex items-center">
            <FusionGridLogo size="sm" />
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2 text-foreground hover:bg-slate-100">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
