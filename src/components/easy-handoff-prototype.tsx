"use client";

import { useState } from "react";
import {
  ArrowRight, BedDouble, Bell, Building2, CalendarClock, Check, ChevronRight,
  HeartHandshake, Home, MapPin, Menu, Phone, Plus, Search, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type View = "today" | "handoffs" | "care";
type Case = { name: string; need: string; when: string; status: string; urgent?: boolean };
type HomeOption = { name: string; distance: string; beds: number; tags: string[] };

const cases: Case[] = [
  { name: "M. Carter", need: "Memory care", when: "Today, 4:00 PM", status: "We’re calling homes", urgent: true },
  { name: "R. Williams", need: "Adult family home", when: "Tomorrow", status: "3 homes reviewing" },
  { name: "A. Lee", need: "Assisted living", when: "Sep 14", status: "Options ready" },
];
const homes: HomeOption[] = [
  { name: "Cedar Grove Adult Family Home", distance: "2.4 mi", beds: 2, tags: ["Medicaid", "Memory care", "Hoyer lift"] },
  { name: "Northlake Senior Living", distance: "4.8 mi", beds: 1, tags: ["Private pay", "Memory care", "Hospice"] },
  { name: "Harbor View Care Residence", distance: "7.1 mi", beds: 3, tags: ["Medicaid", "Wound care", "Behavioral"] },
];

export function EasyHandoffPrototype() {
  const [view, setView] = useState<View>("today");
  const [handoff, setHandoff] = useState(false);
  const [caseDetail, setCaseDetail] = useState<Case | null>(null);
  const [home, setHome] = useState<HomeOption | null>(null);
  const [medicaid, setMedicaid] = useState(false);
  const [notice, setNotice] = useState("");
  const visibleHomes = medicaid ? homes.filter((item) => item.tags.includes("Medicaid")) : homes;

  const complete = (message: string) => {
    setHandoff(false); setHome(null); setNotice(message); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-slate-950">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-white/95 px-4 backdrop-blur lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu"><Menu /></Button>
        <div className="flex size-9 items-center justify-center rounded-xl bg-teal-700 text-white"><HeartHandshake className="size-5" /></div>
        <div><p className="text-sm font-semibold">Care Transition Desk</p><p className="hidden text-xs text-slate-500 sm:block">Elderly Care Match</p></div>
        <Badge variant="outline" className="hidden border-amber-200 bg-amber-50 text-amber-800 md:flex">Prototype · sample data</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="hidden gap-2 md:flex"><Phone className="size-4" /> Urgent help</Button>
          <Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>
          <Button onClick={() => setHandoff(true)} className="gap-2"><Plus className="size-4" /><span className="hidden sm:inline">Hand off a case</span><span className="sm:hidden">New handoff</span></Button>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 border-r bg-white p-3 lg:block">
          <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Your workspace</p>
          <Nav icon={Home} label="Today" active={view === "today"} onClick={() => setView("today")} />
          <Nav icon={HeartHandshake} label="My handoffs" active={view === "handoffs"} onClick={() => setView("handoffs")} />
          <Nav icon={BedDouble} label="Browse care" active={view === "care"} onClick={() => setView("care")} />
          <div className="absolute bottom-4 left-3 right-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-sm font-semibold">A case can’t wait?</p><p className="my-2 text-xs leading-5 text-slate-600">Call us. We’ll take it from there.</p>
            <Button size="sm" className="w-full gap-2"><Phone className="size-3.5" /> (206) 555-0144</Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <div className="mx-auto max-w-6xl">
            {notice && <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><Check className="size-4" />{notice}</div>}
            {view === "today" && <Today onHandoff={() => setHandoff(true)} onCase={setCaseDetail} onCare={() => setView("care")} />}
            {view === "handoffs" && <Handoffs onHandoff={() => setHandoff(true)} onCase={setCaseDetail} />}
            {view === "care" && <Care options={visibleHomes} medicaid={medicaid} setMedicaid={setMedicaid} onHome={setHome} />}
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-white p-2 lg:hidden">
        <Mobile icon={Home} label="Today" active={view === "today"} onClick={() => setView("today")} />
        <Mobile icon={HeartHandshake} label="Handoffs" active={view === "handoffs"} onClick={() => setView("handoffs")} />
        <Mobile icon={Plus} label="Hand off case" primary onClick={() => setHandoff(true)} />
        <Mobile icon={BedDouble} label="Browse care" active={view === "care"} onClick={() => setView("care")} />
      </nav>

      <HandoffDialog open={handoff} close={() => setHandoff(false)} complete={() => complete("Handoff received. Your advisor will call the family and update you within 15 minutes.")} />
      <CaseDialog item={caseDetail} close={() => setCaseDetail(null)} />
      <HomeDialog item={home} close={() => setHome(null)} complete={() => complete("Your advisor is checking this home. Nothing else is needed from you.")} />
    </div>
  );
}

function Title({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-widest text-teal-700">{eyebrow}</p><h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-slate-600">{text}</p></div>{action}</div>;
}

function Today({ onHandoff, onCase, onCare }: { onHandoff: () => void; onCase: (item: Case) => void; onCare: () => void }) {
  return <><Title eyebrow="Thursday, September 10" title="Good morning, Jamie" text="We’re working three handoffs. You only need to look at what’s marked for you." action={<Button onClick={onHandoff} className="gap-2"><Plus className="size-4" /> Hand off a case</Button>} />
    <section className="mb-6 overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 bg-red-50 p-5 sm:flex-row sm:items-center"><CalendarClock className="size-6 text-red-700" /><div className="flex-1"><div className="flex gap-2"><h2 className="font-semibold">M. Carter discharges today</h2><Badge className="bg-red-600">We’re on it</Badge></div><p className="mt-1 text-sm text-slate-600">Your advisor is calling matching homes. Next update by 10:30 AM.</p></div><Button onClick={() => onCase(cases[0])} className="gap-2 bg-red-700">See progress <ArrowRight className="size-4" /></Button></div>
      <div className="grid sm:grid-cols-3"><Stat number="0" label="Needs you" detail="Nothing right now" /><Stat number="2" label="We’re handling" detail="Active searches" /><Stat number="1" label="Options ready" detail="Family reviewing" /></div>
    </section>
    <div className="grid gap-6 xl:grid-cols-[1.5fr_.7fr]">
      <section className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="flex items-center justify-between p-5"><div><h2 className="font-semibold">Your handoffs</h2><p className="text-sm text-slate-500">Plain-language progress, sorted by discharge date.</p></div></div><CaseList onCase={onCase} /></section>
      <section className="rounded-xl bg-slate-950 p-5 text-white"><HeartHandshake className="mb-4 size-6 text-teal-300" /><h2 className="font-semibold">A 60-second handoff</h2><p className="mt-2 text-sm leading-6 text-slate-300">Give us discharge timing and a family contact. We gather needs, preferences, payment details, and authorization—then call homes.</p><Button onClick={onHandoff} className="mt-5 w-full justify-between bg-teal-400 text-slate-950">Hand off a case <ArrowRight /></Button></section>
    </div>
    <button onClick={onCare} className="mt-6 flex w-full items-center justify-between rounded-xl border bg-white p-5 text-left shadow-sm"><div><p className="font-semibold">Want to browse available care?</p><p className="text-sm text-slate-500">Optional. Your advisor handles fit checks and outreach.</p></div><ChevronRight /></button>
  </>;
}

function Handoffs({ onHandoff, onCase }: { onHandoff: () => void; onCase: (item: Case) => void }) {
  return <><Title eyebrow="Care transitions" title="Your handoffs" text="See what we’re doing, what happens next, and whether we need anything from you." action={<Button onClick={onHandoff}><Plus /> Hand off a case</Button>} /><div className="mb-4 flex gap-2 rounded-xl border bg-white p-3"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 size-4 text-slate-400" /><Input placeholder="Search a handoff" className="pl-9" /></div><Button variant="outline">Needs me</Button></div><section className="overflow-hidden rounded-xl border bg-white shadow-sm"><CaseList onCase={onCase} /></section></>;
}

function CaseList({ onCase }: { onCase: (item: Case) => void }) {
  return <div>{cases.map((item) => <button key={item.name} onClick={() => onCase(item)} className="grid w-full grid-cols-[1fr_auto] items-center gap-4 border-t p-4 text-left first:border-t-0 sm:grid-cols-[1fr_1fr_1fr_auto]"><div><p className="font-medium">{item.name}</p><p className="text-xs text-slate-500">{item.need}</p></div><p className={item.urgent ? "text-sm font-semibold text-red-700" : "hidden text-sm sm:block"}>{item.when}</p><Badge variant="outline" className="hidden bg-white sm:flex">{item.status}</Badge><ChevronRight className="size-4 text-slate-400" /></button>)}</div>;
}

function Care({ options, medicaid, setMedicaid, onHome }: { options: HomeOption[]; medicaid: boolean; setMedicaid: (value: boolean) => void; onHome: (item: HomeOption) => void }) {
  return <><Title eyebrow="Optional directory" title="Browse available care" text="You don’t need to call homes. Flag one that looks promising and your advisor will check fit, availability, and payment." /><div className="mb-5 flex flex-wrap gap-2 rounded-xl border bg-white p-4"><Filter active>Available now</Filter><Filter active={medicaid} onClick={() => setMedicaid(!medicaid)}>Accepts Medicaid</Filter><Filter>Memory care</Filter><Filter>Within 10 miles</Filter><Badge variant="secondary" className="ml-auto">{options.length} available</Badge></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{options.map((item) => <div key={item.name} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex justify-between"><Building2 className="size-5 text-slate-500" /><Badge className="bg-emerald-100 text-emerald-800">{item.beds} beds now</Badge></div><h2 className="mt-4 font-semibold">{item.name}</h2><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="size-3" />{item.distance}</p><div className="my-4 flex flex-wrap gap-1">{item.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div><Button onClick={() => onHome(item)} className="w-full">Ask our team about this home</Button></div>)}</div></>;
}

function HandoffDialog({ open, close, complete }: { open: boolean; close: () => void; complete: () => void }) {
  return <Dialog open={open} onOpenChange={(value) => !value && close()}><DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-xl"><DialogHeader className="border-b p-5"><Badge className="mb-2 bg-teal-100 text-teal-800">About 60 seconds · no full intake</Badge><DialogTitle className="text-xl">Hand off a case</DialogTitle><DialogDescription>Introduce us to the family. We collect the details, confirm authorization, contact homes, and keep you updated.</DialogDescription></DialogHeader><div className="space-y-4 p-5"><div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm"><strong>You are not doing our intake.</strong> Share only what you already know.</div><div className="grid gap-4 sm:grid-cols-2"><Field label="Patient initials"><Input placeholder="e.g. M.C." /></Field><Field label="Discharge timing"><Select defaultValue="today"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="today">Today — urgent</SelectItem><SelectItem value="48">Within 48 hours</SelectItem><SelectItem value="week">Within 7 days</SelectItem></SelectContent></Select></Field></div><div className="rounded-xl border p-4"><p className="font-semibold">Who should we call?</p><p className="mb-3 text-xs text-slate-500">Family member, legal representative, or patient.</p><div className="grid gap-4 sm:grid-cols-2"><Field label="Contact name"><Input placeholder="Full name" /></Field><Field label="Phone number"><Input type="tel" placeholder="Best number" /></Field></div></div><Field label="Anything we should know? (optional)"><Textarea placeholder="One sentence is enough." /></Field><div className="grid gap-2 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-3"><span>✓ We call the family</span><span>✓ We confirm authorization</span><span>✓ We contact homes</span></div></div><div className="border-t p-4"><Button onClick={complete} className="w-full gap-2">Hand off to our team <ArrowRight /></Button></div></DialogContent></Dialog>;
}

function CaseDialog({ item, close }: { item: Case | null; close: () => void }) {
  return <Dialog open={Boolean(item)} onOpenChange={(value) => !value && close()}><DialogContent className="sm:max-w-lg"><DialogHeader><Badge className="mb-2 bg-red-100 text-red-800">{item?.when}</Badge><DialogTitle>{item?.name}</DialogTitle><DialogDescription>Here’s what we’re doing. No placement work is waiting on you.</DialogDescription></DialogHeader><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm"><strong>Nothing needed from you right now.</strong> We’ll alert you only if the discharge plan needs your input.</div><div className="space-y-4">{["Family reached", "Matching homes contacted", "Options coming next"].map((label, i) => <div key={label} className="flex gap-3"><span className={`flex size-7 items-center justify-center rounded-full ${i < 2 ? "bg-teal-700 text-white" : "bg-slate-100"}`}>{i < 2 ? <Check className="size-4" /> : "3"}</span><div><p className="text-sm font-medium">{label}</p><p className="text-xs text-slate-500">{i === 2 ? "Next update by 10:30 AM." : "Completed by your advisor."}</p></div></div>)}</div><div className="flex items-center gap-3 rounded-xl border p-4"><span className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-xs text-white">CS</span><div className="flex-1"><p className="text-sm font-semibold">Cami, placement advisor</p><p className="text-xs text-slate-500">Owns this handoff</p></div><Button variant="outline">Message</Button></div></DialogContent></Dialog>;
}

function HomeDialog({ item, close, complete }: { item: HomeOption | null; close: () => void; complete: () => void }) {
  return <Dialog open={Boolean(item)} onOpenChange={(value) => !value && close()}><DialogContent><DialogHeader><DialogTitle>Ask our team about this home</DialogTitle><DialogDescription>You don’t need to call or send records. Your advisor checks fit and availability.</DialogDescription></DialogHeader><div className="rounded-xl border p-4"><p className="font-semibold">{item?.name}</p><p className="text-xs text-slate-500">{item?.distance} · {item?.beds} beds reported</p></div><Field label="Which handoff?"><Select defaultValue="mc"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="mc">M. Carter — today</SelectItem><SelectItem value="rw">R. Williams — tomorrow</SelectItem></SelectContent></Select></Field><p className="flex gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-900"><ShieldCheck className="size-4 shrink-0" />No information is shared automatically. Your advisor confirms fit and authorization first.</p><Button onClick={complete}>Ask advisor to check</Button></DialogContent></Dialog>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }
function Stat({ number, label, detail }: { number: string; label: string; detail: string }) { return <div className="border-t p-4 sm:border-r"><p className="text-xl font-semibold">{number}</p><p className="text-xs font-medium">{label}</p><p className="text-xs text-slate-500">{detail}</p></div>; }
function Filter({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) { return <button onClick={onClick} className={`rounded-full border px-3 py-2 text-sm ${active ? "border-teal-700 bg-teal-50 text-teal-800" : "border-slate-200"}`}>{active && "✓ "}{children}</button>; }
function Nav({ icon: Icon, label, active, onClick }: { icon: typeof Home; label: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active ? "bg-teal-50 font-medium text-teal-800" : "text-slate-600"}`}><Icon className="size-4" />{label}</button>; }
function Mobile({ icon: Icon, label, active, primary, onClick }: { icon: typeof Home; label: string; active?: boolean; primary?: boolean; onClick: () => void }) { return <button onClick={onClick} className={`flex flex-col items-center gap-1 text-[10px] ${active ? "text-teal-700" : "text-slate-500"}`}><span className={`flex size-8 items-center justify-center rounded-lg ${primary ? "bg-teal-700 text-white" : active ? "bg-teal-50" : ""}`}><Icon className="size-4" /></span>{label}</button>; }
