"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  BedDouble,
  Bell,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  HeartHandshake,
  Home,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type View = "today" | "handoffs" | "care";

type Handoff = {
  patient: string;
  need: string;
  discharge: string;
  urgency: "today" | "soon" | "later";
  weAreDoing: string;
  nextUpdate: string;
  needsYou: boolean;
};

type CareHome = {
  name: string;
  distance: string;
  beds: number;
  payment: string;
  supports: string[];
};

const handoffs: Handoff[] = [
  {
    patient: "M. Carter",
    need: "Memory care",
    discharge: "Today, 4:00 PM",
    urgency: "today",
    weAreDoing: "Calling three matching homes",
    nextUpdate: "By 10:30 AM",
    needsYou: false,
  },
  {
    patient: "R. Williams",
    need: "Adult family home",
    discharge: "Tomorrow",
    urgency: "soon",
    weAreDoing: "Three homes are reviewing the case",
    nextUpdate: "This afternoon",
    needsYou: false,
  },
  {
    patient: "A. Lee",
    need: "Assisted living",
    discharge: "Sep 14",
    urgency: "later",
    weAreDoing: "Family is comparing two options",
    nextUpdate: "Friday",
    needsYou: false,
  },
];

const careHomes: CareHome[] = [
  {
    name: "Cedar Grove Adult Family Home",
    distance: "2.4 miles away",
    beds: 2,
    payment: "Medicaid",
    supports: ["Memory care", "Transfers with lift"],
  },
  {
    name: "Northlake Senior Living",
    distance: "4.8 miles away",
    beds: 1,
    payment: "Private pay",
    supports: ["Memory care", "Hospice"],
  },
  {
    name: "Harbor View Care Residence",
    distance: "7.1 miles away",
    beds: 3,
    payment: "Medicaid",
    supports: ["Wound care", "Behavioral support"],
  },
];

const timingChoices = [
  { value: "today", label: "Today", hint: "Urgent" },
  { value: "tomorrow", label: "Tomorrow", hint: "Next 24 hours" },
  { value: "week", label: "Within a week", hint: "Time to compare" },
  { value: "later", label: "Later", hint: "Planning ahead" },
];

export function CareDesk() {
  const [view, setView] = useState<View>("today");
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [openCase, setOpenCase] = useState<Handoff | null>(null);
  const [openHome, setOpenHome] = useState<CareHome | null>(null);
  const [medicaidOnly, setMedicaidOnly] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const visibleHomes = medicaidOnly
    ? careHomes.filter((home) => home.payment === "Medicaid")
    : careHomes;

  function goTo(next: View) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finish(message: string) {
    setHandoffOpen(false);
    setOpenHome(null);
    setConfirmation(message);
    goTo("today");
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-slate-950">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
          <HeartHandshake className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Care Transition Desk</p>
          <p className="hidden text-xs text-slate-500 sm:block">Elderly Care Match</p>
        </div>
        <Badge variant="outline" className="hidden border-amber-200 bg-amber-50 text-amber-800 lg:inline-flex">
          Prototype · sample data
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="hidden gap-2 md:inline-flex">
            <Phone className="size-4" />
            (206) 555-0144
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell />
          </Button>
          <Button onClick={() => setHandoffOpen(true)} className="h-10 gap-2">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Hand off a case</span>
            <span className="sm:hidden">Hand off</span>
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-3 lg:flex">
          <SideLink icon={Home} label="Today" active={view === "today"} onClick={() => goTo("today")} />
          <SideLink
            icon={HeartHandshake}
            label="My handoffs"
            count={handoffs.length}
            active={view === "handoffs"}
            onClick={() => goTo("handoffs")}
          />
          <SideLink icon={BedDouble} label="Browse care" active={view === "care"} onClick={() => goTo("care")} />

          <div className="mt-auto rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-sm font-semibold text-teal-950">Need someone now?</p>
            <p className="mb-3 mt-1 text-xs leading-5 text-teal-900">
              Call us and we will start the search while we talk.
            </p>
            <Button size="sm" className="w-full gap-2">
              <Phone className="size-3.5" />
              (206) 555-0144
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          <div className="mx-auto max-w-5xl">
            {confirmation && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
              >
                <Check className="mt-0.5 size-4 shrink-0" />
                <p className="flex-1">{confirmation}</p>
                <button onClick={() => setConfirmation("")} aria-label="Dismiss message">
                  <X className="size-4" />
                </button>
              </div>
            )}

            {view === "today" && (
              <TodayView
                onHandoff={() => setHandoffOpen(true)}
                onOpenCase={setOpenCase}
                onBrowse={() => goTo("care")}
              />
            )}
            {view === "handoffs" && (
              <HandoffsView onHandoff={() => setHandoffOpen(true)} onOpenCase={setOpenCase} />
            )}
            {view === "care" && (
              <CareView
                homes={visibleHomes}
                medicaidOnly={medicaidOnly}
                onToggleMedicaid={() => setMedicaidOnly(!medicaidOnly)}
                onSelectHome={setOpenHome}
              />
            )}
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 gap-1 border-t border-slate-200 bg-white p-2 lg:hidden">
        <TabLink icon={Home} label="Today" active={view === "today"} onClick={() => goTo("today")} />
        <TabLink
          icon={HeartHandshake}
          label="Handoffs"
          active={view === "handoffs"}
          onClick={() => goTo("handoffs")}
        />
        <TabLink icon={Plus} label="Hand off" primary onClick={() => setHandoffOpen(true)} />
        <TabLink icon={BedDouble} label="Browse" active={view === "care"} onClick={() => goTo("care")} />
      </nav>

      <HandoffDialog
        open={handoffOpen}
        onClose={() => setHandoffOpen(false)}
        onSubmit={() =>
          finish("Handoff received. Your advisor calls the family next and updates you within 15 minutes.")
        }
      />
      <CaseDialog item={openCase} onClose={() => setOpenCase(null)} />
      <HomeDialog
        item={openHome}
        onClose={() => setOpenHome(null)}
        onSubmit={() => finish("Your advisor is checking that home. Nothing else is needed from you.")}
      />
    </div>
  );
}

