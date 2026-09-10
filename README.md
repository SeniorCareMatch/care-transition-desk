# Care Transition Desk prototype

An interactive redesign concept for the Elderly Care Match placement coordinator
portal. It focuses the experience on a discharge planner's immediate questions:
which patients are leaving soon, which cases need action, and which verified
homes have an appropriate bed.

The prototype uses sample data only. Forms do not send or persist information.

## Included flows

- Urgent cases ordered by discharge date
- A single **Place a patient** entry point
- Three-step intake with urgency and payment first
- Save-draft behavior
- Patient/case terminology for clinical teams
- Bed search with vacancy, Medicaid, care-needs, and distance filters
- Clear human escalation for same-day discharges
- Responsive desktop and mobile navigation

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```
