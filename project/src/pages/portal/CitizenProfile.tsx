import { useState } from 'react';
import {
  ShieldCheck, MapPin, Phone, Calendar, Home, GraduationCap,
  BookOpen, User, IdCard, CheckCircle2, Mail, Edit3,
  ExternalLink, Download, Printer, QrCode, FileText, Check,
  Copy, Eye, ArrowRight, Sparkles, Building2, Lock,
  Cpu
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';

interface CitizenProfileProps {
  navigate?: (to: string) => void;
}

type VerificationType = 'aadhaar' | 'mobile' | 'address' | 'education' | 'income' | null;
type DocumentType = 'aadhaar_card' | 'domicile_cert' | 'income_cert' | 'degree_cert' | null;

export function CitizenProfile({ navigate }: CitizenProfileProps) {
  const { citizenProfile, user, updateCitizenProfile } = useApp();

  const fullName = citizenProfile?.full_name || user?.name || 'Rahul Sharma';
  const mobile = citizenProfile?.mobile || '9876543210';
  const dob = citizenProfile?.dob || '2003-08-15';
  const address = citizenProfile?.address || 'Flat 14, Sunrise Apartments, Kothrud, Pune, Maharashtra 411038';
  const district = citizenProfile?.district || 'Pune';
  const college = citizenProfile?.college || 'College of Engineering, Pune';
  const course = citizenProfile?.course || 'B.Tech Computer Engineering';
  const email = user?.email || 'citizen@fusiongrid.gov.in';
  const rawId = citizenProfile?.id || user?.id || 'MH-CIT-2026-00125';
  const citizenIdDisplay = rawId.length > 20 ? `${rawId.slice(0, 12)}…` : rawId;

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [activeVerification, setActiveVerification] = useState<VerificationType>(null);
  const [activeDocument, setActiveDocument] = useState<DocumentType>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form state
  const [formName, setFormName] = useState(fullName);
  const [formMobile, setFormMobile] = useState(mobile);
  const [formDob, setFormDob] = useState(dob);
  const [formAddress, setFormAddress] = useState(address);
  const [formDistrict, setFormDistrict] = useState(district);
  const [formCollege, setFormCollege] = useState(college);
  const [formCourse, setFormCourse] = useState(course);

  const openEditModal = () => {
    setFormName(fullName);
    setFormMobile(mobile);
    setFormDob(dob);
    setFormAddress(address);
    setFormDistrict(district);
    setFormCollege(college);
    setFormCourse(course);
    setSaveSuccess(false);
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateCitizenProfile({
      full_name: formName,
      mobile: formMobile,
      dob: formDob,
      address: formAddress,
      district: formDistrict,
      college: formCollege,
      course: formCourse,
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setEditModalOpen(false);
      setSaveSuccess(false);
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const fields = [
    { label: 'Full Name', value: fullName, icon: User, key: 'name' },
    { label: 'Email', value: email, icon: Mail, key: 'email' },
    { label: 'Citizen ID', value: citizenIdDisplay, icon: IdCard, mono: true, canCopy: true, fullVal: rawId },
    { label: 'Mobile Number', value: mobile ? `+91 ${mobile}` : '—', icon: Phone, key: 'mobile' },
    {
      label: 'Date of Birth',
      value: dob !== '—' && !isNaN(Date.parse(dob)) ? new Date(dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : dob,
      icon: Calendar,
      key: 'dob',
    },
    { label: 'Address', value: address, icon: Home, key: 'address' },
    { label: 'District', value: `${district}, Maharashtra`, icon: MapPin, key: 'district' },
    { label: 'College / Institute', value: college, icon: GraduationCap, key: 'college' },
    { label: 'Course / Degree', value: course, icon: BookOpen, key: 'course' },
  ];

  const verificationItems = [
    {
      id: 'aadhaar' as const,
      label: 'Identity Verification (Aadhaar)',
      issuer: 'UIDAI · Govt of India',
      status: 'Verified',
      date: '2026-01-15',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
      desc: 'Cryptographic Zero-Knowledge proof matched against Aadhaar registry.',
    },
    {
      id: 'mobile' as const,
      label: 'Mobile Verification (OTP)',
      issuer: 'TRAI & Telecom Gateway',
      status: 'Verified',
      date: '2026-01-15',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
      desc: 'Two-factor OTP verified with registered mobile operator.',
    },
    {
      id: 'address' as const,
      label: 'Address & Domicile Verification',
      issuer: 'Tehsildar & District Magistrate',
      status: 'Verified',
      date: '2026-01-16',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
      desc: 'Maharashtra state domicile verified with land and revenue records.',
    },
    {
      id: 'education' as const,
      label: 'Education Records (DigiLocker)',
      issuer: 'State Higher Education Registry',
      status: 'Verified',
      date: '2026-02-20',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
      desc: 'University enrollment and semester marks verified via DigiLocker NAD.',
    },
    {
      id: 'income' as const,
      label: 'Income Records (Revenue Dept.)',
      issuer: 'Department of Revenue, Govt. of Maharashtra',
      status: 'Verified',
      date: '2026-07-22',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
      desc: 'Certified income certificate auto-fetched from MahaOnline API gateway.',
    },
  ];

  const documents = [
    {
      id: 'aadhaar_card' as const,
      title: 'Aadhaar e-KYC Identity Card',
      dept: 'UIDAI',
      number: `XXXX-XXXX-${mobile.slice(-4) || '8921'}`,
      issued: '15 Jan 2026',
      color: 'from-blue-600 to-indigo-700',
      icon: ShieldCheck,
    },
    {
      id: 'domicile_cert' as const,
      title: 'State Domicile Certificate',
      dept: 'Revenue Dept, Govt. of Maharashtra',
      number: 'MH-DOM-2026-90412',
      issued: '16 Jan 2026',
      color: 'from-amber-600 to-orange-700',
      icon: Home,
    },
    {
      id: 'income_cert' as const,
      title: 'Tahsildar Income Certificate',
      dept: 'Office of the Tehsildar, Pune',
      number: 'MH-INC-2026-88123',
      issued: '22 Jul 2026',
      color: 'from-emerald-600 to-teal-700',
      icon: FileText,
    },
    {
      id: 'degree_cert' as const,
      title: 'University Academic Record',
      dept: 'DigiLocker National Academic Depository',
      number: 'MH-NAD-2026-1104',
      issued: '20 Feb 2026',
      color: 'from-violet-600 to-purple-800',
      icon: GraduationCap,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header title & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Citizen Profile
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Your single verified identity for Maharashtra digital governance services. Click any record to inspect verified proofs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIdCardModalOpen(true)}
            className="rounded-full gap-2 border-blue-200 bg-white/80 hover:bg-blue-50 text-blue-700 font-semibold shadow-xs"
          >
            <IdCard className="h-4 w-4 text-blue-600" />
            Digital ID Card
          </Button>
          <Button
            size="sm"
            onClick={openEditModal}
            className="rounded-full gap-2 shadow-md shadow-blue-900/20 bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-semibold"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Summary Card */}
      <Card className="border border-white/80 bg-white/70 backdrop-blur-xl shadow-xl overflow-hidden animate-fade-in-up relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-6 sm:p-7 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div
                onClick={() => setIdCardModalOpen(true)}
                className="cursor-pointer group relative flex h-20 w-20 sm:h-22 sm:w-22 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-900 text-3xl font-bold text-white shadow-xl shadow-blue-900/25 transition-transform hover:scale-105"
                title="Click to view full Digital Citizen ID Card"
              >
                {fullName.charAt(0)}
                <div className="absolute inset-0 rounded-3xl ring-2 ring-white/40 group-hover:ring-white transition-all" />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">{fullName}</h2>
                  <Badge variant="outline" className="gap-1.5 border-emerald-500/30 bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Citizen
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <button
                    onClick={() => copyToClipboard(rawId)}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg border border-slate-200/70 transition-colors"
                    title="Click to copy full ID"
                  >
                    <IdCard className="h-3 w-3 text-slate-500" />
                    <span>{citizenIdDisplay}</span>
                    {copiedId ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400" />
                    )}
                  </button>

                  <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                    {district}, Maharashtra
                  </span>
                </div>

                <p className="text-xs text-slate-500 pt-0.5">
                  Universal Cross-Department Pre-fill Active · All applications synchronized
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col md:flex-row items-stretch sm:items-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIdCardModalOpen(true)}
                className="rounded-xl gap-2 text-xs border-slate-200/80 bg-white/60 hover:bg-white text-slate-800"
              >
                <QrCode className="h-3.5 w-3.5 text-blue-600" />
                View Smart ID
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openEditModal}
                className="rounded-xl gap-2 text-xs border-slate-200/80 bg-white/60 hover:bg-white text-slate-800"
              >
                <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
                Update Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Personal Details & Verified Documents */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Personal Information with interactive edit trigger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Click any card to open and edit your data</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openEditModal}
              className="gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 rounded-full"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Information
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.label}
                  onClick={field.canCopy ? () => copyToClipboard(field.fullVal || field.value) : openEditModal}
                  className="group relative flex items-start gap-3.5 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md p-4 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-white/95 transition-all cursor-pointer"
                  title={field.canCopy ? 'Click to copy full ID' : 'Click to edit personal details'}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100/80 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-500">{field.label}</p>
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-600 font-semibold transition-opacity flex items-center gap-0.5">
                        {field.canCopy ? 'Copy' : 'Edit'}
                        <Edit3 className="h-2.5 w-2.5" />
                      </span>
                    </div>
                    <p className={`mt-0.5 text-sm font-semibold text-slate-900 truncate ${field.mono ? 'font-mono' : ''}`}>
                      {field.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connected Verified Government Documents */}
          <div className="pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Verified Credentials & Documents</h3>
                <p className="text-xs text-slate-500">Official certificates synced via Maharashtra State Vault</p>
              </div>
              <span className="pill-live rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                4 Synced
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {documents.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setActiveDocument(doc.id)}
                    className="group flex flex-col justify-between rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md p-4 shadow-sm hover:shadow-md hover:border-blue-400 hover:bg-white transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${doc.color} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                            {doc.title}
                          </h4>
                          <Eye className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{doc.dept}</p>
                        <p className="mt-1 font-mono text-xs text-slate-700 font-semibold truncate">{doc.number}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <ShieldCheck className="h-3 w-3" />
                        Verified Active
                      </span>
                      <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                        View Certificate
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Verification Status Center */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Verification Status
            </h2>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Complete
            </span>
          </div>

          <div className="space-y-2.5">
            {verificationItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveVerification(item.id)}
                className="group flex flex-col rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md p-3.5 shadow-xs hover:shadow-md hover:border-emerald-300 hover:bg-white transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{item.issuer}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`shrink-0 text-[10px] px-2 py-0.5 ${item.badgeColor}`}>
                    {item.status}
                  </Badge>
                </div>

                <p className="mt-2 text-[11px] text-slate-600 leading-snug line-clamp-2">
                  {item.desc}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Verified: {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                    Open Proof
                    <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Interoperability Links */}
          <div className="rounded-2xl border border-white/80 bg-gradient-to-br from-blue-50 to-indigo-50/60 p-4 shadow-sm space-y-2.5">
            <h4 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-blue-700" />
              Identity Actions
            </h4>
            <div className="space-y-1.5">
              {navigate && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/portal/consent')}
                    className="w-full justify-between text-xs text-slate-700 hover:text-blue-700 hover:bg-white rounded-xl px-2.5 py-1.5 h-auto"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-emerald-600" />
                      Manage Data Consents
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/portal/history')}
                    className="w-full justify-between text-xs text-slate-700 hover:text-blue-700 hover:bg-white rounded-xl px-2.5 py-1.5 h-auto"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-indigo-600" />
                      View Access Audit Trail
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/portal/services')}
                    className="w-full justify-between text-xs text-slate-700 hover:text-blue-700 hover:bg-white rounded-xl px-2.5 py-1.5 h-auto"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-amber-600" />
                      Apply for Services
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EDIT PROFILE DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-blue-600" />
              Edit Citizen Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update your verified citizen details. Changes will automatically update across your active government applications.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs font-semibold text-slate-700">Full Name</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-mobile" className="text-xs font-semibold text-slate-700">Mobile Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">+91</span>
                  <Input
                    id="edit-mobile"
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    maxLength={10}
                    required
                    className="rounded-xl pl-11 border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-dob" className="text-xs font-semibold text-slate-700">Date of Birth</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={formDob}
                  onChange={(e) => setFormDob(e.target.value)}
                  required
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-address" className="text-xs font-semibold text-slate-700">Permanent Address</Label>
              <Input
                id="edit-address"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                required
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-district" className="text-xs font-semibold text-slate-700">District</Label>
              <Input
                id="edit-district"
                value={formDistrict}
                onChange={(e) => setFormDistrict(e.target.value)}
                required
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-college" className="text-xs font-semibold text-slate-700">College / Institution</Label>
                <Input
                  id="edit-college"
                  value={formCollege}
                  onChange={(e) => setFormCollege(e.target.value)}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-course" className="text-xs font-semibold text-slate-700">Course / Branch</Label>
                <Input
                  id="edit-course"
                  value={formCourse}
                  onChange={(e) => setFormCourse(e.target.value)}
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-fade-in-up">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Profile updated and synchronized successfully!
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="rounded-xl gap-2 bg-blue-700 hover:bg-blue-800 text-white">
                {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 2. DIGITAL CITIZEN SMART ID CARD MODAL */}
      {/* ========================================================================= */}
      <Dialog open={idCardModalOpen} onOpenChange={setIdCardModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center justify-between">
              <span>Digital Citizen Identity Smart Card</span>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-50 text-emerald-700 text-xs">
                DigiLocker Linked
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Government of Maharashtra · Interoperable Digital ID
            </DialogDescription>
          </DialogHeader>

          {/* Realistic Holographic Smart Card */}
          <div className="relative mt-2 rounded-3xl p-6 text-white overflow-hidden shadow-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 border border-white/20">
            {/* Holographic light effect */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-cyan-300">Government of Maharashtra</p>
                  <p className="text-xs font-bold text-white tracking-wide">FUSIONGRID CITIZEN PASS</p>
                </div>
              </div>
              <span className="font-mono text-[9px] bg-white/10 px-2 py-0.5 rounded text-slate-300 border border-white/10">
                AES-256
              </span>
            </div>

            {/* Chip & NFC symbol */}
            <div className="relative z-10 my-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-11 rounded-md bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-md border border-amber-500/40 flex items-center justify-center">
                  <Cpu className="h-5 w-5 text-amber-900" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">SMART IDENTITY</span>
              </div>
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            </div>

            {/* Body: Photo + Info */}
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg border-2 border-white/30">
                {fullName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-base text-white truncate">{fullName}</h3>
                <p className="font-mono text-[11px] text-cyan-300 truncate">ID: {rawId}</p>
                <p className="text-[10px] text-slate-300 mt-0.5">DOB: {dob} · {district}</p>
                <p className="text-[10px] text-slate-400 truncate">Mobile: +91 {mobile}</p>
              </div>
            </div>

            {/* Footer with QR */}
            <div className="relative z-10 mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-mono text-slate-400 uppercase">Verification Hash</p>
                <p className="text-[10px] font-mono text-emerald-400 font-semibold truncate">0x8F9A...B342 · UIDAI Bound</p>
              </div>
              <div className="h-10 w-10 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center shadow">
                <QrCode className="h-8 w-8 text-slate-900" />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 flex flex-row justify-between gap-2 sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(rawId)}
              className="rounded-xl gap-1.5 text-xs flex-1"
            >
              {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedId ? 'Copied ID' : 'Copy ID'}
            </Button>
            <Button
              size="sm"
              onClick={() => window.print()}
              className="rounded-xl gap-1.5 text-xs bg-slate-950 text-white flex-1 hover:bg-slate-900"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 3. VERIFICATION PROOF DETAILS MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!activeVerification} onOpenChange={(open) => !open && setActiveVerification(null)}>
        <DialogContent className="max-w-lg rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Government Verification Proof
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Zero-Trust cryptographic proof ledger record from Maharashtra Interoperability Gateway
            </DialogDescription>
          </DialogHeader>

          {activeVerification === 'aadhaar' && (
            <div className="space-y-3.5 py-2">
              <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">UIDAI Aadhaar Registry Match</span>
                  <Badge className="bg-emerald-600 text-white text-[10px]">Verified e-KYC</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Identity was authenticated via Biometric + OTP challenge against Unique Identification Authority of India (UIDAI).
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Masked Aadhaar Number:</span>
                  <span className="font-mono font-semibold text-slate-900">XXXX-XXXX-{mobile.slice(-4) || '8921'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Full Name on Record:</span>
                  <span className="font-semibold text-slate-900">{fullName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Auth Token Reference:</span>
                  <span className="font-mono text-slate-900">UID-MH-2026-09941</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Issuing Authority:</span>
                  <span className="text-slate-900 font-medium">Govt. of India UIDAI</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Cryptographic Hash:</span>
                  <span className="font-mono text-emerald-700 font-semibold truncate max-w-[200px]">0x8F9A27CB...99B4</span>
                </div>
              </div>
            </div>
          )}

          {activeVerification === 'mobile' && (
            <div className="space-y-3.5 py-2">
              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">Telecom Gateway Confirmation</span>
                  <Badge className="bg-emerald-600 text-white text-[10px]">Active & Verified</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mobile number is cryptographically linked to Aadhaar identity and confirmed through dynamic OTP challenges.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Verified Mobile Number:</span>
                  <span className="font-mono font-semibold text-slate-900">+91 {mobile}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">SMS Gateway Provider:</span>
                  <span className="font-medium text-slate-900">National Informatics Centre (NIC)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Two-Factor Authentication:</span>
                  <span className="text-emerald-700 font-semibold">Enabled (6-digit OTP)</span>
                </div>
              </div>
            </div>
          )}

          {activeVerification === 'address' && (
            <div className="space-y-3.5 py-2">
              <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">Maharashtra Domicile Match</span>
                  <Badge className="bg-emerald-600 text-white text-[10px]">Revenue Verified</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Residential address verified against local municipal revenue records and state domicile certificate records.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Verified Residential Address:</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[240px]">{address}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">District / State:</span>
                  <span className="font-semibold text-slate-900">{district}, Maharashtra</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Domicile Certificate ID:</span>
                  <span className="font-mono text-slate-900">MH-DOM-2026-90412</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Issuing Authority:</span>
                  <span className="font-medium text-slate-900">Tehsildar & Sub-Divisional Magistrate</span>
                </div>
              </div>
            </div>
          )}

          {activeVerification === 'education' && (
            <div className="space-y-3.5 py-2">
              <div className="rounded-2xl bg-indigo-50/70 border border-indigo-200/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">DigiLocker Academic Depository</span>
                  <Badge className="bg-emerald-600 text-white text-[10px]">Academic Match</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Higher education enrollment credentials validated via National Academic Depository (NAD).
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Institution / College:</span>
                  <span className="font-semibold text-slate-900">{college}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Course / Branch:</span>
                  <span className="font-semibold text-slate-900">{course}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Permanent Registration No (PRN):</span>
                  <span className="font-mono text-slate-900">PRN-2023-ENG-4491</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Affiliation:</span>
                  <span className="font-medium text-slate-900">State Directorate of Technical Education</span>
                </div>
              </div>
            </div>
          )}

          {activeVerification === 'income' && (
            <div className="space-y-3.5 py-2">
              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">Revenue Department Income Certificate</span>
                  <Badge className="bg-emerald-600 text-white text-[10px]">Auto-Synced Gateway</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Income certificate data pulled directly from MahaRevenue without requiring physical documentation.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Income Certificate ID:</span>
                  <span className="font-mono text-slate-900">MH-INC-2026-88123</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Verified Income Bracket:</span>
                  <span className="font-semibold text-emerald-700">&lt; ₹2,50,000 / annum (Scholarship Eligible)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Valid Through:</span>
                  <span className="font-medium text-slate-900">31 March 2027</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Issuing Officer:</span>
                  <span className="font-medium text-slate-900">Tehsildar, Haveli Sub-Division, Pune</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setActiveVerification(null)} className="rounded-xl w-full">
              Close Verification Proof
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 4. OFFICIAL DOCUMENT VIEWER MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!activeDocument} onOpenChange={(open) => !open && setActiveDocument(null)}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center justify-between">
              <span>Official Government Certificate</span>
              <Badge className="bg-emerald-600 text-white text-xs">Digitally Signed & Valid</Badge>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Government of Maharashtra · Electronic Citizen Certificate
            </DialogDescription>
          </DialogHeader>

          {/* Realistic Official Certificate Display */}
          <div className="relative mt-2 rounded-2xl border-4 border-double border-slate-300 bg-amber-50/20 p-6 sm:p-8 text-slate-900 space-y-5">
            {/* Seal & Header */}
            <div className="text-center space-y-1 pb-4 border-b border-slate-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold border-2 border-amber-400">
                <ShieldCheck className="h-8 w-8 text-amber-700" />
              </div>
              <p className="font-serif text-xs uppercase tracking-widest text-slate-600 pt-1 font-semibold">Government of Maharashtra</p>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {activeDocument === 'aadhaar_card' && 'e-Aadhaar Identity Verification Certificate'}
                {activeDocument === 'domicile_cert' && 'Certificate of Age, Nationality & Domicile'}
                {activeDocument === 'income_cert' && 'Revenue Department Annual Income Certificate'}
                {activeDocument === 'degree_cert' && 'Higher Education Degree & Marksheet Attestation'}
              </h3>
              <p className="font-mono text-xs text-slate-500">
                Issued under Maharashtra Right to Public Services Act (RTS 2015)
              </p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-800">
              <p>
                This is to officially certify that <span className="font-bold underline">{fullName}</span>,
                holder of Citizen ID <span className="font-mono font-bold">{rawId}</span>, resident of <span className="font-bold">{address}</span>,
                District <span className="font-bold">{district}</span>, Maharashtra, has been verified in the state interoperability registry.
              </p>

              <div className="rounded-xl bg-white/80 p-3.5 border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Certificate ID</span>
                  <p className="font-mono font-bold text-slate-900">
                    {activeDocument === 'aadhaar_card' && `UID-MH-2026-${mobile.slice(-4)}`}
                    {activeDocument === 'domicile_cert' && 'MH-DOM-2026-90412'}
                    {activeDocument === 'income_cert' && 'MH-INC-2026-88123'}
                    {activeDocument === 'degree_cert' && 'MH-NAD-2026-1104'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Date of Issuance</span>
                  <p className="font-semibold text-slate-900">2026-01-16</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Institution / Dept</span>
                  <p className="font-semibold text-slate-900 truncate">
                    {activeDocument === 'degree_cert' ? college : 'Revenue & District Administration'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Validation Status</span>
                  <p className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Legally Certified
                  </p>
                </div>
              </div>
            </div>

            {/* Official Signature Block & Barcode */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-7 w-28 bg-slate-900/10 rounded flex items-center justify-center font-serif italic text-xs text-blue-900">
                  Digitally Signed
                </div>
                <p className="text-[10px] text-slate-600 font-medium">Competent State Authority</p>
                <p className="text-[9px] font-mono text-slate-400">Govt. of Maharashtra</p>
              </div>

              <div className="text-right">
                <QrCode className="h-12 w-12 text-slate-900 ml-auto" />
                <p className="text-[9px] font-mono text-slate-400 mt-1">Scan for RTS Validation</p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 flex flex-row justify-between gap-2 sm:justify-between">
            <Button variant="outline" size="sm" onClick={() => setActiveDocument(null)} className="rounded-xl flex-1">
              Close Preview
            </Button>
            <Button size="sm" onClick={() => window.print()} className="rounded-xl gap-1.5 bg-blue-700 text-white flex-1 hover:bg-blue-800">
              <Download className="h-3.5 w-3.5" />
              Download / Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
