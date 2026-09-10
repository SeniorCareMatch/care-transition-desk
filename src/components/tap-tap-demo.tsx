"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  HeartHandshake,
  Hospital,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Patient = {
  id: string;
  name: string;
  room: string;
  discharge: string;
  urgency: "today" | "soon" | "later";
  destination: string;
  payer: string;
  contact: string;
  phone: string;
  needs: string[];
};

type CareHome = {
  name: string;
  distance: string;
  beds: number;
  payment: string;
  supports: string[];
};

const patients: Patient[] = [
  { id: "MC", name: "M. Carter", room: "6E · 612", discharge: "Today, 4:00 PM", urgency: "today", destination: "Adult family home", payer: "Medicaid pending", contact: "Taylor Carter · daughter", phone: "(206) 555-0123", needs: ["Memory care", "Transfers with lift"] },
  { id: "RW", name: "R. Williams", room: "7N · 728", discharge: "Tomorrow", urgency: "soon", destination: "Assisted living", payer: "Private pay", contact: "Jordan Williams · son", phone: "(206) 555-0148", needs: ["Medication support"] },
  { id: "AL", name: "A. Lee", room: "5W · 503", discharge: "Sep 14", urgency: "later", destination: "Memory care", payer: "Long-term care insurance", contact: "Morgan Lee · spouse", phone: "(206) 555-0176", needs: ["Memory care", "24-hour supervision"] },
];

const homes = [
  { name: "Cedar Grove Adult Family Home", distance: 2.4, beds: 2, payer: "Medicaid", needs: ["Memory care", "Transfers with lift"] },
  { name: "Northlake Senior Living", distance: 4.8, beds: 1, payer: "Private pay", needs: ["Memory care", "Hospice"] },
  { name: "Harbor View Care Residence", distance: 7.1, beds: 3, payer: "Medicaid", needs: ["Wound care", "Behavioral support"] },
  { name: "Green Lake Care Home", distance: 11.8, beds: 1, payer: "Medicaid", needs: ["Memory care", "Medication support"] },
];

