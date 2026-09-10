"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  BedDouble,
  Bell,
  Building2,
  CalendarClock,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  HeartHandshake,
  Home,
  Hospital,
  LifeBuoy,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type View = "dashboard" | "referrals" | "facilities";

const cases = [
  { patient: "M. Carter", need: "Memory care", discharge: "Today, 4:00 PM", payer: "Medicaid pending", status: "Needs a home", urgency: "Now" },
  { patient: "R. Williams", need: "Adult family home", discharge: "Tomorrow", payer: "Private pay → Medicaid", status: "3 homes reviewing", urgency: "24h" },
  { patient: "A. Lee", need: "Assisted living", discharge: "Sep 14", payer: "Private pay", status: "Family deciding", urgency: "4d" },
];

const homes = [
  { name: "Cedar Grove Adult Family Home", distance: "2.4 mi", beds: 2, price: "From $6,200/mo", response: "~18 min", types: ["Medicaid", "Memory care", "Hoyer lift"], tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { name: "Northlake Senior Living", distance: "4.8 mi", beds: 1, price: "From $7,800/mo", response: "~34 min", types: ["Private pay", "Memory care", "Hospice"], tone: "bg-blue-50 text-blue-800 border-blue-200" },
  { name: "Harbor View Care Residence", distance: "7.1 mi", beds: 3, price: "From $5,900/mo", response: "~22 min", types: ["Medicaid", "Wound care", "Behavioral"], tone: "bg-amber-50 text-amber-900 border-amber-200" },
];

export function OriginalDesk() {
  const [view, setView] = useState<View>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [flash, setFlash] = useState("");
  const [medicaidOnly, setMedicaidOnly] = useState(false);
  const [vacanciesOnly, setVacanciesOnly] = useState(true);
  const [memoryCare, setMemoryCare] = useState(false);
  const [behavioralSupport, setBehavioralSupport] = useState(false);
  const [withinTenMiles, setWithinTenMiles] = useState(false);

  const visibleHomes = useMemo(
    () => homes.filter((home) =>
      (!medicaidOnly || home.types.includes("Medicaid")) &&
      (!vacanciesOnly || home.beds > 0) &&
      (!memoryCare || home.types.includes("Memory care")) &&
      (!behavioralSupport || home.types.includes("Behavioral")) &&
      (!withinTenMiles || Number.parseFloat(home.distance) <= 10)
    ),
    [behavioralSupport, medicaidOnly, memoryCare, vacanciesOnly, withinTenMiles],
  );

  function navigate(next: View) {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openPlacement() {
    setStep(1);
    setFlash("");
    setPlacementOpen(true);
  }

  function saveDraft() {
    setPlacementOpen(false);
    setFlash("Draft saved locally — no information was sent.");
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[294px] p-0">
              <SheetHeader className="border-b p-5 text-left">
                <SheetTitle className="flex items-center gap-3"><BrandMark /> Care Transition Desk</SheetTitle>
              </SheetHeader>
              <Navigation active={view} onNavigate={navigate} />
            </SheetContent>
          </Sheet>
          <div className="flex min-w-0 items-center gap-3">
            <BrandMark />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">Care Transition Desk</p>
              <p className="hidden text-xs text-slate-500 sm:block">Placement coordinator prototype</p>
            </div>
          </div>
          <Badge variant="outline" className="ml-1 hidden border-amber-200 bg-amber-50 text-amber-800 md:inline-flex">Prototype — sample data only</Badge>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="hidden gap-2 border-slate-300 md:inline-flex"><Phone className="size-4" /> Urgent help: (206) 555-0144</Button>
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>
            <Button onClick={openPlacement} className="gap-2 shadow-sm"><Plus className="size-4" /><span className="hidden sm:inline">Place a patient</span><span className="sm:hidden">New case</span></Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <Navigation active={view} onNavigate={navigate} />
          <div className="mt-auto p-4">
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-950"><LifeBuoy className="size-4" /> A case cannot wait?</div>
              <p className="mb-3 text-xs leading-5 text-teal-800">Call the placement team for a same-day handoff.</p>
              <Button size="sm" className="w-full gap-2"><Phone className="size-3.5" /> Call now</Button>
            </div>
            <div className="mt-4 flex items-center gap-3 px-1">
              <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">JM</div>
              <div><p className="text-sm font-medium">Jamie Morgan</p><p className="text-xs text-slate-500">Discharge planner</p></div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <div className="mx-auto max-w-[1440px]">
            {flash && (
              <Alert className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-900">
                <Check className="size-4" />
                <AlertDescription className="flex items-center justify-between gap-4">{flash}<button onClick={() => setFlash("")} aria-label="Dismiss"><X className="size-4" /></button></AlertDescription>
              </Alert>
            )}
            {view === "dashboard" && <Dashboard onPlace={openPlacement} onFindBeds={() => navigate("facilities")} onViewCases={() => navigate("referrals")} />}
            {view === "referrals" && <Referrals onPlace={openPlacement} />}
            {view === "facilities" && <Facilities homes={visibleHomes} medicaidOnly={medicaidOnly} vacanciesOnly={vacanciesOnly} memoryCare={memoryCare} behavioralSupport={behavioralSupport} withinTenMiles={withinTenMiles} setMedicaidOnly={setMedicaidOnly} setVacanciesOnly={setVacanciesOnly} setMemoryCare={setMemoryCare} setBehavioralSupport={setBehavioralSupport} setWithinTenMiles={setWithinTenMiles} onPlace={openPlacement} />}
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          <MobileNav icon={Home} label="Desk" active={view === "dashboard"} onClick={() => navigate("dashboard")} />
          <MobileNav icon={FileText} label="Cases" active={view === "referrals"} onClick={() => navigate("referrals")} />
          <MobileNav icon={Plus} label="Place patient" primary onClick={openPlacement} />
          <MobileNav icon={BedDouble} label="Find beds" active={view === "facilities"} onClick={() => navigate("facilities")} />
        </div>
      </nav>

      <PlacementDialog open={placementOpen} setOpen={setPlacementOpen} step={step} setStep={setStep} onSave={saveDraft} />
    </div>
  );
}

function BrandMark() {
  return <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm"><HeartHandshake className="size-5" /></div>;
}

function Navigation({ active, onNavigate }: { active: View; onNavigate: (view: View) => void }) {
  const primary = [
    { label: "Command center", icon: Home, view: "dashboard" as View },
    { label: "Open cases", icon: FileText, view: "referrals" as View, count: 3 },
    { label: "Find beds", icon: BedDouble, view: "facilities" as View },
  ];
  return (
    <div className="flex-1 p-3">
      <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Placement</p>
      {primary.map((item) => (
        <button key={item.label} onClick={() => onNavigate(item.view)} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${active === item.view ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-100"}`}>
          <item.icon className="size-4.5" /> {item.label}
          {item.count && <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">{item.count}</span>}
        </button>
      ))}
      <Separator className="my-3" />
      {[{ label: "Notifications", icon: Bell }, { label: "Support", icon: CircleHelp }, { label: "Settings", icon: Settings }].map((item) => (
        <button key={item.label} className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"><item.icon className="size-4.5" /> {item.label}</button>
      ))}
    </div>
  );
}

function Heading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">{eyebrow}</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Dashboard({ onPlace, onFindBeds, onViewCases }: { onPlace: () => void; onFindBeds: () => void; onViewCases: () => void }) {
  return (
    <>
      <Heading eyebrow="Thursday, September 10" title="Good morning, Jamie" description="Three open cases need attention. Start with the patient discharging today." action={<div className="flex gap-2"><Button variant="outline" onClick={onFindBeds} className="gap-2 bg-white"><Search className="size-4" /> Find beds today</Button><Button onClick={onPlace} className="hidden gap-2 sm:flex"><Plus className="size-4" /> Place a patient</Button></div>} />
      <Card className="mb-6 overflow-hidden border-red-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b border-red-100 bg-red-50/70 p-5 sm:flex-row sm:items-center">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700"><CalendarClock className="size-5" /></div>
            <div className="flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">Discharging today</h2><Badge className="bg-red-600 text-white">1 urgent case</Badge></div><p className="mt-1 text-sm text-slate-600">No receiving home confirmed yet. Discharge is expected at 4:00 PM.</p></div>
            <Button onClick={onFindBeds} className="gap-2 bg-red-700 hover:bg-red-800">Find an available bed <ArrowRight className="size-4" /></Button>
          </div>
          <div className="grid sm:grid-cols-3">
            <Metric label="Needs action" value="1" detail="No home selected" icon={AlertCircle} tone="text-red-700 bg-red-50" />
            <Metric label="Homes reviewing" value="3" detail="Across 1 case" icon={Building2} tone="text-blue-700 bg-blue-50" />
            <Metric label="Awaiting family" value="1" detail="Confirmation needed" icon={Users} tone="text-amber-700 bg-amber-50" />
          </div>
        </CardContent>
      </Card>
      <div className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.7fr)]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div><CardTitle>Cases by discharge date</CardTitle><CardDescription className="mt-1">Urgent cases stay at the top automatically.</CardDescription></div>
            <Button variant="ghost" size="sm" onClick={onViewCases}>View all <ChevronRight className="size-4" /></Button>
          </CardHeader>
          <CardContent className="px-0"><CaseTable compact /></CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-950 text-white shadow-sm">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-300"><Sparkles className="size-5" /></div>
            <CardTitle className="text-white">Fastest safe next step</CardTitle>
            <CardDescription className="leading-6 text-slate-300">Family reachable? Send a private intake link. Discharge within 48 hours or family cannot complete it? Start the case and our team handles confirmation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3"><Button onClick={onPlace} className="w-full justify-between bg-teal-500 text-slate-950 hover:bg-teal-400">Start a case <ArrowRight className="size-4" /></Button><button className="flex w-full items-center justify-center gap-2 py-1 text-sm text-slate-300"><Phone className="size-4" /> Talk to placement support</button></CardContent>
        </Card>
      </div>
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex-row items-center justify-between gap-4"><div><CardTitle>Available nearby</CardTitle><CardDescription className="mt-1">Verified vacancies matching common discharge needs.</CardDescription></div><Button variant="outline" onClick={onFindBeds}>Explore all</Button></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">{homes.map((home) => <HomeCard key={home.name} home={home} compact onPlace={onPlace} />)}</CardContent>
      </Card>
    </>
  );
}

function Metric({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof AlertCircle; tone: string }) {
  return <div className="flex items-center gap-3 border-slate-100 p-5 sm:border-r sm:last:border-r-0"><div className={`flex size-10 items-center justify-center rounded-lg ${tone}`}><Icon className="size-5" /></div><div><p className="text-xs font-medium text-slate-500">{label}</p><div className="mt-0.5 flex items-baseline gap-2"><span className="text-xl font-semibold">{value}</span><span className="text-xs text-slate-500">{detail}</span></div></div></div>;
}

function CaseTable({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-x-auto"><Table>
      <TableHeader><TableRow className="bg-slate-50/80"><TableHead className="pl-6">Patient / need</TableHead><TableHead>Discharge</TableHead>{!compact && <TableHead>Payment</TableHead>}<TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
      <TableBody>{cases.map((item) => <TableRow key={item.patient}>
        <TableCell className="pl-6"><p className="font-medium">{item.patient}</p><p className="mt-0.5 text-xs text-slate-500">{item.need}</p></TableCell>
        <TableCell><div className="flex items-center gap-2 whitespace-nowrap"><span className={`size-2 rounded-full ${item.urgency === "Now" ? "bg-red-500" : item.urgency === "24h" ? "bg-amber-500" : "bg-slate-300"}`} /><span className={item.urgency === "Now" ? "font-semibold text-red-700" : "font-medium"}>{item.discharge}</span></div></TableCell>
        {!compact && <TableCell>{item.payer}</TableCell>}<TableCell><Badge variant="outline" className="whitespace-nowrap bg-white font-medium">{item.status}</Badge></TableCell>
        <TableCell className="pr-6 text-right"><Button variant="ghost" size="icon-sm" aria-label="View case"><ChevronRight /></Button></TableCell>
      </TableRow>)}</TableBody>
    </Table></div>
  );
}

function Referrals({ onPlace }: { onPlace: () => void }) {
  return (
    <>
      <Heading eyebrow="Patient placement" title="Open cases" description="Track every patient by discharge date, payment source, and next action." action={<Button onClick={onPlace} className="gap-2"><Plus className="size-4" /> Place a patient</Button>} />
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input placeholder="Search patient, care home, or discharge date" className="h-10 border-0 bg-slate-50 pl-9 shadow-none" /></div>
        <Select defaultValue="open"><SelectTrigger className="h-10 w-full sm:w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">All open</SelectItem><SelectItem value="today">Discharging today</SelectItem><SelectItem value="48h">Next 48 hours</SelectItem><SelectItem value="action">Needs action</SelectItem></SelectContent></Select>
        <Button variant="outline" className="h-10 gap-2"><SlidersHorizontal className="size-4" /> More filters</Button>
      </div>
      <Card className="overflow-hidden border-slate-200 bg-white shadow-sm"><CardContent className="p-0"><CaseTable /></CardContent></Card>
    </>
  );
}

function Facilities({ homes: visible, medicaidOnly, vacanciesOnly, memoryCare, behavioralSupport, withinTenMiles, setMedicaidOnly, setVacanciesOnly, setMemoryCare, setBehavioralSupport, setWithinTenMiles, onPlace }: { homes: typeof homes; medicaidOnly: boolean; vacanciesOnly: boolean; memoryCare: boolean; behavioralSupport: boolean; withinTenMiles: boolean; setMedicaidOnly: (value: boolean) => void; setVacanciesOnly: (value: boolean) => void; setMemoryCare: (value: boolean) => void; setBehavioralSupport: (value: boolean) => void; setWithinTenMiles: (value: boolean) => void; onPlace: () => void }) {
  return (
    <>
      <Heading eyebrow="Verified provider network" title="Find an available bed" description="Filter by what matters for this discharge. Contact details and private notes remain visible only to verified coordinators." action={<Button variant="outline" className="gap-2 bg-white"><MapPin className="size-4" /> Near Harborview</Button>} />
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4 sm:flex-row sm:items-center"><div className="flex size-10 items-center justify-center rounded-lg bg-white text-teal-700"><Users className="size-5" /></div><div className="flex-1"><p className="text-sm font-semibold">Matching for M. Carter</p><p className="text-xs text-slate-600">Discharging today · Memory care · Medicaid pending</p></div><Button variant="outline" size="sm" className="bg-white">Change patient</Button></div>
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2"><SlidersHorizontal className="size-4 text-teal-700" /><h2 className="text-sm font-semibold">Match this discharge</h2><Badge variant="secondary" className="ml-auto">{visible.length} available</Badge></div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={vacanciesOnly} onClick={() => setVacanciesOnly(!vacanciesOnly)}>Available now</FilterChip>
          <FilterChip active={medicaidOnly} onClick={() => setMedicaidOnly(!medicaidOnly)}>Accepts Medicaid</FilterChip>
          <FilterChip active={memoryCare} onClick={() => setMemoryCare(!memoryCare)}>Memory care</FilterChip><FilterChip active={withinTenMiles} onClick={() => setWithinTenMiles(!withinTenMiles)}>Within 10 miles</FilterChip><FilterChip active={behavioralSupport} onClick={() => setBehavioralSupport(!behavioralSupport)}>Behavioral support</FilterChip>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">{visible.map((home) => <HomeCard key={home.name} home={home} onPlace={onPlace} />)}</div>
    </>
  );
}

function FilterChip({ children, active = false, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  const [selected, setSelected] = useState(active);
  const on = onClick ? active : selected;
  return <button onClick={() => onClick ? onClick() : setSelected(!selected)} className={`rounded-full border px-3 py-2 text-sm font-medium transition ${on ? "border-teal-700 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-600"}`}>{on && <Check className="mr-1.5 inline size-3.5" />}{children}</button>;
}

function HomeCard({ home, compact = false, onPlace }: { home: (typeof homes)[number]; compact?: boolean; onPlace: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3"><div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Building2 className="size-5" /></div><Badge className={`border ${home.tone}`}>{home.beds} {home.beds === 1 ? "bed" : "beds"} now</Badge></div>
      <h3 className="font-semibold leading-5">{home.name}</h3>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500"><span className="flex items-center gap-1"><MapPin className="size-3.5" />{home.distance}</span><span className="flex items-center gap-1"><Clock3 className="size-3.5" />Replies {home.response}</span></div>
      {!compact && <><div className="mt-3 flex flex-wrap gap-1.5">{home.types.map((type) => <Badge key={type} variant="secondary" className="font-normal">{type}</Badge>)}</div><p className="mt-3 text-sm font-medium">{home.price}</p></>}
      <div className="mt-4 flex gap-2"><Button onClick={onPlace} size="sm" className="flex-1">Send this home a case</Button>{!compact && <Button variant="outline" size="sm">Details</Button>}</div>
    </div>
  );
}

function PlacementDialog({ open, setOpen, step, setStep, onSave }: { open: boolean; setOpen: (open: boolean) => void; step: number; setStep: (step: number) => void; onSave: () => void }) {
  const titles = ["Start with the discharge", "Who needs care?", "Choose the safest handoff"];
  const descriptions = ["Urgency and payment come first so we can find realistic options immediately.", "A short intake is enough to begin. You can save and return at any time.", "No care home sees this case until authorization is confirmed."];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-5 pb-4 pt-5 sm:px-6">
          <div className="mb-2 flex items-center gap-2"><Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-800">Step {step} of 3</Badge><span className="text-xs text-slate-500">About 3 minutes</span></div>
          <DialogTitle className="text-xl">{titles[step - 1]}</DialogTitle><DialogDescription>{descriptions[step - 1]}</DialogDescription><Progress value={(step / 3) * 100} className="mt-2 h-1.5" />
        </DialogHeader>
        <div className="space-y-5 px-5 py-5 sm:px-6">{step === 1 && <DischargeStep />}{step === 2 && <PatientStep />}{step === 3 && <HandoffStep />}</div>
        <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t bg-white px-5 py-4 sm:flex-row sm:px-6">
          <Button variant="ghost" onClick={onSave} className="sm:mr-auto">Save draft &amp; exit</Button>
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 3 ? <Button onClick={() => setStep(step + 1)} className="gap-2">Continue <ArrowRight className="size-4" /></Button> : <Button onClick={onSave} className="gap-2 bg-teal-700">Save as draft <ShieldCheck className="size-4" /></Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DischargeStep() {
  return <>
    <Alert className="border-red-200 bg-red-50 text-red-950"><CalendarClock className="size-4 text-red-700" /><AlertDescription>If discharge is today and no safe destination is confirmed, call placement support at <strong>(206) 555-0144</strong>.</AlertDescription></Alert>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Expected discharge date" required><Input type="date" defaultValue="2026-09-10" className="h-10" /></Field>
      <Field label="Needed by" required><Select defaultValue="today"><SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="today">Today — urgent</SelectItem><SelectItem value="48h">Within 48 hours</SelectItem><SelectItem value="week">Within 7 days</SelectItem><SelectItem value="planning">Planning ahead</SelectItem></SelectContent></Select></Field>
      <Field label="Current setting" required><Select defaultValue="hospital"><SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="hospital">Hospital</SelectItem><SelectItem value="snf">Skilled nursing / rehab</SelectItem><SelectItem value="home">Home — cannot return safely</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></Field>
      <Field label="Payment source" required><Select defaultValue="pending"><SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="medicaid">Medicaid</SelectItem><SelectItem value="pending">Medicaid pending</SelectItem><SelectItem value="transition">Private pay → Medicaid</SelectItem><SelectItem value="private">Private pay</SelectItem><SelectItem value="va">VA benefit</SelectItem><SelectItem value="unknown">Not confirmed</SelectItem></SelectContent></Select></Field>
    </div>
    <Field label="Preferred placement area" required><div className="relative"><MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input defaultValue="Within 10 miles of Harborview Medical Center" className="h-10 pl-9" /></div></Field>
  </>;
}

function PatientStep() {
  return <>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Patient name or initials" required><Input placeholder="Enough to recognize this case" className="h-10" /></Field><Field label="Age" required><Input inputMode="numeric" placeholder="Age" className="h-10" /></Field></div>
    <Field label="Primary care needs" required><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{["Memory care", "Mobility / transfers", "Medication support", "Wound care", "Oxygen", "Dialysis", "Hospice", "Behavioral support", "24-hour supervision"].map((need) => <label key={need} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-xs font-medium hover:bg-slate-50"><Checkbox />{need}</label>)}</div></Field>
    <Field label="Important clinical context"><Textarea placeholder="Only include details needed to determine whether a home can safely meet the patient's needs." className="min-h-20" /></Field>
    <Alert className="border-blue-200 bg-blue-50 text-blue-950"><ShieldCheck className="size-4 text-blue-700" /><AlertDescription>This prototype collects the minimum needed to begin matching. Detailed clinical records remain in your approved clinical workflow.</AlertDescription></Alert>
  </>;
}

function HandoffStep() {
  const [option, setOption] = useState("coordinator");
  return <>
    <div className="grid gap-3 sm:grid-cols-2">
      <ChoiceCard active={option === "coordinator"} onClick={() => setOption("coordinator")} icon={Hospital} title="I have the information">Best for discharge within 48 hours. Start matching now; our team handles family authorization before sharing.</ChoiceCard>
      <ChoiceCard active={option === "family"} onClick={() => setOption("family")} icon={MessageCircle} title="Family can complete intake">Best when family is reachable and discharge is not immediate. Send a secure link by text or email.</ChoiceCard>
    </div>
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold">Before any care home sees this case</p><ul className="mt-3 space-y-2 text-sm text-slate-600">{["Family or legal representative authorization is confirmed.", "Only matching-relevant information is shared.", "You can see exactly which homes received the case."].map((item) => <li key={item} className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal-700" />{item}</li>)}</ul></div>
    <label className="flex items-start gap-3 text-sm leading-5"><Checkbox className="mt-0.5" /><span>I confirm I am authorized to begin coordinating this patient&apos;s placement and understand authorization is required before details are shared.</span></label>
  </>;
}

function ChoiceCard({ active, onClick, icon: Icon, title, children }: { active: boolean; onClick: () => void; icon: typeof Hospital; title: string; children: ReactNode }) {
  return <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition ${active ? "border-teal-700 bg-teal-50" : "border-slate-200"}`}><div className="flex justify-between"><Icon className="size-5 text-teal-700" />{active && <Check className="size-5 text-teal-700" />}</div><p className="mt-4 font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{children}</p></button>;
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}{required && <span className="ml-1 text-red-600">*</span>}</Label>{children}</div>;
}

function MobileNav({ icon: Icon, label, active, primary, onClick }: { icon: typeof Home; label: string; active?: boolean; primary?: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-medium ${active ? "text-teal-700" : "text-slate-500"}`}><span className={`flex size-8 items-center justify-center rounded-lg ${primary ? "bg-teal-700 text-white" : active ? "bg-teal-50" : ""}`}><Icon className="size-4.5" /></span><span className="truncate">{label}</span></button>;
}
