import { useState } from 'react';
import {
  Activity, CheckCircle2, Clock, Circle, SkipForward,
  Database, Building2, ArrowRight, Eye, ShieldCheck,
  FileText, XCircle, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';
import { workflowEventLog } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface WorkflowMonitorProps {
  navigate: (to: string) => void;
}

const stageStatusConfig = {
  done: { icon: CheckCircle2, color: 'bg-success text-success-foreground', label: 'Completed' },
  current: { icon: Clock, color: 'bg-amber-100 text-amber-600 animate-pulse-ring', label: 'In Progress' },
  pending: { icon: Circle, color: 'border-2 border-muted bg-background text-muted-foreground', label: 'Pending' },
  skipped: { icon: SkipForward, color: 'bg-muted text-muted-foreground', label: 'Skipped' },
};

// Mock document metadata for each workflow event
const eventDocuments: Record<string, { name: string; type: string; size: string; uploadedAt: string; hash: string }> = {
  we1: { name: 'Application_Form_MH-SCH-2026-00125.pdf', type: 'Application Form', size: '245 KB', uploadedAt: '2026-08-18 10:30 AM', hash: 'sha256:a3f8c2…d91e' },
  we2: { name: 'Aadhaar_Verification_Report.pdf', type: 'Identity Proof', size: '128 KB', uploadedAt: '2026-08-18 10:32 AM', hash: 'sha256:b7d1e4…f203' },
  we3: { name: 'Income_Certificate_FY2025.pdf', type: 'Income Certificate', size: '312 KB', uploadedAt: '2026-08-18 10:34 AM', hash: 'sha256:c9e5a1…4b72' },
  we4: { name: 'College_Enrollment_Letter.pdf', type: 'Education Proof', size: '198 KB', uploadedAt: '2026-08-18 10:36 AM', hash: 'sha256:d2f7b3…8c91' },
  we5: { name: 'Data_Quality_Report.pdf', type: 'System Report', size: '89 KB', uploadedAt: '2026-08-18 10:37 AM', hash: 'sha256:e1a4c6…3d50' },
  we6: { name: 'Officer_Review_Dossier.pdf', type: 'Review Dossier', size: '456 KB', uploadedAt: '2026-08-21 02:15 PM', hash: 'sha256:f3b2d8…6a14' },
  we7: { name: 'Application_Form_MH-EDU-2026-00098.pdf', type: 'Application Form', size: '230 KB', uploadedAt: '2026-08-20 09:00 AM', hash: 'sha256:a8c3f1…e720' },
  we8: { name: 'Aadhaar_Card_Scan.pdf', type: 'Identity Proof', size: '142 KB', uploadedAt: '2026-08-20 09:02 AM', hash: 'sha256:b1d9e2…c315' },
  we9: { name: 'Enrollment_Verification_Report.pdf', type: 'Enrollment Proof', size: '175 KB', uploadedAt: '2026-08-20 09:05 AM', hash: 'sha256:c4f6a3…d892' },
  we10: { name: 'Income_Certificate_Pending.pdf', type: 'Income Certificate', size: '290 KB', uploadedAt: '2026-08-22 11:30 AM', hash: 'sha256:d7e2b5…a143' },
};

export function WorkflowMonitor({ navigate }: WorkflowMonitorProps) {
  const { applications } = useApp();
  const [viewingEvent, setViewingEvent] = useState<string | null>(null);
  const [verifiedEvents, setVerifiedEvents] = useState<Record<string, 'verified' | 'rejected'>>({});
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const appsWithWorkflows = applications.filter((a) => a.workflowStages && a.workflowStages.length > 0);

  const currentViewDoc = viewingEvent ? eventDocuments[viewingEvent] : null;
  const currentViewEvt = viewingEvent ? workflowEventLog.find((e) => e.id === viewingEvent) : null;

  const handleVerify = (evtId: string) => {
    setVerifyingId(evtId);
    setTimeout(() => {
      setVerifiedEvents((prev) => ({ ...prev, [evtId]: 'verified' }));
      setVerifyingId(null);
    }, 800);
  };

  const handleReject = (evtId: string) => {
    setVerifyingId(evtId);
    setTimeout(() => {
      setVerifiedEvents((prev) => ({ ...prev, [evtId]: 'rejected' }));
      setVerifyingId(null);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Workflow Monitor</h1>
            <p className="text-sm text-muted-foreground">
              Real-time workflow events and current stage tracking across all applications
            </p>
          </div>
        </div>
      </div>

      {/* Active Workflows */}
      <div className="mb-6">
        <h2 className="mb-3 font-display text-lg font-semibold">Active Workflows</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {appsWithWorkflows.map((app, i) => {
            const currentStage = app.workflowStages!.find((ws) => ws.status === 'current');
            const completedCount = app.workflowStages!.filter((ws) => ws.status === 'done').length;
            const totalCount = app.workflowStages!.length;
            const progress = Math.round((completedCount / totalCount) * 100);

            return (
              <Card
                key={app.id}
                className="cursor-pointer border-border/60 transition-all hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/officer/review/${app.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{app.serviceName}</CardTitle>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{app.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-bold">{progress}%</p>
                      <p className="text-xs text-muted-foreground">{completedCount}/{totalCount} stages</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mini workflow visualization */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
                    {app.workflowStages!.map((stage, idx) => {
                      const cfg = stageStatusConfig[stage.status];
                      const Icon = cfg.icon;
                      return (
                        <div key={stage.id} className="flex items-center gap-1">
                          <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full', cfg.color)}>
                            <Icon className={cn('h-3.5 w-3.5', stage.status === 'pending' && 'h-2 w-2 rounded-full bg-muted-foreground/40')} />
                          </div>
                          {idx < app.workflowStages!.length - 1 && (
                            <div className={cn('h-0.5 w-4 shrink-0', stage.status === 'done' ? 'bg-success' : 'bg-border')} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Current stage */}
                  {currentStage ? (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-2.5">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <div>
                        <p className="text-xs font-semibold text-amber-700">Current Stage: {currentStage.label}</p>
                        <p className="text-xs text-muted-foreground">{currentStage.department} · {currentStage.duration}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 p-2.5">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <p className="text-xs font-semibold text-accent">All stages completed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Event Log */}
      <Card className="border-border/60 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4 text-primary" />
            Workflow Event Log
          </CardTitle>
          <CardDescription>Chronological log of all workflow events — view and verify attached documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[32rem] overflow-y-auto scrollbar-thin">
            {workflowEventLog.map((evt) => {
              const cfg = stageStatusConfig[evt.status as keyof typeof stageStatusConfig] ?? stageStatusConfig.pending;
              const Icon = cfg.icon;
              const verifyStatus = verifiedEvents[evt.id];
              const hasDoc = !!eventDocuments[evt.id];

              return (
                <div key={evt.id} className={cn(
                  'rounded-lg border bg-card p-3 transition-all',
                  verifyStatus === 'verified' && 'border-emerald-200 bg-emerald-50/30',
                  verifyStatus === 'rejected' && 'border-red-200 bg-red-50/30',
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', cfg.color)}>
                      <Icon className={cn('h-4 w-4', evt.status === 'pending' && 'h-2 w-2 rounded-full bg-muted-foreground/40')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{evt.stage}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {verifyStatus === 'verified' && (
                            <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700 text-[10px] gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                          {verifyStatus === 'rejected' && (
                            <Badge className="border-red-200 bg-red-100 text-red-700 text-[10px] gap-1">
                              <XCircle className="h-3 w-3" />
                              Rejected
                            </Badge>
                          )}
                          <Badge variant="outline" className={cn(
                            evt.status === 'done' && 'border-accent/30 bg-accent/10 text-accent',
                            evt.status === 'current' && 'border-amber-300 bg-amber-50 text-amber-700',
                            evt.status === 'pending' && 'border-muted text-muted-foreground',
                          )}>
                            {cfg.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {evt.department}
                        </span>
                        <span>·</span>
                        <span>Duration: {evt.duration}</span>
                        <span>·</span>
                        <span>{evt.timestamp}</span>
                      </div>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/60">{evt.applicationId}</p>

                      {/* Action buttons */}
                      {hasDoc && (
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1.5 text-xs rounded-lg"
                            onClick={() => setViewingEvent(evt.id)}
                          >
                            <Eye className="h-3 w-3" />
                            View Document
                          </Button>
                          {!verifyStatus && (
                            <>
                              <Button
                                size="sm"
                                className="h-7 gap-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700"
                                disabled={verifyingId === evt.id}
                                onClick={() => handleVerify(evt.id)}
                              >
                                {verifyingId === evt.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <ShieldCheck className="h-3 w-3" />
                                )}
                                Verify
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 gap-1.5 text-xs rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                disabled={verifyingId === evt.id}
                                onClick={() => handleReject(evt.id)}
                              >
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* View Document Dialog */}
      <Dialog open={!!viewingEvent} onOpenChange={(open) => { if (!open) setViewingEvent(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Document Details
            </DialogTitle>
            <DialogDescription>
              Attached document for workflow event: {currentViewEvt?.stage}
            </DialogDescription>
          </DialogHeader>

          {currentViewDoc && currentViewEvt && (
            <div className="space-y-4">
              {/* Document preview placeholder */}
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/20">
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{currentViewDoc.name}</p>
                  <p className="text-xs text-muted-foreground/60">Document preview</p>
                </div>
              </div>

              {/* Document metadata */}
              <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Document Type</p>
                    <p className="text-sm font-semibold">{currentViewDoc.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">File Size</p>
                    <p className="text-sm font-semibold">{currentViewDoc.size}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Uploaded At</p>
                    <p className="text-sm font-semibold">{currentViewDoc.uploadedAt}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Application</p>
                    <p className="text-sm font-mono font-semibold">{currentViewEvt.applicationId}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Department</p>
                  <p className="text-sm font-semibold">{currentViewEvt.department}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Integrity Hash</p>
                  <p className="text-xs font-mono text-muted-foreground">{currentViewDoc.hash}</p>
                </div>
              </div>

              {/* Verification status in dialog */}
              {verifiedEvents[viewingEvent!] === 'verified' && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-semibold text-emerald-700">Document has been verified</p>
                </div>
              )}
              {verifiedEvents[viewingEvent!] === 'rejected' && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm font-semibold text-red-700">Document has been rejected</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {viewingEvent && !verifiedEvents[viewingEvent] && (
              <>
                <Button
                  variant="outline"
                  className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => { handleReject(viewingEvent); setViewingEvent(null); }}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => { handleVerify(viewingEvent); setViewingEvent(null); }}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Verify Document
                </Button>
              </>
            )}
            {viewingEvent && verifiedEvents[viewingEvent] && (
              <Button variant="outline" onClick={() => setViewingEvent(null)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

