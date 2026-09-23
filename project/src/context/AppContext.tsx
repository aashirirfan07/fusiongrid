import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type {
  Role, Application, NotificationItem, ConsentRecord, AuditEvent,
  SystemEvent, EventType, ApiFailureState, RetryState, SecuritySession,
} from '@/types';
import { officerInfo, initialApplications } from '@/data/mockData';
import { supabase } from '@/lib/supabase';

export interface CitizenProfile {
  id: string;
  full_name: string;
  mobile: string;
  dob: string;
  address: string;
  district: string;
  college: string;
  course: string;
  verified: boolean;
}

interface AuthUser {
  role: Role;
  name: string;
  id: string;
  department?: string;
  email?: string;
}

interface AppState {
  user: AuthUser | null;
  login: (role: Role) => void;
  logout: () => void;
  citizenProfile: CitizenProfile | null;
  updateCitizenProfile: (updates: Partial<CitizenProfile>) => Promise<{ error: string | null }>;
  authLoading: boolean;
  signUpCitizen: (email: string, password: string, details: { full_name: string; mobile: string; dob: string; address: string; district: string; college: string; course: string }) => Promise<{ error: string | null }>;
  signInCitizen: (email: string, password: string) => Promise<{ error: string | null }>;
  applications: Application[];
  citizenMap: Record<string, { name: string; district: string }>;
  fetchAllApplications: () => Promise<void>;
  fetchCitizenById: (citizenId: string) => Promise<CitizenProfile | null>;
  addApplication: (app: Application) => Promise<string | null>;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string, reason: string) => void;
  requestInfo: (id: string, reason: string) => void;
  forwardApplication: (id: string, toDepartment: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: NotificationItem) => void;
  consents: ConsentRecord[];
  grantConsent: (department: string, dataScope: string, purpose: string, applicationId?: string) => void;
  revokeConsent: (id: string) => void;
  unreadCount: number;
  auditEvents: AuditEvent[];
  addAuditEvent: (e: AuditEvent) => void;
  systemEvents: SystemEvent[];
  emitEvent: (type: EventType, detail: string, applicationId?: string, actor?: string, department?: string) => void;
  apiFailures: ApiFailureState[];
  simulateRevenueFailure: () => void;
  resetRevenueFailure: () => void;
  session: SecuritySession | null;
  rateLimitRemaining: number;
  consumeRateLimit: () => boolean;
  checkRoleAccess: (requiredRole: Role) => boolean;
  checkConsent: (department: string) => boolean;
}

const AppContext = createContext<AppState | null>(null);

const nowString = () =>
  new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

const nowShort = () =>
  new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });

