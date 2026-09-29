# Sunvale Hospital — Admin Panel (React + Vite + Tailwind v4)

Separate app from the patient website. Runs on port **5174** and only talks to the
`/api/v1/admin/**` namespace (plus `/auth/*`). Only accounts with `role: "admin"` can get in —
anyone else is rejected at login and at session restore.

## Run

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5174
```

Backend `.env` needs `ADMIN_CLIENT_URL=http://localhost:5174`. Log in with the seeded admin
(`npm run seed` in the backend → `admin@hospital.com` / `Admin@12345`; change it).

## Sections

| Route | What it does |
|---|---|
| `/` Dashboard | Today's schedule, pending count, next-7-days load, new messages |
| `/appointments` | Filter by status/doctor/date/search; open a detail modal to confirm, complete, cancel, or mark no-show |
| `/doctors` | Search/filter by department, create/edit in a slide-over **with a weekly schedule editor**, deactivate |
| `/departments` | Create/edit (image, icon, services list), toggle active, delete (blocked while doctors are assigned) |
| `/patients` | Search accounts, view profile + recent appointment history, activate/deactivate |
| `/messages` | Contact-form inbox, update status, delete |

## The schedule editor

`components/doctors/AvailabilityEditor.jsx` edits the exact array shape the backend turns into
bookable slots: `{ dayOfWeek, startTime, endTime, slotDurationMinutes }`. It's a flat list, not a
calendar grid — add one row per clinic session (e.g. two rows for "Mon 9–1" and "Mon 4–7").
Rows are validated client-side (end after start) before submit; the backend validates again.
`qualifications`, `languages`, and `availability` are sent as JSON strings in the multipart
request, matching the backend's `parseJsonFields` middleware.

## Appointment status rules (enforced identically to the backend)

```
pending   -> confirmed | cancelled
confirmed -> completed | cancelled | no_show
completed / cancelled / no_show -> (final, no actions shown)
```
The detail modal only ever shows the buttons that are actually legal for the current status.
Cancelling asks for a reason, which the patient sees on their appointment page.

## Structure

```
src/
├── api/            one file per admin resource
├── hooks/          React Query hooks (only place components fetch/mutate)
├── store/          authStore (token in memory, user persisted)
├── lib/            axios (refresh-on-401), dates.js, siteConfig.js (timezone only)
├── components/
│   ├── ui/         same design-system primitives as the patient site
│   ├── layout/     AdminLayout (sidebar), AdminRoute guard
│   ├── common/      PageHeader, DataTable, StatusBadge, ConfirmDialog, StatCard
│   ├── doctors/     DoctorFormSheet, AvailabilityEditor
│   ├── departments/ DepartmentFormModal, icons.js
│   ├── appointments/ AppointmentDetailModal
│   └── patients/    PatientDetailModal
└── pages/          Dashboard, Doctors, Departments, Appointments, Patients, Messages, Login, NotFound
```

**Add a section:** create `pages/Foo.jsx` → add to `NAV` in `AdminLayout.jsx` → add a `<Route>` in `App.jsx`.

## Known limitations (backend-driven)

- **Shared login cookie on localhost:** the admin panel and patient site share the `refreshToken`
  cookie on `localhost` (browsers scope cookies by host, not port). On real subdomains this goes away.
- Editing a doctor's schedule does not touch appointments already booked in slots that no longer
  exist — review the Appointments screen after a schedule change.
- Department icon is chosen from a fixed list (`components/departments/icons.js`) that must match
  the icon-key → lucide-icon map in the patient site.
