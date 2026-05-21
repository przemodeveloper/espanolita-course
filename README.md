# Matura Españolita

An online course that helps Polish high‑school students prepare for the **matura** exam in Spanish. Students work through typical exam tasks — listening comprehension, gap‑fill, heading match, single‑choice questions and open‑ended writing — and receive automated feedback, including AI‑graded essays.

> Live site: [matura-espanolita.pl](https://matura-espanolita.pl)

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS v4, [Radix UI](https://www.radix-ui.com/) primitives, [lucide-react](https://lucide.dev/), `tw-animate-css`, Motion
- **Data layer:** [Prisma](https://www.prisma.io/) ORM against PostgreSQL hosted on [Supabase](https://supabase.com)
- **Auth:** Supabase Auth (SSR) via `@supabase/ssr`
- **Server state:** [TanStack Query](https://tanstack.com/query) + Axios
- **Forms:** React Hook Form
- **Payments:** [Stripe](https://stripe.com) Checkout + webhooks
- **AI grading:** [OpenAI](https://platform.openai.com/) (essay and audio gap‑fill grading prompts in `lib/`)
- **Email:** [Resend](https://resend.com) with `@react-email/components` templates
- **Anti‑bot:** Cloudflare [Turnstile](https://www.cloudflare.com/products/turnstile/)
- **Audio:** `react-h5-audio-player`
- **Drag & drop:** `@dnd-kit/core` (used in gap‑fill / matching tasks)
- **Analytics:** Vercel Analytics + Speed Insights

## Project structure

```
app/                 Next.js App Router (pages + API routes)
  (home)/            Public landing page
  course/            Authenticated course area & task runner
  api/               Route handlers (auth, checkout, Stripe, v2 task APIs…)
components/          UI components (task players, forms, navbar, footer, shadcn-style ui/)
context/             React context providers
hooks/               Reusable React hooks
lib/                 Server-side helpers: Prisma, Supabase, Stripe, OpenAI,
                     Turnstile, AI grading prompts, getTaskForUser, etc.
models/              Domain types / models
queries/             TanStack Query hooks (useTask, useAttempt, useProgress, …)
services/            Server-side service layer used by API routes
prisma/              Prisma schema (Supabase auth + public domain tables)
supabase/            Supabase config and SQL migrations
public/              Static assets (images, audio, fonts)
```

Domain models (see `prisma/schema.prisma`):

- `task_sets` → `task_set_items` → `tasks` (exam-style sets of tasks)
- `questions` → `options` / `answers`
- `task_attempts` → `student_answers` (student progress, status: `submitted | grading | graded | failed`)
- `purchases` (Stripe-backed access)
- `ai_usage_events` (tracks OpenAI token spend per user/task)

## Getting started

### Prerequisites

- Node.js 20+
- npm (this repo ships a `package-lock.json`)
- A Supabase project (or any Postgres database reachable from your machine)
- Stripe, OpenAI, Resend and Cloudflare Turnstile accounts for the corresponding features

### Install

```bash
npm install
```

The `postinstall` script automatically runs `prisma generate`.

### Environment variables

Create a `.env.local` in the project root. The app reads the following keys (see `.env` for the canonical list):

```bash
# App
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Database (Supabase Postgres)
DATABASE_URL="postgresql://...?pgbouncer=true"
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI (AI grading)
OPENAI_API_KEY="sk-..."

# Cloudflare Turnstile (captcha)
NEXT_PUBLIC_TURNSTILE_SITE_KEY="..."
TURNSTILE_SECRET_KEY="..."

# Resend (transactional email)
RESEND_API_KEY="re_..."
```

> Never commit real secrets. `.env*` files are git‑ignored.

### Database

Apply migrations to your Supabase/Postgres instance:

```bash
npx supabase db push           # if using the Supabase CLI against this project
# or apply prisma migrations via your usual workflow
npx prisma generate
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # Production build
npm start       # Run the production server
npm run lint    # ESLint (eslint-config-next)
```

## Stripe webhooks (local)

To exercise the checkout flow locally, forward Stripe events to the local API route:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Set the printed signing secret as `STRIPE_WEBHOOK_SECRET` in your `.env.local`.

## Deployment

The app is designed to deploy to [Vercel](https://vercel.com). Configure the environment variables above in the Vercel project, point `DATABASE_URL` / `DIRECT_URL` at your production Supabase instance, and set Stripe to live keys with the corresponding webhook endpoint.

## License

Private project — all rights reserved.