export function TapTapDemo() {
  const [selected, setSelected] = useState<Patient | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [bedsMode, setBedsMode] = useState(false);
  const [medicaid, setMedicaid] = useState(true);
  const [memoryCare, setMemoryCare] = useState(true);
  const [withinTen, setWithinTen] = useState(true);
  const matches = useMemo(() => homes.filter((home) => (!medicaid || home.payer === "Medicaid") && (!memoryCare || home.needs.includes("Memory care")) && (!withinTen || home.distance <= 10)), [medicaid, memoryCare, withinTen]);

  function selectPatient(patient: Patient) {
    setSelected(patient);
    setBedsMode(false);
    setMedicaid(patient.payer.toLowerCase().includes("medicaid"));
    setMemoryCare(patient.needs.includes("Memory care"));
    setWithinTen(true);
  }

  function sendHandoff() {
    if (selected) setSent((current) => [...current, selected.id]);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="flex min-h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
        <span className="flex size-9 items-center justify-center rounded-lg bg-teal-700 text-white"><HeartHandshake className="size-5" /></span>
        <div><p className="text-sm font-semibold">Elderly Care Match</p><p className="text-xs text-slate-500">Care transition handoff</p></div>
        <Badge variant="outline" className="ml-2 hidden border-blue-200 bg-blue-50 text-blue-800 md:flex">EHR-connected demo · sample data</Badge>
        <Button variant="outline" className="ml-auto h-10 gap-2"><Phone className="size-4" /><span className="hidden sm:inline">(206) 771-2112</span><span className="sm:hidden">Call us</span></Button>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 rounded-xl border border-teal-200 bg-teal-50 p-4 sm:flex-row sm:items-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700"><Hospital className="size-5" /></div>
          <div className="flex-1"><p className="font-semibold">Designed to open inside the hospital workflow</p><p className="mt-1 text-sm text-slate-600">Patient and discharge information come from the chart. No duplicate intake.</p></div>
          <div className="flex items-center gap-2 text-sm font-medium text-teal-900"><Badge className="bg-teal-700 text-white">1</Badge>Select patient<ArrowRight className="size-4" /><Badge className="bg-teal-700 text-white">2</Badge>Hand off</div>
        </div>

        <div className="grid min-h-[680px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
          <aside className={`${selected ? "hidden lg:block" : "block"} border-r border-slate-200`}>
            <div className="border-b border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">My discharge list</p><div className="relative mt-3"><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input aria-label="Search patients" placeholder="Search patient or room" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-teal-600" /></div></div>
            <ul>{patients.map((patient) => <li key={patient.id} className="border-b border-slate-100"><button onClick={() => selectPatient(patient)} className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-slate-50"><span className={`size-2 shrink-0 rounded-full ${patient.urgency === "today" ? "bg-red-500" : patient.urgency === "soon" ? "bg-amber-500" : "bg-slate-300"}`} /><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="font-semibold">{patient.name}</span><span className="text-xs text-slate-500">{patient.room}</span></span><span className={`mt-1 block text-sm ${patient.urgency === "today" ? "font-semibold text-red-700" : "text-slate-600"}`}>Discharge {patient.discharge}</span><span className="mt-1 block truncate text-xs text-slate-500">{patient.destination}</span></span>{sent.includes(patient.id) ? <Check className="size-5 shrink-0 text-emerald-600" /> : <ChevronRight className="size-5 shrink-0 text-slate-400" />}</button></li>)}</ul>
          </aside>

          <main className={`${selected ? "block" : "hidden lg:block"} bg-slate-50/40`}>
            {!selected ? <div className="flex h-full flex-col items-center justify-center p-8 text-center"><span className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"><UserRound className="size-6" /></span><h1 className="mt-4 text-xl font-semibold">Select a patient to begin</h1><p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">Everything already available in the chart will appear here for a quick confirmation.</p></div> : sent.includes(selected.id) ? <Success patient={selected} onBack={() => setSelected(null)} /> : bedsMode ? <FindBeds patient={selected} matches={matches} medicaid={medicaid} memoryCare={memoryCare} withinTen={withinTen} setMedicaid={setMedicaid} setMemoryCare={setMemoryCare} setWithinTen={setWithinTen} onBack={() => setBedsMode(false)} /> : <PatientSummary patient={selected} onBack={() => setSelected(null)} onSend={sendHandoff} onFindBeds={() => setBedsMode(true)} />}
          </main>
        </div>
      </div>
    </div>
  );
}

function PatientSummary({ patient, onBack, onSend, onFindBeds }: { patient: Patient; onBack: () => void; onSend: () => void; onFindBeds: () => void }) {
  return <div className="mx-auto max-w-3xl p-5 sm:p-8"><Button variant="ghost" onClick={onBack} className="mb-4 gap-2 lg:hidden"><ArrowLeft className="size-4" />Patient list</Button><div className="flex flex-col gap-4 sm:flex-row sm:items-start"><span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 font-semibold text-white">{patient.id}</span><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-semibold">{patient.name}</h1>{patient.urgency === "today" && <Badge className="bg-red-600">Discharging today</Badge>}</div><p className="mt-1 text-sm text-slate-600">Room {patient.room} · discharge {patient.discharge}</p></div></div><section className="mt-6 rounded-xl border border-slate-200 bg-white"><div className="flex items-center gap-3 border-b border-slate-200 p-4"><ClipboardCheck className="size-5 text-teal-700" /><div><h2 className="font-semibold">Ready to hand off</h2><p className="text-xs text-slate-500">Prefilled from the patient chart</p></div><Badge className="ml-auto bg-emerald-100 text-emerald-800">No typing needed</Badge></div><dl className="grid gap-0 sm:grid-cols-2"><Summary label="Discharge" value={patient.discharge} /><Summary label="Likely setting" value={patient.destination} /><Summary label="Payment" value={patient.payer} /><Summary label="Family contact" value={`${patient.contact} · ${patient.phone}`} /><Summary label="Known needs" value={patient.needs.join(", ")} wide /></dl></section><div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4"><div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-700" /><div><p className="text-sm font-semibold text-blue-950">Elderly Care Match takes it from here</p><p className="mt-1 text-sm leading-6 text-blue-900">We call the family, gather preferences, confirm authorization, find matching homes, and report back.</p></div></div></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button onClick={onSend} className="h-12 flex-1 gap-2 text-base">Hand off to Elderly Care Match<ArrowRight className="size-4" /></Button><Button variant="outline" onClick={onFindBeds} className="h-12 gap-2"><BedDouble className="size-4" />Preview matching beds</Button></div><p className="mt-3 text-center text-xs text-slate-500">No information is sent to care homes until the family authorizes it.</p></div>;
}

function Success({ patient, onBack }: { patient: Patient; onBack: () => void }) {
  return <div className="flex h-full flex-col items-center justify-center p-6 text-center"><span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-8" /></span><Badge className="mt-5 bg-emerald-100 text-emerald-800">Handoff received</Badge><h1 className="mt-3 text-2xl font-semibold">Done. We have {patient.name}.</h1><p className="mt-3 max-w-md text-sm leading-6 text-slate-600">An Elderly Care Match advisor will call {patient.contact.split(" · ")[0]} and update you within 15 minutes.</p><div className="mt-6 grid w-full max-w-lg gap-3 text-left sm:grid-cols-3">{["Call the family", "Confirm authorization", "Contact matching homes"].map((item, index) => <div key={item} className="rounded-xl border border-slate-200 bg-white p-4"><span className="text-xs font-semibold text-teal-700">NEXT {index + 1}</span><p className="mt-1 text-sm font-medium">{item}</p></div>)}</div><Button variant="outline" onClick={onBack} className="mt-6">Back to patient list</Button><p className="mt-4 text-xs text-slate-500">Need us? (206) 771-2112</p></div>;
}

function FindBeds({ patient, matches, medicaid, memoryCare, withinTen, setMedicaid, setMemoryCare, setWithinTen, onBack }: { patient: Patient; matches: typeof homes; medicaid: boolean; memoryCare: boolean; withinTen: boolean; setMedicaid: (value: boolean) => void; setMemoryCare: (value: boolean) => void; setWithinTen: (value: boolean) => void; onBack: () => void }) {
  return <div className="p-5 sm:p-8"><Button variant="ghost" onClick={onBack} className="mb-4 gap-2"><ArrowLeft className="size-4" />Back to handoff</Button><p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Optional preview</p><h1 className="mt-1 text-2xl font-semibold">Beds matching {patient.name}</h1><p className="mt-2 text-sm text-slate-600">Filters were filled from the chart. Adjust only if helpful.</p><div className="mt-5 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-4"><Filter active onClick={() => undefined}>Beds open now</Filter><Filter active={medicaid} onClick={() => setMedicaid(!medicaid)}>Accepts Medicaid</Filter><Filter active={memoryCare} onClick={() => setMemoryCare(!memoryCare)}>Memory care</Filter><Filter active={withinTen} onClick={() => setWithinTen(!withinTen)}>Within 10 miles</Filter><Badge variant="secondary" className="ml-auto">{matches.length} matches</Badge></div><ul className="mt-4 grid gap-4 xl:grid-cols-2">{matches.map((facility) => <li key={facility.name} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-start justify-between gap-3"><Building2 className="size-5 text-slate-500" /><Badge className="bg-emerald-100 text-emerald-800">{facility.beds} beds open</Badge></div><h2 className="mt-3 font-semibold">{facility.name}</h2><p className="mt-1 text-sm text-slate-600">{facility.distance} miles · {facility.payer}</p><p className="mt-2 text-sm text-slate-600">{facility.needs.join(" · ")}</p></li>)}</ul>{matches.length === 0 && <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-center"><p className="font-semibold">No exact matches</p><p className="mt-1 text-sm text-slate-600">Remove a filter or hand off the case—our team can search beyond this list.</p></div>}</div>;
}

function Summary({ label, value, wide }: { label: string; value: string; wide?: boolean }) { return <div className={`border-b border-slate-100 p-4 ${wide ? "sm:col-span-2" : ""}`}><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium">{value}</dd></div>; }
function Filter({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button onClick={onClick} className={`flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm font-medium transition ${active ? "border-teal-700 bg-teal-50 text-teal-800" : "border-slate-200 text-slate-600"}`}>{active && <Check className="size-3.5" />}{children}</button>; }
