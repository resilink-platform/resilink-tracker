# Resilink Enrollment Tracker

Real-time enrollment dashboard for NEET PG State Resident Heads.

---

## Tech Stack

- **Frontend** — Next.js 15 + Tailwind CSS + TypeScript
- **Backend/DB** — Supabase (PostgreSQL + real-time WebSocket)
- **Hosting** — Vercel

---

## Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) → create a free account
2. Click **New Project** → give it a name (e.g. `resilink-tracker`) → set a DB password → create
3. Once created, go to **SQL Editor** (left sidebar)
4. Run this SQL to create the table and insert your 6 states:

```sql
-- Create the enrollment table
create table public.enrollment (
  id serial primary key,
  state text not null,
  head_name text not null,
  abbr text not null,
  target integer not null default 40,
  enrolled integer not null default 0,
  updated_at timestamptz default now()
);

-- ⚠️ UPDATE THE VALUES BELOW with real state names, head names, and targets
insert into public.enrollment (state, head_name, abbr, target, enrolled) values
  ('Maharashtra', 'Dr. Rajesh Patil',   'MH', 40, 0),
  ('Karnataka',   'Dr. Priya Sharma',   'KA', 35, 0),
  ('Tamil Nadu',  'Dr. Arjun Krishnan', 'TN', 45, 0),
  ('Delhi',       'Dr. Neha Singh',     'DL', 30, 0),
  ('Gujarat',     'Dr. Amit Patel',     'GJ', 40, 0),
  ('Rajasthan',   'Dr. Sunita Verma',   'RJ', 25, 0);

-- Enable real-time on this table (required for live sync)
alter table public.enrollment replica identity full;
```

5. Go to **Table Editor** → open `enrollment` → verify 6 rows are inserted

6. Enable real-time:
   - Go to **Database** → **Replication** (left sidebar)
   - Find `enrollment` table → toggle it ON

---

## Step 2 — Get Supabase API Keys

1. Go to **Project Settings** (gear icon, bottom left) → **API**
2. Copy these two values:
   - **Project URL** (looks like `https://abcxyz.supabase.co`)
   - **anon / public key** (long JWT string)

---

## Step 3 — Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-org/resilink-tracker.git
cd resilink-tracker

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

```bash
# 4. Run the dev server
npm run dev

# 5. Open in browser
# → http://localhost:3000
```

---

## Step 4 — Deploy to Vercel

1. Push this repo to your GitHub org (keep it **private**)
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import the `resilink-tracker` repo from your GitHub org
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your anon key
5. Click **Deploy** → Vercel builds and gives you a live URL
6. Share that URL with all 6 state heads ✅

---

## How to Edit Content

| What to change | File to edit |
|---|---|
| State names, head names, targets | Run new SQL in Supabase SQL Editor |
| State color for each state | `config/colors.ts` |
| Motivational slogans | `config/slogans.ts` |
| Page layout / card design | `components/MainCard.tsx` |
| Tab bar design | `components/TabBar.tsx` |
| Bottom comparison grid | `components/MiniStateCards.tsx` |
| Circular ring | `components/CircularRing.tsx` |

---

## Project Structure

```
resilink-tracker/
├── app/
│   ├── page.tsx          ← Main page (data + real-time logic)
│   ├── layout.tsx        ← Root layout + metadata
│   └── globals.css       ← Global styles + Tailwind imports
├── components/
│   ├── TabBar.tsx        ← 6 colored state pills at the top
│   ├── MainCard.tsx      ← Active state card (ring + +/- buttons)
│   ├── CircularRing.tsx  ← Reusable SVG ring (large + mini)
│   ├── MiniStateCards.tsx← Bottom 6-state comparison grid
│   └── Slogan.tsx        ← Rotating motivational quote
├── config/
│   ├── colors.ts         ← Color per state (edit to change theme)
│   └── slogans.ts        ← Motivational quotes list
├── lib/
│   ├── supabase.ts       ← Supabase client
│   └── types.ts          ← TypeScript types
├── .env.example          ← Template for env variables
└── README.md             ← This file
```
