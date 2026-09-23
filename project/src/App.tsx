import { AppProvider, useApp } from '@/context/AppContext';
import { useHashRoute, parseRoute } from '@/hooks/useHashRoute';
import { PublicHeader } from '@/components/shared/PublicHeader';
import { PublicFooter } from '@/components/shared/PublicFooter';
import { PortalLayout } from '@/components/shared/PortalLayout';
import { OfficerLayout } from '@/components/shared/OfficerLayout';
import { AdminLayout } from '@/components/shared/AdminLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { ServicesPage } from '@/pages/public/ServicesPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { CitizenDashboard } from '@/pages/portal/CitizenDashboard';
import { CitizenProfile } from '@/pages/portal/CitizenProfile';
import { PortalServices } from '@/pages/portal/PortalServices';
import { ApplicationsList } from '@/pages/portal/ApplicationsList';
import { ApplicationDetail } from '@/pages/portal/ApplicationDetail';
import { ApplyFlow } from '@/pages/portal/ApplyFlow';
import { ConsentManagement } from '@/pages/portal/ConsentManagement';
import { NotificationsPage } from '@/pages/portal/NotificationsPage';
import { HistoryPage } from '@/pages/portal/HistoryPage';
import { OfficerDashboard } from '@/pages/officer/OfficerDashboard';
import { ApplicationQueue } from '@/pages/officer/ApplicationQueue';
import { ApplicationReview } from '@/pages/officer/ApplicationReview';
import { VerificationCenter } from '@/pages/officer/VerificationCenter';
import { SlaMonitoring } from '@/pages/officer/SlaMonitoring';
import { WorkflowMonitor } from '@/pages/officer/WorkflowMonitor';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { DepartmentIntegrations } from '@/pages/admin/DepartmentIntegrations';
import { ApiGatewayMonitor } from '@/pages/admin/ApiGatewayMonitor';
import { DataQuality } from '@/pages/admin/DataQuality';
import { AuditLogs } from '@/pages/admin/AuditLogs';
import { SystemHealth } from '@/pages/admin/SystemHealth';
import { Analytics } from '@/pages/admin/Analytics';
import { SystemConnectors } from '@/pages/admin/SystemConnectors';
import { DataStandards } from '@/pages/admin/DataStandards';
import { EventStream } from '@/pages/admin/EventStream';
import { ArchitecturePage } from '@/pages/public/ArchitecturePage';

