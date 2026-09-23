import { useState, useEffect } from 'react';
import {
  User, ShieldCheck, Settings, Lock, ArrowRight, Eye, EyeOff,
  Smartphone, KeyRound, AlertCircle, CheckCircle2, Info,
  Loader2, Mail, Calendar, MapPin, Home, GraduationCap, BookOpen,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import type { Role } from '@/types';
import { cn } from '@/lib/utils';

interface LoginPageProps {
  navigate: (to: string) => void;
}

const roleConfig: Record<Role, { label: string; icon: typeof User; redirect: string; color: string }> = {
  citizen: { label: 'Citizen', icon: User, redirect: '/portal/dashboard', color: 'text-primary' },
  officer: { label: 'Officer', icon: ShieldCheck, redirect: '/officer/dashboard', color: 'text-accent' },
  admin: { label: 'Admin', icon: Settings, redirect: '/admin/dashboard', color: 'text-amber-600' },
};

export function LoginPage({ navigate }: LoginPageProps) {
  const { user, login, signInCitizen, signUpCitizen } = useApp();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'officer') navigate('/officer/dashboard');
      else navigate('/portal/dashboard');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState<Role>('citizen');
  const [citizenMode, setCitizenMode] = useState<'login' | 'signup'>('login');

  // Citizen login state
  const [citEmail, setCitEmail] = useState('');
  const [citPass, setCitPass] = useState('');
  const [showCitPass, setShowCitPass] = useState(false);
  const [citLoading, setCitLoading] = useState(false);

  // Citizen signup state
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPass, setSuPass] = useState('');
  const [suMobile, setSuMobile] = useState('');
  const [suDob, setSuDob] = useState('');
  const [suAddress, setSuAddress] = useState('');
  const [suDistrict, setSuDistrict] = useState('');
  const [suCollege, setSuCollege] = useState('');
  const [suCourse, setSuCourse] = useState('');
  const [suLoading, setSuLoading] = useState(false);

  // Officer / Admin state (mock)
  const [officerEmail, setOfficerEmail] = useState('officer@fusiongrid.gov.in');
  const [officerPass, setOfficerPass] = useState('Officer@123');
  const [adminEmail, setAdminEmail] = useState('admin@fusiongrid.gov.in');
  const [adminPass, setAdminPass] = useState('Admin@123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCitizenLogin = async () => {
    setError('');
    if (!citEmail || !citPass) {
      setError('Please enter your email and password.');
      return;
    }
    setCitLoading(true);
    const { error } = await signInCitizen(citEmail, citPass);
    setCitLoading(false);
    if (error) {
      setError(error);
      return;
    }
    navigate(roleConfig.citizen.redirect);
  };

  const handleCitizenSignup = async () => {
    setError('');
    setSuccess('');
    if (!suName || !suEmail || !suPass) {
      setError('Please fill in your name, email, and password.');
      return;
    }
    if (suPass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSuLoading(true);
    const { error } = await signUpCitizen(suEmail, suPass, {
      full_name: suName,
      mobile: suMobile,
      dob: suDob,
      address: suAddress,
      district: suDistrict,
      college: suCollege,
      course: suCourse,
    });
    setSuLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setSuccess('Account created successfully! Logging you in...');
    setTimeout(() => {
      navigate(roleConfig.citizen.redirect);
    }, 300);
  };

  const handleOfficerLogin = () => {
    setError('');
    if (officerEmail !== 'officer@fusiongrid.gov.in' || officerPass !== 'Officer@123') {
      setError('Invalid credentials. Use the demo credentials below.');
      return;
    }
    login('officer');
    navigate(roleConfig.officer.redirect);
  };

  const handleAdminLogin = () => {
    setError('');
    if (adminEmail !== 'admin@fusiongrid.gov.in' || adminPass !== 'Admin@123') {
      setError('Invalid credentials. Use the demo credentials below.');
      return;
    }
    login('admin');
    navigate(roleConfig.admin.redirect);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative mx-auto flex max-w-md flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Sign in to FusionGrid</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose your role and enter the portal
          </p>
        </div>

        <Card className="w-full border-border/60 shadow-xl">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as Role); setError(''); setSuccess(''); }}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="citizen" className="gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Citizen
                </TabsTrigger>
                <TabsTrigger value="officer" className="gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Officer
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-1.5">
                  <Settings className="h-3.5 w-3.5" />
                  Admin
                </TabsTrigger>
              </TabsList>

              {/* Citizen Login / Signup */}
              <TabsContent value="citizen" className="mt-4 space-y-4">
                {/* Toggle between login and signup */}
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                  <button
                    onClick={() => { setCitizenMode('login'); setError(''); setSuccess(''); }}
                    className={cn(
                      'flex-1 rounded-md py-1.5 text-sm font-medium transition-all',
                      citizenMode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setCitizenMode('signup'); setError(''); setSuccess(''); }}
                    className={cn(
                      'flex-1 rounded-md py-1.5 text-sm font-medium transition-all',
                      citizenMode === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                    )}
                  >
                    Create Account
                  </button>
                </div>

                {citizenMode === 'login' ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleCitizenLogin(); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cit-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="cit-email"
                          name="email"
                          autoComplete="email"
                          placeholder="citizen@fusiongrid.gov.in"
                          type="email"
                          value={citEmail}
                          onChange={(e) => setCitEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cit-pass">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="cit-pass"
                          name="password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          type={showCitPass ? 'text' : 'password'}
                          value={citPass}
                          onChange={(e) => setCitPass(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCitPass(!showCitPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCitPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {success}
                      </div>
                    )}

                    <Button type="submit" className="w-full gap-2" disabled={citLoading}>
                      {citLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                      {citLoading ? 'Signing in…' : 'Sign In'}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2 text-xs border-slate-200/80 bg-white/80 hover:bg-white text-slate-800 rounded-xl"
                      onClick={() => {
                        login('citizen');
                        navigate(roleConfig.citizen.redirect);
                      }}
                    >
                      Quick Demo Citizen Login
                      <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                    </Button>
                  </form>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleCitizenSignup(); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="su-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="su-name"
                          name="name"
                          autoComplete="name"
                          placeholder="Aarav Sharma"
                          value={suName}
                          onChange={(e) => setSuName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="su-email"
                          name="email"
                          autoComplete="email"
                          placeholder="citizen@fusiongrid.gov.in"
                          type="email"
                          value={suEmail}
                          onChange={(e) => setSuEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-pass">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="su-pass"
                          name="new-password"
                          autoComplete="new-password"
                          placeholder="At least 6 characters"
                          type={showCitPass ? 'text' : 'password'}
                          value={suPass}
                          onChange={(e) => setSuPass(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button type="button" onClick={() => setShowCitPass(!showCitPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showCitPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="su-mobile">Mobile</Label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="su-mobile"
                            name="tel"
                            autoComplete="tel"
                            placeholder="9876543210"
                            value={suMobile}
                            onChange={(e) => setSuMobile(e.target.value)}
                            className="pl-10"
                            maxLength={10}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="su-dob">Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="su-dob"
                            name="bday"
                            autoComplete="bday"
                            type="date"
                            value={suDob}
                            onChange={(e) => setSuDob(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-address">Address</Label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="su-address"
                          name="street-address"
                          autoComplete="street-address"
                          placeholder="Flat 402, Sunshine Apts, Shivaji Nagar"
                          value={suAddress}
                          onChange={(e) => setSuAddress(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-district">District</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="su-district"
                          name="address-level2"
                          autoComplete="address-level2"
                          placeholder="Pune"
                          value={suDistrict}
                          onChange={(e) => setSuDistrict(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="su-college">College</Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="su-college"
                            name="organization"
                            autoComplete="organization"
                            placeholder="COEP Technological University"
                            value={suCollege}
                            onChange={(e) => setSuCollege(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="su-course">Course</Label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="su-course"
                            name="education"
                            placeholder="B.Tech Computer Engineering"
                            value={suCourse}
                            onChange={(e) => setSuCourse(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full gap-2" disabled={suLoading}>
                      {suLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                      {suLoading ? 'Creating account…' : 'Create Account'}
                    </Button>
                    </form>
                )}


              </TabsContent>

              {/* Officer Login */}
              <TabsContent value="officer" className="mt-4 space-y-4">
                <form onSubmit={(e) => { e.preventDefault(); handleOfficerLogin(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="off-email">Official Email</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="off-email"
                      name="officer-email"
                      autoComplete="email"
                      placeholder="officer@fusiongrid.gov.in"
                      type="email"
                      value={officerEmail}
                      onChange={(e) => setOfficerEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="off-pass">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="off-pass"
                      name="officer-password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      type={showPass ? 'text' : 'password'}
                      value={officerPass}
                      onChange={(e) => setOfficerPass(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full gap-2">
                  Sign In as Officer
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 text-xs border-slate-200/80 bg-white/80 hover:bg-white text-slate-800 rounded-xl"
                  onClick={() => {
                    login('officer');
                    navigate(roleConfig.officer.redirect);
                  }}
                >
                  Quick Demo Officer Login
                  <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                </Button>

                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Official Officer Credentials
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-blue-800">
                    <p>Email: <span className="font-mono font-semibold">officer@fusiongrid.gov.in</span></p>
                    <p>Password: <span className="font-mono font-semibold">Officer@123</span></p>
                  </div>
                </div>
                </form>
              </TabsContent>

              {/* Admin Login */}
              <TabsContent value="admin" className="mt-4 space-y-4">
                <form onSubmit={(e) => { e.preventDefault(); handleAdminLogin(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adm-email">Admin Email</Label>
                  <div className="relative">
                    <Settings className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="adm-email"
                      name="admin-email"
                      autoComplete="email"
                      placeholder="admin@fusiongrid.gov.in"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adm-pass">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="adm-pass"
                      name="admin-password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      type={showPass ? 'text' : 'password'}
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full gap-2">
                  Sign In as Admin
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 text-xs border-slate-200/80 bg-white/80 hover:bg-white text-slate-800 rounded-xl"
                  onClick={() => {
                    login('admin');
                    navigate(roleConfig.admin.redirect);
                  }}
                >
                  Quick Demo Admin Login
                  <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                </Button>

                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Official Administrator Credentials
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-blue-800">
                    <p>Email: <span className="font-mono font-semibold">admin@fusiongrid.gov.in</span></p>
                    <p>Password: <span className="font-mono font-semibold">Admin@123</span></p>
                  </div>
                </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          End-to-end encrypted authentication for Government of Maharashtra portals.
        </div>

        <button onClick={() => navigate('/')} className="mt-4 text-sm text-primary hover:underline">
          Back to home
        </button>
      </div>
    </div>
  );
}
