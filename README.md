# Care Transition Desk prototype

An interactive redesign concept for the Elderly Care Match placement coordinator portal. It focuses the experience on a discharge planner's immediate questions: which patients are leaving soon, what Elderly Care Match is doing, and whether anything needs their attention.

The prototype uses sample data only. Forms do not send or persist information, and no patient records are involved.

## Included flows

- Urgent handoffs ordered by discharge date
- A single, one-minute **Hand off a case** entry point
- Elderly Care Match owns intake, authorization, matching, and home outreach
- Plain-language case progress with clear ownership and next update
- Patient/case terminology for clinical teams
- Optional care directory with advisor-assisted fit checks
- Clear human escalation for same-day discharges
- Responsive desktop and mobile navigation

## Run locally

```bash
npm install
npm run dev
```

Production checks: `npm run lint` and `npm run build`.
