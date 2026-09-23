import { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { FusionGridLogo } from './FusionGridLogo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface PublicHeaderProps {
  currentPath: string;
  navigate: (to: string) => void;
}

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Architecture', path: '/architecture' },
  { label: 'Services', path: '/services' },
];

export function PublicHeader({ currentPath, navigate }: PublicHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    return currentPath.startsWith(path);
  };

  const { user } = useApp();

  const getPortalRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'officer') return '/officer/dashboard';
    return '/portal/dashboard';
  };

  return (
    <div className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 pb-1 transition-all duration-300">
      <header
        className={cn(
          'mx-auto max-w-7xl rounded-full border transition-all duration-300',
          scrolled
            ? 'border-white/80 bg-white/80 backdrop-blur-2xl shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5'
            : 'border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <FusionGridLogo />
            <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Maharashtra Interoperability Live
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-blue-600/10 text-blue-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/60'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            {user ? (
              <Button
                size="sm"
                onClick={() => navigate(getPortalRoute())}
                className="rounded-full gap-1.5 px-4 shadow-md shadow-blue-900/20 bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-semibold"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Go to Portal ({user.name?.split(' ')[0] ?? 'Account'})
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="rounded-full px-4 text-slate-700 hover:text-slate-950"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="rounded-full gap-1.5 px-4 shadow-md shadow-blue-900/20"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Citizen Portal
                </Button>
              </>
            )}
          </div>

          <button
            className="rounded-full p-2 text-foreground hover:bg-slate-100/80 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="rounded-3xl border-t border-slate-200/60 bg-white/95 backdrop-blur-2xl px-4 py-4 md:hidden shadow-xl mt-2">
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    'rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
                {user ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      navigate(getPortalRoute());
                      setMobileOpen(false);
                    }}
                    className="rounded-xl w-full gap-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-semibold"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Go to Portal ({user.name?.split(' ')[0] ?? 'Account'})
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { navigate('/login'); setMobileOpen(false); }}
                      className="rounded-xl w-full"
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => { navigate('/login'); setMobileOpen(false); }}
                      className="rounded-xl w-full gap-1.5"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Citizen Portal
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