function AppContent() {
  const { route, navigate } = useHashRoute();
  const { user, authLoading } = useApp();
  const { path, segments } = parseRoute(route);

  const isPortalRoute = path.startsWith('/portal');
  const isOfficerRoute = path.startsWith('/officer');
  const isAdminRoute = path.startsWith('/admin');
  const isProtectedRoute = isPortalRoute || isOfficerRoute || isAdminRoute;

  // Show loading while restoring session
  if (authLoading && isProtectedRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Restoring your session…</p>
        </div>
      </div>
    );
  }

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    return (
      <div className="relative min-h-screen flex flex-col bg-[#F8FAFC] overflow-x-hidden selection:bg-blue-600 selection:text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-32 -left-28 w-[720px] h-[720px] rounded-full aurora-orb-cyan opacity-80" />
          <div className="absolute -top-16 right-[2%] w-[700px] h-[700px] rounded-full aurora-orb-green opacity-80" />
          <div className="absolute top-[40%] -right-24 w-[680px] h-[680px] rounded-full aurora-orb-amber opacity-75" />
          <div className="absolute bottom-10 -left-24 w-[650px] h-[650px] rounded-full aurora-orb-purple opacity-65" />
        </div>
        <PublicHeader currentPath={path} navigate={navigate} />
        <div className="relative z-10 flex flex-1 items-center justify-center p-6">
          <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center border border-white/80 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900">Sign in to Access Portal</h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Please sign in with your citizen, officer, or admin credentials to access this dashboard.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 w-full rounded-full bg-slate-950 px-6 py-3.5 text-xs font-semibold text-white shadow-xl hover:bg-slate-900 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wider"
            >
              Sign In to Portal
            </button>
          </div>
        </div>
        <div className="relative z-10">
          <PublicFooter navigate={navigate} />
        </div>
      </div>
    );
  }

  // Admin routes
  if (isAdminRoute && user) {
    let adminContent: React.ReactNode;
    if (segments[1] === 'dashboard') adminContent = <AdminDashboard navigate={navigate} />;
    else if (segments[1] === 'integrations') adminContent = <DepartmentIntegrations navigate={navigate} />;
    else if (segments[1] === 'api-monitor') adminContent = <ApiGatewayMonitor navigate={navigate} />;
    else if (segments[1] === 'data-quality') adminContent = <DataQuality navigate={navigate} />;
    else if (segments[1] === 'audit') adminContent = <AuditLogs navigate={navigate} />;
    else if (segments[1] === 'system-health') adminContent = <SystemHealth navigate={navigate} />;
    else if (segments[1] === 'analytics') adminContent = <Analytics navigate={navigate} />;
    else if (segments[1] === 'connectors') adminContent = <SystemConnectors navigate={navigate} />;
    else if (segments[1] === 'data-standards') adminContent = <DataStandards navigate={navigate} />;
    else if (segments[1] === 'event-stream') adminContent = <EventStream navigate={navigate} />;
    else adminContent = <AdminDashboard navigate={navigate} />;

    return (
      <AdminLayout currentPath={path} navigate={navigate}>
        {adminContent}
      </AdminLayout>
    );
  }

  // Officer routes
  if (isOfficerRoute && user) {
    let officerContent: React.ReactNode;
    if (segments[1] === 'dashboard') officerContent = <OfficerDashboard navigate={navigate} />;
    else if (segments[1] === 'queue') officerContent = <ApplicationQueue navigate={navigate} />;
    else if (segments[1] === 'review' && segments[2])
      officerContent = <ApplicationReview applicationId={segments[2]} navigate={navigate} />;
    else if (segments[1] === 'review')
      officerContent = <ApplicationQueue navigate={navigate} />;
    else if (segments[1] === 'verification') officerContent = <VerificationCenter navigate={navigate} />;
    else if (segments[1] === 'sla') officerContent = <SlaMonitoring navigate={navigate} />;
    else if (segments[1] === 'workflow') officerContent = <WorkflowMonitor navigate={navigate} />;
    else officerContent = <OfficerDashboard navigate={navigate} />;

    return (
      <OfficerLayout currentPath={path} navigate={navigate}>
        {officerContent}
      </OfficerLayout>
    );
  }

  // Citizen portal routes
  if (isPortalRoute && user) {
    let portalContent: React.ReactNode;
    if (segments[1] === 'dashboard') portalContent = <CitizenDashboard navigate={navigate} />;
    else if (segments[1] === 'profile') portalContent = <CitizenProfile navigate={navigate} />;
    else if (segments[1] === 'services') portalContent = <PortalServices navigate={navigate} />;
    else if (segments[1] === 'applications' && segments[2])
      portalContent = <ApplicationDetail applicationId={segments[2]} navigate={navigate} />;
    else if (segments[1] === 'applications') portalContent = <ApplicationsList navigate={navigate} />;
    else if (segments[1] === 'apply' && segments[2])
      portalContent = <ApplyFlow serviceId={segments[2]} navigate={navigate} />;
    else if (segments[1] === 'consent') portalContent = <ConsentManagement />;
    else if (segments[1] === 'notifications') portalContent = <NotificationsPage navigate={navigate} />;
    else if (segments[1] === 'history') portalContent = <HistoryPage navigate={navigate} />;
    else portalContent = <CitizenDashboard navigate={navigate} />;

    return (
      <PortalLayout currentPath={path} navigate={navigate}>
        {portalContent}
      </PortalLayout>
    );
  }

  // Public routes
  let publicContent: React.ReactNode;
  if (path === '/' || path === '') publicContent = <LandingPage navigate={navigate} />;
  else if (path === '/about') publicContent = <AboutPage />;
  else if (path === '/how-itworks') publicContent = <HowItWorksPage navigate={navigate} />;
  else if (path === '/how-it-works') publicContent = <HowItWorksPage navigate={navigate} />;
  else if (path === '/services') publicContent = <ServicesPage navigate={navigate} />;
  else if (path === '/architecture') publicContent = <ArchitecturePage navigate={navigate} />;
  else if (path === '/login') publicContent = <LoginPage navigate={navigate} />;
  else publicContent = <LandingPage navigate={navigate} />;

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8FAFC] overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Global Vibrant Ambient Aurora Glows (Apple Frosted Glassmorphism) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-28 w-[720px] h-[720px] rounded-full aurora-orb-cyan opacity-80" />
        <div className="absolute -top-16 right-[2%] w-[700px] h-[700px] rounded-full aurora-orb-green opacity-80" />
        <div className="absolute top-[40%] -right-24 w-[680px] h-[680px] rounded-full aurora-orb-amber opacity-75" />
        <div className="absolute bottom-10 -left-24 w-[650px] h-[650px] rounded-full aurora-orb-purple opacity-65" />
      </div>

      <PublicHeader currentPath={path} navigate={navigate} />
      <main className="relative z-10 flex-1">{publicContent}</main>
      <div className="relative z-10">
        <PublicFooter navigate={navigate} />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