function TodayView({
  onHandoff,
  onOpenCase,
  onBrowse,
}: {
  onHandoff: () => void;
  onOpenCase: (item: Handoff) => void;
  onBrowse: () => void;
}) {
  const urgent = handoffs[0];
  return (
    <>
      <PageHeader
        title="Good morning, Jamie"
        summary="Nothing needs you right now. We are working three handoffs for you."
        action={
          <Button onClick={onHandoff} className="h-11 gap-2">
            <Plus className="size-4" />
            Hand off a case
          </Button>
        }
      />

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-red-600 text-white">Discharging today</Badge>
          <span className="text-sm text-slate-500">{urgent.discharge}</span>
        </div>
        <h2 className="mt-3 text-xl font-semibold">
          {urgent.patient} · {urgent.need}
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">We are doing</dt>
            <dd className="mt-1 text-sm">{urgent.weAreDoing}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">You will hear from us</dt>
            <dd className="mt-1 text-sm">{urgent.nextUpdate}</dd>
          </div>
        </dl>
        <Button onClick={() => onOpenCase(urgent)} variant="outline" className="mt-5 h-11 gap-2">
          See the full picture
          <ArrowRight className="size-4" />
        </Button>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold">How this works</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            { title: "You hand off", body: "Four quick answers. About 60 seconds." },
            { title: "We do the work", body: "We call the family, confirm authorization, and contact homes." },
            { title: "You stay informed", body: "Plain updates here and by email. We only ask if something blocks discharge." },
          ].map((step, index) => (
            <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="flex size-8 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <p className="mt-3 font-semibold">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <HandoffList title="Your handoffs" onOpenCase={onOpenCase} />

      <button
        onClick={onBrowse}
        className="mt-6 flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-teal-300"
      >
        <BedDouble className="size-5 shrink-0 text-teal-700" />
        <span className="flex-1">
          <span className="block font-semibold">Want to see what is available?</span>
          <span className="block text-sm text-slate-600">
            Optional. Browsing is just for context, we handle the outreach.
          </span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-slate-400" />
      </button>
    </>
  );
}

function HandoffsView({
  onHandoff,
  onOpenCase,
}: {
  onHandoff: () => void;
  onOpenCase: (item: Handoff) => void;
}) {
  return (
    <>
      <PageHeader
        title="My handoffs"
        summary="Every case you sent us, what we are doing, and when you will hear back."
        action={
          <Button onClick={onHandoff} className="h-11 gap-2">
            <Plus className="size-4" />
            Hand off a case
          </Button>
        }
      />
      <HandoffList onOpenCase={onOpenCase} />
    </>
  );
}

function HandoffList({ title, onOpenCase }: { title?: string; onOpenCase: (item: Handoff) => void }) {
  return (
    <section>
      {title && <h2 className="mb-4 text-base font-semibold">{title}</h2>}
      <ul className="space-y-3">
        {handoffs.map((item) => (
          <li key={item.patient}>
            <button
              onClick={() => onOpenCase(item)}
              className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-300 sm:p-5"
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{item.patient}</span>
                  <span className="text-sm text-slate-500">{item.need}</span>
                </span>
                <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span
                    className={
                      item.urgency === "today"
                        ? "font-semibold text-red-700"
                        : "font-medium text-slate-700"
                    }
                  >
                    Discharge: {item.discharge}
                  </span>
                  <span className="text-slate-600">{item.weAreDoing}</span>
                </span>
              </span>
              <span className="hidden shrink-0 text-right text-xs text-slate-500 sm:block">
                <Clock3 className="mb-1 ml-auto size-4" />
                {item.nextUpdate}
              </span>
              <ChevronRight className="size-5 shrink-0 text-slate-400" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CareView({
  homes,
  medicaidOnly,
  onToggleMedicaid,
  onSelectHome,
}: {
  homes: CareHome[];
  medicaidOnly: boolean;
  onToggleMedicaid: () => void;
  onSelectHome: (home: CareHome) => void;
}) {
  return (
    <>
      <PageHeader
        title="Browse care"
        summary="Looking is optional. Flag anything promising and your advisor checks fit, availability, and payment."
      />
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <Button
          variant={medicaidOnly ? "default" : "outline"}
          onClick={onToggleMedicaid}
          className="h-10 gap-2"
        >
          {medicaidOnly && <Check className="size-4" />}
          Accepts Medicaid
        </Button>
        <p className="text-sm text-slate-600">
          Showing <strong>{homes.length}</strong> {homes.length === 1 ? "home" : "homes"} with beds open now
        </p>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {homes.map((home) => (
          <li key={home.name} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <Building2 className="size-5 text-slate-500" />
              <Badge className="bg-emerald-100 text-emerald-900">
                {home.beds} {home.beds === 1 ? "bed" : "beds"} open
              </Badge>
            </div>
            <h2 className="mt-4 font-semibold">{home.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="size-3.5" />
              {home.distance}
            </p>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-slate-500">Payment:</dt>
                <dd>{home.payment}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate-500">Supports:</dt>
                <dd>{home.supports.join(", ")}</dd>
              </div>
            </dl>
            <Button onClick={() => onSelectHome(home)} className="mt-5 h-11 w-full">
              Ask our team about this home
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}

function HandoffDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [timing, setTiming] = useState("today");
  const [initials, setInitials] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const phoneReady = phone.replace(/\D/g, "").length >= 10;
  const ready = Boolean(initials.trim() && contact.trim() && phoneReady);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-slate-200 p-5 sm:p-6">
          <DialogTitle className="text-xl">Hand off a case</DialogTitle>
          <DialogDescription>
            Answer four quick questions. We take the case from there.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-5 sm:p-6">
          <p className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950">
            <strong>You are not filling out our intake.</strong> Tell us only what you already know. We
            gather care needs, budget, and authorization ourselves.
          </p>

          <Step number={1} label="When does the patient leave?">
            <div className="grid gap-2 sm:grid-cols-2">
              {timingChoices.map((choice) => {
                const selected = timing === choice.value;
                return (
                  <button
                    key={choice.value}
                    onClick={() => setTiming(choice.value)}
                    className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 text-left transition ${
                      selected
                        ? "border-teal-700 bg-teal-50 ring-1 ring-teal-700"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-medium">{choice.label}</span>
                      <span className="block text-xs text-slate-500">{choice.hint}</span>
                    </span>
                    {selected && <Check className="size-4 shrink-0 text-teal-700" />}
                  </button>
                );
              })}
            </div>
          </Step>

          <Step number={2} label="Who is the patient?">
            <Label htmlFor="initials" className="mb-1.5 text-sm font-normal text-slate-600">
              Initials are enough to start
            </Label>
            <FieldInput
              id="initials"
              value={initials}
              onChange={setInitials}
              placeholder="M.C."
              valid={Boolean(initials.trim())}
            />
          </Step>

          <Step number={3} label="Who should we call?">
            <p className="mb-3 text-sm text-slate-600">
              A family member, legal representative, or the patient. We explain everything on that call.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="contact" className="mb-1.5 text-sm font-normal text-slate-600">
                  Name
                </Label>
                <FieldInput
                  id="contact"
                  value={contact}
                  onChange={setContact}
                  placeholder="Taylor Smith"
                  valid={Boolean(contact.trim())}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1.5 text-sm font-normal text-slate-600">
                  Phone
                </Label>
                <FieldInput
                  id="phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder="(206) 555-0123"
                  valid={phoneReady}
                  type="tel"
                />
              </div>
            </div>
          </Step>

          <Step number={4} label="Anything we should know?" optional>
            <Textarea placeholder="One sentence is plenty. Example: family speaks Spanish." />
          </Step>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold">What happens after you hand off</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {[
                "We call the family and gather the details.",
                "We confirm authorization before anything is shared.",
                "We contact matching homes and report back here.",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-teal-700" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 sm:px-6">
          <Button disabled={!ready} onClick={onSubmit} className="h-12 w-full gap-2 text-base">
            Hand off to our team
            <ArrowRight className="size-4" />
          </Button>
          <p className="mt-2 text-center text-xs text-slate-500">
            {ready ? "Takes one click. We call the family next." : "Add initials, a name, and a phone number to continue."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CaseDialog({ item, onClose }: { item: Handoff | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(item)} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{item?.patient}</DialogTitle>
          <DialogDescription>
            {item?.need} · discharge {item?.discharge}
          </DialogDescription>
        </DialogHeader>

        <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong>Nothing needed from you.</strong> We will contact you only if something could delay
          discharge.
        </p>

        <div>
          <p className="mb-4 text-sm font-semibold">Where things stand</p>
          <ol className="space-y-4">
            {[
              { title: "Family reached", detail: "We gathered care needs and preferences.", done: true },
              { title: "Homes contacted", detail: item?.weAreDoing ?? "", done: true },
              { title: "Options for the family", detail: `Next update: ${item?.nextUpdate ?? ""}`, done: false },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    step.done ? "bg-teal-700 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {step.done ? <Check className="size-4" /> : index + 1}
                </span>
                <span>
                  <span className="block text-sm font-medium">{step.title}</span>
                  <span className="block text-sm text-slate-600">{step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            CB
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Cami, your advisor</span>
            <span className="block text-xs text-slate-500">Owns this case · replies in about 5 minutes</span>
          </span>
          <Button variant="outline" className="h-10">
            Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HomeDialog({
  item,
  onClose,
  onSubmit,
}: {
  item: CareHome | null;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={Boolean(item)} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ask about this home</DialogTitle>
          <DialogDescription>
            You do not need to call or send records. Your advisor checks fit and availability.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="font-semibold">{item?.name}</p>
          <p className="mt-1 text-sm text-slate-600">
            {item?.distance} · {item?.beds} {item?.beds === 1 ? "bed" : "beds"} open · {item?.payment}
          </p>
        </div>

        <p className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          Nothing is shared automatically. We confirm authorization first.
        </p>

        <Button onClick={onSubmit} className="h-11 w-full">
          Ask my advisor to check
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function PageHeader({
  title,
  summary,
  action,
}: {
  title: string;
  summary: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{summary}</p>
      </div>
      {action}
    </div>
  );
}

function Step({
  number,
  label,
  optional,
  children,
}: {
  number: number;
  label: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <section>
      <p className="mb-3 flex items-center gap-2 font-semibold">
        <span className="flex size-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
          {number}
        </span>
        {label}
        {optional && <span className="text-sm font-normal text-slate-500">(optional)</span>}
      </p>
      {children}
    </section>
  );
}

function FieldInput({
  id,
  value,
  onChange,
  placeholder,
  valid,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  valid: boolean;
  type?: string;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 pr-10"
      />
      {valid && (
        <Check className="pointer-events-none absolute right-3 top-3.5 size-4 text-emerald-600" />
      )}
    </div>
  );
}

function SideLink({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
        active ? "bg-teal-50 font-semibold text-teal-900" : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <Icon className="size-4.5 shrink-0" />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
          {count}
        </span>
      )}
    </button>
  );
}

function TabLink({
  icon: Icon,
  label,
  active,
  primary,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  active?: boolean;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium ${
        active ? "text-teal-800" : "text-slate-600"
      }`}
    >
      <span
        className={`flex size-9 items-center justify-center rounded-lg ${
          primary ? "bg-teal-700 text-white" : active ? "bg-teal-50" : ""
        }`}
      >
        <Icon className="size-5" />
      </span>
      {label}
    </button>
  );
}