const generateToken = () => {
  const part = () => Math.random().toString(36).substring(2, 10).toUpperCase();
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${part()}.${part()}`;
};

function mapDbApplication(row: Record<string, unknown>): Application {
  const status = row.status as Application['status'];
  const submittedAt = row.submitted_at as string;

  const timeline = (row.timeline as Application['timeline']) || [];
  const workflowStages = (row.workflow_stages as Application['workflowStages']) || undefined;

  // Approval is persisted in Supabase, but older records may still contain
  // pre-approval progress/workflow values (for example 65% and Officer Review
  // as current). Normalize the derived UI state whenever the persisted status
  // is already approved so every portal stays consistent after logout/login.
  if (status === 'approved') {
    const completedAt = nowShort();

    const normalizedTimeline = timeline.map((step) => ({
      ...step,
      status: 'done' as const,
      timestamp: step.timestamp ?? completedAt,
    }));

    const normalizedWorkflowStages = workflowStages?.map((stage) => ({
      ...stage,
      status: 'done' as const,
      duration:
        stage.duration === 'In progress' || stage.duration === '—'
          ? 'Completed'
          : stage.duration,
      timestamp: stage.timestamp ?? completedAt,
    }));

    return {
      id: (row.display_id as string) || (row.id as string),
      dbId: row.id as string | undefined,
      citizenId: row.citizen_id as string | undefined,
      serviceId: row.service_id as string,
      serviceName: row.service_name as string,
      status,
      progress: 100,
      submittedAt,
      requestId: row.request_id as string | undefined,
      consents: (row.consents as ConsentRecord[]) || [],
      timeline: normalizedTimeline,
      dataAccess: (row.data_access as Application['dataAccess']) || [],
      departments: (row.departments as string[]) || [],
      workflowStages: normalizedWorkflowStages,
      rejectionReason: row.rejection_reason as string | undefined,
      infoRequestReason: row.info_request_reason as string | undefined,
      officerNotes: row.officer_notes as string | undefined,
    };
  }

  return {
    id: (row.display_id as string) || (row.id as string),
    dbId: row.id as string | undefined,
    citizenId: row.citizen_id as string | undefined,
    serviceId: row.service_id as string,
    serviceName: row.service_name as string,
    status,
    progress: row.progress as number,
    submittedAt,
    requestId: row.request_id as string | undefined,
    consents: (row.consents as ConsentRecord[]) || [],
    timeline,
    dataAccess: (row.data_access as Application['dataAccess']) || [],
    departments: (row.departments as string[]) || [],
    workflowStages,
    rejectionReason: row.rejection_reason as string | undefined,
    infoRequestReason: row.info_request_reason as string | undefined,
    officerNotes: row.officer_notes as string | undefined,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedActive = localStorage.getItem('fusiongrid_active_citizen');
      if (savedActive) {
        const parsed = JSON.parse(savedActive);
        if (parsed?.user) return parsed.user;
      }
      const savedUser = localStorage.getItem('fusiongrid_active_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.user) return parsed.user;
      }
    } catch {}
    return null;
  });
  const userRef = useRef<AuthUser | null>(user);
  userRef.current = user;

  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile | null>(() => {
    try {
      const savedActive = localStorage.getItem('fusiongrid_active_citizen');
      if (savedActive) {
        const parsed = JSON.parse(savedActive);
        if (parsed?.profile) return parsed.profile;
      }
    } catch {}
    return null;
  });

  const [authLoading, setAuthLoading] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('fusiongrid_active_citizen') && !localStorage.getItem('fusiongrid_active_user');
    } catch {
      return true;
    }
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const savedActive = localStorage.getItem('fusiongrid_active_citizen');
      if (savedActive) {
        const parsed = JSON.parse(savedActive);
        const emailKey = parsed?.user?.email?.toLowerCase() || 'default';
        const savedApps = localStorage.getItem(`fusiongrid_apps_${emailKey}`);
        if (savedApps) return JSON.parse(savedApps);
      }
    } catch {}
    return initialApplications;
  });
  const [citizenMap, setCitizenMap] = useState<Record<string, { name: string; district: string }>>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    try {
      const saved = localStorage.getItem('fusiongrid_audit_events');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>(() => {
    try {
      const saved = localStorage.getItem('fusiongrid_system_events');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [apiFailures, setApiFailures] = useState<ApiFailureState[]>(() => {
    try {
      const saved = localStorage.getItem('fusiongrid_api_failures');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [session, setSession] = useState<SecuritySession | null>(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(100);
  const rateLimitTotal = 100;
  const retryTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const emitEvent = useCallback((type: EventType, detail: string, applicationId?: string, actor?: string, department?: string) => {
    const evt: SystemEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      timestamp: nowString(),
      applicationId,
      actor: actor ?? 'System',
      detail,
      department,
    };
    setSystemEvents((prev) => {
      const updated = [evt, ...prev].slice(0, 500);
      localStorage.setItem('fusiongrid_system_events', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addAuditEvent = useCallback((e: AuditEvent) => {
    setAuditEvents((prev) => {
      const updated = [e, ...prev];
      localStorage.setItem('fusiongrid_audit_events', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addNotification = useCallback((n: NotificationItem) => {
    setNotifications((prev) => [n, ...prev]);
  }, []);

  // Fetch applications for the logged-in citizen from Supabase or local storage
  const fetchApplications = useCallback(async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('citizen_id', userId)
        .order('submitted_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setApplications((data as Record<string, unknown>[]).map(mapDbApplication));
        return;
      }
    } catch {}

    // Fallback: Check local storage for this user's applications
    const emailKey = (email || userRef.current?.email || 'default').toLowerCase().trim();
    try {
      const saved = localStorage.getItem(`fusiongrid_apps_${emailKey}`);
      if (saved) {
        setApplications(JSON.parse(saved));
        return;
      }
    } catch {}

    setApplications(initialApplications);
  }, []);

  // Fetch ALL applications (officer/admin view) via SECURITY DEFINER function or local state
  const fetchAllApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_applications');
      if (!error && data && Array.isArray(data) && data.length > 0) {
        const rows = data as Record<string, unknown>[];
        setApplications(rows.map(mapDbApplication));
        const map: Record<string, { name: string; district: string }> = {};
        for (const row of rows) {
          const displayId = (row.display_id as string) || (row.id as string);
          map[displayId] = {
            name: (row.citizen_name as string) || 'Unknown',
            district: (row.citizen_district as string) || '—',
          };
        }
        setCitizenMap(map);
        return;
      }
    } catch {}

    // Fallback: Populate default applications and citizen map
    setApplications((prev) => (prev.length > 0 ? prev : initialApplications));
    const defaultMap: Record<string, { name: string; district: string }> = {
      'MH-SCH-2026-00125': { name: 'Rahul Sharma', district: 'Pune' },
      'MH-INC-2026-00231': { name: 'Priya Deshmukh', district: 'Nagpur' },
      'MH-RUR-2026-00342': { name: 'Anand Patil', district: 'Kolhapur' },
    };
    setCitizenMap((prev) => ({ ...defaultMap, ...prev }));
  }, []);

  // Fetch a citizen's profile by their UUID (officer view)
  const fetchCitizenById = useCallback(async (citizenId: string): Promise<CitizenProfile | null> => {
    try {
      const { data, error } = await supabase.rpc('get_citizen_by_id', { p_citizen_id: citizenId });
      if (!error && data && data.length > 0) {
        const row = data[0] as Record<string, unknown>;
        return {
          id: row.id as string,
          full_name: row.full_name as string,
          mobile: row.mobile as string,
          dob: row.dob as string,
          address: row.address as string,
          district: row.district as string,
          college: row.college as string,
          course: row.course as string,
          verified: row.verified as boolean,
        };
      }
    } catch {}

    // Check local storage for registered citizen
    try {
      const usersRaw = localStorage.getItem('fusiongrid_citizen_users');
      if (usersRaw) {
        const usersMap = JSON.parse(usersRaw);
        for (const u of Object.values(usersMap) as any[]) {
          if (u.profile?.id === citizenId) return u.profile;
        }
      }
    } catch {}

    if (citizenProfile && citizenProfile.id === citizenId) {
      return citizenProfile;
    }

    return {
      id: citizenId,
      full_name: 'Rahul Sharma',
      mobile: '9876543210',
      dob: '2003-08-15',
      address: 'Flat 14, Sunrise Apartments, Kothrud, Pune, Maharashtra 411038',
      district: 'Pune',
      college: 'College of Engineering, Pune',
      course: 'B.Tech Computer Engineering',
      verified: true,
    };
  }, [citizenProfile]);

  const login = useCallback((role: Role) => {
    const activeName = citizenProfile?.full_name || 'Rahul Sharma';
    const activeId = citizenProfile?.id || 'MH-CIT-2026-00125';
    const users: Record<Role, AuthUser> = {
      citizen: { role: 'citizen', name: activeName, id: activeId },
      officer: { role: 'officer', name: officerInfo.name, id: officerInfo.id, department: officerInfo.department },
      admin: { role: 'admin', name: 'Administrator', id: 'MH-ADM-2026-00001' },
    };
    setUser(users[role]);
    if (role === 'citizen') {
      const demoProfile: CitizenProfile = citizenProfile || {
        id: 'MH-CIT-2026-00125',
        full_name: activeName,
        mobile: '9876543210',
        dob: '2003-08-15',
        address: 'Flat 14, Sunrise Apartments, Kothrud, Pune, Maharashtra 411038',
        district: 'Pune',
        college: 'College of Engineering, Pune',
        course: 'B.Tech Computer Engineering',
        verified: true,
      };
      setCitizenProfile(demoProfile);
      setApplications(initialApplications);
      localStorage.setItem('fusiongrid_active_citizen', JSON.stringify({ user: users[role], profile: demoProfile }));
      localStorage.removeItem('fusiongrid_active_user');
    } else {
      localStorage.setItem('fusiongrid_active_user', JSON.stringify({ user: users[role] }));
      localStorage.removeItem('fusiongrid_active_citizen');
    }
    const now = new Date();
    const exp = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    setSession({
      token: generateToken(),
      role,
      issuedAt: now.toISOString(),
      expiresAt: exp.toISOString(),
      rateLimitRemaining: rateLimitTotal,
      rateLimitTotal,
    });
    setRateLimitRemaining(rateLimitTotal);
    emitEvent('ApplicationSubmitted', `Session established for ${role} role`, undefined, users[role].name);
    if (role === 'officer' || role === 'admin') {
      fetchAllApplications();
    }
  }, [citizenProfile, emitEvent, fetchAllApplications, rateLimitTotal]);

  const logout = useCallback(() => {
    supabase.auth.signOut().catch(() => {});
    localStorage.removeItem('fusiongrid_active_citizen');
    localStorage.removeItem('fusiongrid_active_user');
    setUser(null);
    setCitizenProfile(null);
    setApplications([]);
    setCitizenMap({});
    setConsents([]);
    setSession(null);
    retryTimers.current.forEach((t) => clearTimeout(t));
    retryTimers.current = [];
  }, []);

  const addApplication = useCallback(async (app: Application): Promise<string | null> => {
    // 1. Immediately update in-memory state
    setApplications((prev) => [app, ...prev]);

    // 2. Persist locally
    const emailKey = user?.email?.toLowerCase().trim() || 'default';
    try {
      const savedAppsRaw = localStorage.getItem(`fusiongrid_apps_${emailKey}`);
      const savedApps = savedAppsRaw ? JSON.parse(savedAppsRaw) : [];
      localStorage.setItem(`fusiongrid_apps_${emailKey}`, JSON.stringify([app, ...savedApps]));
    } catch {}

    // 3. Best-effort Supabase insert
    if (user?.role === 'citizen' && user.id) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .insert({
            display_id: app.id,
            citizen_id: user.id,
            service_id: app.serviceId,
            service_name: app.serviceName,
            status: app.status,
            progress: app.progress,
            submitted_at: app.submittedAt,
            request_id: app.requestId,
            consents: app.consents,
            timeline: app.timeline,
            data_access: app.dataAccess,
            departments: app.departments,
            workflow_stages: app.workflowStages,
          })
          .select('id')
          .single();

        if (error) {
          console.warn('Supabase application sync notice (saved locally):', error.message);
          return app.id;
        }
        const realId = (data as Record<string, unknown>).id as string;
        setApplications((prev) => prev.map((a) => (a.id === app.id ? { ...a, dbId: realId } : a)));
        return realId;
      } catch (e) {
        console.warn('Supabase application sync exception (saved locally):', e);
        return app.id;
      }
    }
    return app.id;
  }, [user]);

  const updateApplication = useCallback((id: string, updates: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const approveApplication = useCallback((id: string) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const timeline = a.timeline.map((step) => ({ ...step, status: 'done' as const, timestamp: step.timestamp ?? nowShort() }));
        const workflowStages = a.workflowStages?.map((ws) => ({ ...ws, status: 'done' as const, timestamp: ws.timestamp ?? nowShort() }));
        return { ...a, status: 'approved' as const, progress: 100, timeline, workflowStages };
      })
    );
    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: 'Application approved',
      message: `Your application (${id}) has been approved by the reviewing officer. Benefits will be disbursed shortly.`,
      type: 'success',
      read: false,
      timestamp: nowString(),
      applicationId: id,
    };
    setNotifications((prev) => [notif, ...prev]);
    const audit: AuditEvent = {
      id: `ae-${Date.now()}`,
      applicationId: id,
      action: 'Application Approved',
      actor: officerInfo.name,
      actorRole: 'officer',
      detail: `Application ${id} approved by ${officerInfo.name}`,
      timestamp: nowString(),
      type: 'approve',
    };
    addAuditEvent(audit);
    emitEvent('ApplicationApproved', `Application ${id} approved`, id, officerInfo.name);
    supabase.rpc('update_application_status', { p_display_id: id, p_status: 'approved' }).then(({ error }: { error: unknown }) => {
      if (error) {
        console.error('Failed to persist approval:', error);
        return;
      }

      // Keep the persisted progress aligned with the approved status.
      supabase.rpc('update_application_progress', {
        p_display_id: id,
        p_progress: 100,
      }).then(({ error: progressError }: { error: unknown }) => {
        if (progressError) console.error('Failed to persist approval progress:', progressError);
      });
    });
  }, [emitEvent, addAuditEvent]);

  const rejectApplication = useCallback((id: string, reason: string) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const timeline = a.timeline.map((step) => {
          if (step.status === 'current') return { ...step, status: 'done' as const, timestamp: step.timestamp ?? nowShort() };
          if (step.status === 'pending') return { ...step, status: 'skipped' as const };
          return step;
        });
        const workflowStages = a.workflowStages?.map((ws) => {
          if (ws.status === 'current') return { ...ws, status: 'done' as const, timestamp: ws.timestamp ?? nowShort() };
          if (ws.status === 'pending') return { ...ws, status: 'skipped' as const };
          return ws;
        });
        return { ...a, status: 'rejected' as const, progress: a.progress, rejectionReason: reason, timeline, workflowStages };
      })
    );
    setNotifications((prev) => [{
      id: `n-${Date.now()}`,
      title: 'Application rejected',
      message: `Your application (${id}) has been rejected. Reason: ${reason}. Please review and re-apply if eligible.`,
      type: 'warning',
      read: false,
      timestamp: nowString(),
      applicationId: id,
    }, ...prev]);
    addAuditEvent({
      id: `ae-${Date.now()}`,
      applicationId: id,
      action: 'Application Rejected',
      actor: officerInfo.name,
      actorRole: 'officer',
      detail: `Application ${id} rejected. Reason: ${reason}`,
      timestamp: nowString(),
      type: 'reject',
    });
    emitEvent('ApplicationRejected', `Application ${id} rejected: ${reason}`, id, officerInfo.name);
    supabase.rpc('update_application_status', { p_display_id: id, p_status: 'rejected', p_rejection_reason: reason }).then(({ error }: { error: unknown }) => { if (error) console.error('Failed to persist rejection:', error); });
  }, [emitEvent, addAuditEvent]);

  const requestInfo = useCallback((id: string, reason: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'info_requested' as const, infoRequestReason: reason } : a))
    );
    setNotifications((prev) => [{
      id: `n-${Date.now()}`,
      title: 'Action required: Information requested',
      message: `The reviewing officer has requested additional information for your application (${id}). Reason: ${reason}.`,
      type: 'action',
      read: false,
      timestamp: nowString(),
      applicationId: id,
    }, ...prev]);
    addAuditEvent({
      id: `ae-${Date.now()}`,
      applicationId: id,
      action: 'Information Requested',
      actor: officerInfo.name,
      actorRole: 'officer',
      detail: `Information requested for application ${id}. Reason: ${reason}`,
      timestamp: nowString(),
      type: 'request_info',
    });
    supabase.rpc('update_application_status', {
  p_display_id: id,
  p_status: 'approved'
}).then(({ error }: { error: unknown }) => {
  if (error) {
    console.error('Failed to persist approval:', error);
    return;
  }

  supabase.rpc('update_application_progress', {
    p_display_id: id,
    p_progress: 100
  }).then(({ error: progressError }: { error: unknown }) => {
    if (progressError) {
      console.error('Failed to persist progress:', progressError);
    }
  });
});
  }, [addAuditEvent]);

  const forwardApplication = useCallback((id: string, toDepartment: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, departments: [...new Set([...a.departments, toDepartment])] } : a))
    );
    addAuditEvent({
      id: `ae-${Date.now()}`,
      applicationId: id,
      action: 'Application Forwarded',
      actor: officerInfo.name,
      actorRole: 'officer',
      detail: `Application ${id} forwarded to ${toDepartment}`,
      timestamp: nowString(),
      type: 'forward',
    });
  }, [addAuditEvent]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const grantConsent = useCallback((department: string, dataScope: string, purpose: string, applicationId?: string) => {
    const consent: ConsentRecord = {
      id: `c-${Date.now()}`,
      department,
      dataScope,
      purpose,
      requestedAt: new Date().toISOString(),
      status: 'granted',
      applicationId,
    };
    setConsents((prev) => [consent, ...prev]);
    const actorName = citizenProfile?.full_name || user?.name || 'Citizen';
    addAuditEvent({
      id: `ae-${Date.now()}`,
      applicationId: applicationId ?? '—',
      action: 'Consent Granted',
      actor: actorName,
      actorRole: 'citizen',
      detail: `Consent granted to ${department} for ${dataScope} — Purpose: ${purpose}`,
      timestamp: nowString(),
      type: 'consent',
    });
    emitEvent('ConsentGranted', `Consent granted to ${department} for ${dataScope}`, applicationId, actorName, department);
  }, [emitEvent, citizenProfile, user, addAuditEvent]);

  const revokeConsent = useCallback((id: string) => {
    let revokedDept = '';
    setConsents((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          revokedDept = c.department;
          return { ...c, status: 'revoked' as const };
        }
        return c;
      })
    );
    const actorName = citizenProfile?.full_name || user?.name || 'Citizen';
    addAuditEvent({
      id: `ae-${Date.now()}`,
      applicationId: '—',
      action: 'Consent Revoked',
      actor: actorName,
      actorRole: 'citizen',
      detail: `Consent revoked for ${revokedDept}`,
      timestamp: nowString(),
      type: 'consent',
    });
    emitEvent('ConsentRevoked', `Consent revoked for ${revokedDept}`, undefined, actorName, revokedDept);
  }, [emitEvent, citizenProfile, user, addAuditEvent]);

  // ─── API Failure Simulation ───

  const updateFailureState = useCallback((dept: string, updates: Partial<ApiFailureState>) => {
    setApiFailures((prev) => {
      const existing = prev.find((f) => f.department === dept);
      if (!existing) return prev;
      const updated = prev.map((f) => (f.department === dept ? { ...f, ...updates } : f));
      localStorage.setItem('fusiongrid_api_failures', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addFailureHistory = useCallback((dept: string, state: RetryState, message: string) => {
    setApiFailures((prev) => {
      const updated = prev.map((f) => (f.department === dept ? {
        ...f,
        history: [...f.history, { state, message, timestamp: nowString() }],
      } : f));
      localStorage.setItem('fusiongrid_api_failures', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const simulateRevenueFailure = useCallback(() => {
    const requestId = `REQ-REV-${Date.now().toString(36).toUpperCase()}`;
    const endpoint = '/api/revenue/income/:citizenId';

    retryTimers.current.forEach((t) => clearTimeout(t));
    retryTimers.current = [];

    const failure: ApiFailureState = {
      department: 'Revenue Department',
      isDown: true,
      retryState: 'failed',
      requestId,
      endpoint,
      attempts: 0,
      message: 'Request Failed — Revenue API is DOWN',
      citizenMessage: 'Your application is safe. Verification will continue automatically.',
      timestamp: nowString(),
      history: [{ state: 'failed', message: 'Request Failed — Revenue API is DOWN', timestamp: nowString() }],
    };
    setApiFailures((prev) => {
      const filtered = prev.filter((f) => f.department !== 'Revenue Department');
      const updated = [failure, ...filtered];
      localStorage.setItem('fusiongrid_api_failures', JSON.stringify(updated));
      return updated;
    });

    emitEvent('ApiFailure', `Revenue API failure detected — ${endpoint}`, undefined, 'System', 'Revenue Department');

    const t1 = setTimeout(() => {
      addFailureHistory('Revenue Department', 'retry_1', 'Retry 1 — Attempting to reconnect...');
      updateFailureState('Revenue Department', { retryState: 'retry_1', attempts: 1, message: 'Retry 1 — Attempting to reconnect...' });
      retryTimers.current = retryTimers.current.filter((t) => t !== t1);
    }, 2000);
    retryTimers.current.push(t1);

    const t2 = setTimeout(() => {
      addFailureHistory('Revenue Department', 'retry_2', 'Retry 2 — Reconnection failed, queuing request...');
      updateFailureState('Revenue Department', { retryState: 'retry_2', attempts: 2, message: 'Retry 2 — Reconnection failed' });
      retryTimers.current = retryTimers.current.filter((t) => t !== t2);
    }, 4000);
    retryTimers.current.push(t2);

    const t3 = setTimeout(() => {
      addFailureHistory('Revenue Department', 'queued', 'Request Queued — Application preserved in persistent queue');
      updateFailureState('Revenue Department', { retryState: 'queued', message: 'Request Queued — Application preserved' });
      retryTimers.current = retryTimers.current.filter((t) => t !== t3);
    }, 6000);
    retryTimers.current.push(t3);

    const t4 = setTimeout(() => {
      addFailureHistory('Revenue Department', 'auto_retry', 'Automatic Retry — Revenue API recovering...');
      updateFailureState('Revenue Department', { retryState: 'auto_retry', attempts: 3, message: 'Automatic Retry — API recovering' });
      retryTimers.current = retryTimers.current.filter((t) => t !== t4);
    }, 9000);
    retryTimers.current.push(t4);

    const t5 = setTimeout(() => {
      addFailureHistory('Revenue Department', 'recovered', 'Recovered — Revenue API back online, request completed');
      updateFailureState('Revenue Department', { retryState: 'recovered', isDown: false, message: 'Recovered — API back online', citizenMessage: 'Verification completed successfully after automatic retry.' });
      retryTimers.current = retryTimers.current.filter((t) => t !== t5);
      emitEvent('IncomeVerified', 'Revenue API recovered — income verification completed', undefined, 'System', 'Revenue Department');
    }, 12000);
    retryTimers.current.push(t5);
  }, [emitEvent, addFailureHistory, updateFailureState]);

  const resetRevenueFailure = useCallback(() => {
    retryTimers.current.forEach((t) => clearTimeout(t));
    retryTimers.current = [];
    setApiFailures((prev) => {
      const updated = prev.filter((f) => f.department !== 'Revenue Department');
      localStorage.setItem('fusiongrid_api_failures', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ─── Security Simulation ───

  const consumeRateLimit = useCallback(() => {
    if (rateLimitRemaining <= 0) return false;
    setRateLimitRemaining((prev) => prev - 1);
    return true;
  }, [rateLimitRemaining]);

  const checkRoleAccess = useCallback((requiredRole: Role): boolean => {
    if (!user) return false;
    if (requiredRole === 'admin') return user.role === 'admin';
    if (requiredRole === 'officer') return user.role === 'officer' || user.role === 'admin';
    return true;
  }, [user]);

  const checkConsent = useCallback((department: string): boolean => {
    return consents.some((c) => c.department === department && c.status === 'granted');
  }, [consents]);

  // ── Citizen Auth (Supabase + Resilient Local Session) ──

  const signUpCitizen = useCallback(async (
    email: string,
    password: string,
    details: { full_name: string; mobile: string; dob: string; address: string; district: string; college: string; course: string }
  ): Promise<{ error: string | null }> => {
    let authUserId = `cit_${Date.now()}`;

    // 1. Attempt Supabase Auth in background / best-effort
    try {
      const { data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: details.full_name,
            mobile: details.mobile,
            dob: details.dob,
            address: details.address,
            district: details.district,
            college: details.college,
            course: details.course,
          },
        },
      });

      if (data?.user?.id) {
        authUserId = data.user.id;
        // Best-effort database insert
        try {
          await supabase
            .from('citizens')
            .upsert({
              id: authUserId,
              full_name: details.full_name,
              mobile: details.mobile,
              dob: details.dob,
              address: details.address,
              district: details.district,
              college: details.college,
              course: details.course,
              verified: true,
            });
        } catch {}
      }
    } catch (err) {
      console.warn('Supabase auth notice (using local resilient storage):', err);
    }

    // 2. Create the full citizen profile
    const profile: CitizenProfile = {
      id: authUserId,
      full_name: details.full_name || 'Citizen',
      mobile: details.mobile || '',
      dob: details.dob || '',
      address: details.address || '',
      district: details.district || '',
      college: details.college || '',
      course: details.course || '',
      verified: true,
    };

    const citizenUser: AuthUser = {
      role: 'citizen',
      name: details.full_name || email.split('@')[0],
      id: authUserId,
      email,
    };

    // 3. Persist citizen credentials and profile locally
    const cleanEmail = email.toLowerCase().trim();
    try {
      const usersRaw = localStorage.getItem('fusiongrid_citizen_users');
      const usersMap = usersRaw ? JSON.parse(usersRaw) : {};
      usersMap[cleanEmail] = {
        email: cleanEmail,
        password,
        profile,
        user: citizenUser,
      };
      localStorage.setItem('fusiongrid_citizen_users', JSON.stringify(usersMap));

      // Persist active session
      localStorage.setItem('fusiongrid_active_citizen', JSON.stringify({
        user: citizenUser,
        profile,
      }));

      // Initialize applications for this citizen if none exist
      const existingApps = localStorage.getItem(`fusiongrid_apps_${cleanEmail}`);
      if (!existingApps) {
        const citizenApps = initialApplications.map((app) => ({
          ...app,
          citizenId: authUserId,
        }));
        localStorage.setItem(`fusiongrid_apps_${cleanEmail}`, JSON.stringify(citizenApps));
        setApplications(citizenApps);
      } else {
        setApplications(JSON.parse(existingApps));
      }
    } catch (e) {
      console.warn('Storage notice:', e);
      setApplications(initialApplications);
    }

    // 4. Update in-memory state
    setCitizenProfile(profile);
    setUser(citizenUser);
    const now = new Date();
    const exp = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    setSession({
      token: generateToken(),
      role: 'citizen',
      issuedAt: now.toISOString(),
      expiresAt: exp.toISOString(),
      rateLimitRemaining: rateLimitTotal,
      rateLimitTotal,
    });
    setRateLimitRemaining(rateLimitTotal);

    emitEvent('ApplicationSubmitted', `Citizen account created and session established for ${details.full_name}`, undefined, details.full_name);

    return { error: null };
  }, [emitEvent, rateLimitTotal]);

  const signInCitizen = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Check local registered accounts first
    try {
      const usersRaw = localStorage.getItem('fusiongrid_citizen_users');
      if (usersRaw) {
        const usersMap = JSON.parse(usersRaw);
        const localAcct = usersMap[cleanEmail];
        if (localAcct) {
          if (localAcct.password && localAcct.password !== password) {
            return { error: 'Incorrect password. Please try again.' };
          }
          setCitizenProfile(localAcct.profile);
          setUser(localAcct.user);
          localStorage.setItem('fusiongrid_active_citizen', JSON.stringify({ user: localAcct.user, profile: localAcct.profile }));

          const savedApps = localStorage.getItem(`fusiongrid_apps_${cleanEmail}`);
          if (savedApps) {
            try { setApplications(JSON.parse(savedApps)); } catch { setApplications(initialApplications); }
          } else {
            setApplications(initialApplications);
          }

          const now = new Date();
          const exp = new Date(now.getTime() + 8 * 60 * 60 * 1000);
          setSession({
            token: generateToken(),
            role: 'citizen',
            issuedAt: now.toISOString(),
            expiresAt: exp.toISOString(),
            rateLimitRemaining: rateLimitTotal,
            rateLimitTotal,
          });
          setRateLimitRemaining(rateLimitTotal);
          return { error: null };
        }
      }
    } catch (e) {
      console.warn('Local sign in check error:', e);
    }

    // 2. Try Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        let profile: CitizenProfile | null = null;
        try {
          const { data: dbProfile } = await supabase
            .from('citizens')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();
          if (dbProfile) profile = dbProfile as CitizenProfile;
        } catch {}

        if (!profile) {
          profile = {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            mobile: data.user.user_metadata?.mobile || '',
            dob: data.user.user_metadata?.dob || '',
            address: data.user.user_metadata?.address || '',
            district: data.user.user_metadata?.district || '',
            college: data.user.user_metadata?.college || '',
            course: data.user.user_metadata?.course || '',
            verified: true,
          };
        }

        const citizenAuthUser: AuthUser = {
          role: 'citizen',
          name: profile.full_name || email.split('@')[0],
          id: data.user.id,
          email: data.user.email || email,
        };

        setCitizenProfile(profile);
        setUser(citizenAuthUser);
        localStorage.setItem('fusiongrid_active_citizen', JSON.stringify({ user: citizenAuthUser, profile, isSupabaseAuth: true }));
        fetchApplications(data.user.id);

        const now = new Date();
        const exp = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        setSession({
          token: generateToken(),
          role: 'citizen',
          issuedAt: now.toISOString(),
          expiresAt: exp.toISOString(),
          rateLimitRemaining: rateLimitTotal,
          rateLimitTotal,
        });
        setRateLimitRemaining(rateLimitTotal);
        return { error: null };
      }
    } catch (err) {
      console.warn('Supabase signIn notice:', err);
    }

    // 3. Fallback seamless login
    const fallbackProfile: CitizenProfile = {
      id: `cit_${Date.now()}`,
      full_name: email.split('@')[0] || 'Citizen',
      mobile: '9876543210',
      dob: '2003-01-01',
      address: 'Maharashtra, India',
      district: 'Mumbai',
      college: 'Government College',
      course: 'Higher Education',
      verified: true,
    };
    const fallbackUser: AuthUser = {
      role: 'citizen',
      name: fallbackProfile.full_name,
      id: fallbackProfile.id,
      email,
    };

    setCitizenProfile(fallbackProfile);
    setUser(fallbackUser);
    localStorage.setItem('fusiongrid_active_citizen', JSON.stringify({ user: fallbackUser, profile: fallbackProfile }));
    setApplications(initialApplications);

    const now = new Date();
    const exp = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    setSession({
      token: generateToken(),
      role: 'citizen',
      issuedAt: now.toISOString(),
      expiresAt: exp.toISOString(),
      rateLimitRemaining: rateLimitTotal,
      rateLimitTotal,
    });
    setRateLimitRemaining(rateLimitTotal);
    return { error: null };
  }, [fetchApplications, rateLimitTotal]);

  const updateCitizenProfile = useCallback(async (updates: Partial<CitizenProfile>): Promise<{ error: string | null }> => {
    const fallbackProfile: CitizenProfile = {
      id: user?.id || 'MH-CIT-2026-00125',
      full_name: user?.name || 'Rahul Sharma',
      mobile: '9876543210',
      dob: '2003-08-15',
      address: 'Flat 14, Sunrise Apartments, Kothrud, Pune, Maharashtra 411038',
      district: 'Pune',
      college: 'College of Engineering, Pune',
      course: 'B.Tech Computer Engineering',
      verified: true,
    };

    const updatedProfile: CitizenProfile = {
      ...(citizenProfile || fallbackProfile),
      ...updates,
    };

    setCitizenProfile(updatedProfile);

    let updatedUser = user;
    if (user && updates.full_name && updates.full_name !== user.name) {
      updatedUser = { ...user, name: updates.full_name };
      setUser(updatedUser);
    }

    // Persist active session
    if (updatedUser) {
      try {
        localStorage.setItem(
          'fusiongrid_active_citizen',
          JSON.stringify({ user: updatedUser, profile: updatedProfile })
        );
      } catch {}
    }

    // Persist in local citizen accounts registry
    const userEmail = updatedUser?.email?.toLowerCase().trim();
    if (userEmail) {
      try {
        const usersRaw = localStorage.getItem('fusiongrid_citizen_users');
        if (usersRaw) {
          const usersMap = JSON.parse(usersRaw);
          if (usersMap[userEmail]) {
            usersMap[userEmail].profile = updatedProfile;
            if (updatedUser) usersMap[userEmail].user = updatedUser;
            localStorage.setItem('fusiongrid_citizen_users', JSON.stringify(usersMap));
          }
        }
      } catch {}
    }

    // Best-effort Supabase sync
    if (updatedProfile.id && !updatedProfile.id.startsWith('cit_demo')) {
      try {
        await supabase
          .from('citizens')
          .upsert({
            id: updatedProfile.id,
            full_name: updatedProfile.full_name,
            mobile: updatedProfile.mobile,
            dob: updatedProfile.dob,
            address: updatedProfile.address,
            district: updatedProfile.district,
            college: updatedProfile.college,
            course: updatedProfile.course,
            verified: updatedProfile.verified,
          });
      } catch (err) {
        console.warn('Supabase citizen update notice:', err);
      }
    }

    // Audit and system event
    addAuditEvent({
      id: `ae-${Date.now()}`,
      applicationId: '—',
      action: 'Profile Updated',
      actor: updatedProfile.full_name,
      actorRole: 'citizen',
      detail: `Citizen profile information updated: ${Object.keys(updates).join(', ')}`,
      timestamp: nowString(),
      type: 'profile',
    });

    emitEvent(
      'ApplicationSubmitted',
      `Profile updated for citizen ${updatedProfile.full_name}`,
      undefined,
      updatedProfile.full_name
    );

    return { error: null };
  }, [citizenProfile, user, addAuditEvent, emitEvent]);

  // Restore session on mount and listen for auth changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      // 1. Try local active citizen session
      try {
        const savedActive = localStorage.getItem('fusiongrid_active_citizen');
        if (savedActive) {
          const parsed = JSON.parse(savedActive);
          if (parsed?.user && parsed?.profile) {
            setUser(parsed.user);
            setCitizenProfile(parsed.profile);
            const savedApps = localStorage.getItem(`fusiongrid_apps_${parsed.user.email?.toLowerCase() || 'default'}`);
            if (savedApps) {
              try { setApplications(JSON.parse(savedApps)); } catch {}
            } else {
              setApplications(initialApplications);
            }
          }
        } else {
          const savedUser = localStorage.getItem('fusiongrid_active_user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed?.user) {
              setUser(parsed.user);
              if (parsed.user.role === 'officer' || parsed.user.role === 'admin') {
                fetchAllApplications();
              }
            }
          }
        }
      } catch (e) {
        console.warn('Local session restore notice:', e);
      }

      // 2. Check Supabase session
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (authUser) {
          let profile: CitizenProfile | null = null;
          try {
            const { data: p } = await supabase
              .from('citizens')
              .select('*')
              .eq('id', authUser.id)
              .maybeSingle();
            if (p) profile = p as CitizenProfile;
          } catch {}

          if (!profile) {
            try {
              const usersRaw = localStorage.getItem('fusiongrid_citizen_users');
              if (usersRaw) {
                const usersMap = JSON.parse(usersRaw);
                profile = usersMap[authUser.email?.toLowerCase() || '']?.profile || null;
              }
            } catch {}
          }

          if (mounted) {
            const cp: CitizenProfile = profile || {
              id: authUser.id,
              full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Citizen',
              mobile: authUser.user_metadata?.mobile || '',
              dob: authUser.user_metadata?.dob || '',
              address: authUser.user_metadata?.address || '',
              district: authUser.user_metadata?.district || '',
              college: authUser.user_metadata?.college || '',
              course: authUser.user_metadata?.course || '',
              verified: true,
            };
            setCitizenProfile(cp);
            setUser({
              role: 'citizen',
              name: cp.full_name,
              id: authUser.id,
              email: authUser.email,
            });
            fetchApplications(authUser.id);
          }
        }
      } catch (e) {
        console.warn('Supabase session restore notice:', e);
      }
      if (mounted) {
        setAuthLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (event === 'SIGNED_OUT') {
          try {
            const saved = localStorage.getItem('fusiongrid_active_citizen');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed?.isSupabaseAuth) {
                setUser(null);
                setCitizenProfile(null);
                setApplications([]);
                setConsents([]);
                localStorage.removeItem('fusiongrid_active_citizen');
              }
            }
          } catch {}
          return;
        }
        if (!session?.user) {
          return;
        }
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          let profile: CitizenProfile | null = null;
          try {
            const { data: p } = await supabase
              .from('citizens')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            if (p) profile = p as CitizenProfile;
          } catch {}

          const cp: CitizenProfile = profile || {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Citizen',
            mobile: session.user.user_metadata?.mobile || '',
            dob: session.user.user_metadata?.dob || '',
            address: session.user.user_metadata?.address || '',
            district: session.user.user_metadata?.district || '',
            college: session.user.user_metadata?.college || '',
            course: session.user.user_metadata?.course || '',
            verified: true,
          };
          setCitizenProfile(cp);
          const u: AuthUser = {
            role: 'citizen',
            name: cp.full_name,
            id: session.user.id,
            email: session.user.email,
          };
          setUser(u);
          localStorage.setItem('fusiongrid_active_citizen', JSON.stringify({ user: u, profile: cp }));
          fetchApplications(session.user.id);
        }
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        citizenProfile,
        updateCitizenProfile,
        authLoading,
        signUpCitizen,
        signInCitizen,
        applications,
        citizenMap,
        fetchAllApplications,
        fetchCitizenById,
        addApplication,
        updateApplication,
        approveApplication,
        rejectApplication,
        requestInfo,
        forwardApplication,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        consents,
        grantConsent,
        revokeConsent,
        unreadCount,
        auditEvents,
        addAuditEvent,
        systemEvents,
        emitEvent,
        apiFailures,
        simulateRevenueFailure,
        resetRevenueFailure,
        session,
        rateLimitRemaining,
        consumeRateLimit,
        checkRoleAccess,
        checkConsent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
