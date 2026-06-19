# StartupForge

**StartupForge** is a full-stack platform where startup founders publish ideas, build teams, and recruit collaborators. Developers, designers, marketers, and other professionals can browse opportunities and apply to join startups they believe in.

---

## Live Demo

- **Client:** [https://startupforge-client.netlify.app](https://startupforge-client.netlify.app)
- **Server:** [https://startupforge-server.onrender.com](https://startupforge-server.onrender.com)

---

## Features

### For Founders
- Create and manage a startup profile with logo, industry, funding stage, and description
- Post opportunities for roles you need to fill
- Review, accept, or reject applications from collaborators
- Free tier: up to 3 opportunities — upgrade to **Premium** via Stripe to post unlimited

### For Collaborators
- Browse all approved startups and open opportunities
- Filter by work type, industry, and search by role title or skills
- Apply with a portfolio link and motivation message
- Track application status (Pending / Accepted / Rejected) in your dashboard

### For Admins
- View platform-wide stats: users, startups, opportunities, and revenue
- Approve or remove startup listings
- Block and unblock users — blocked users are immediately signed out and cannot log back in
- View all transactions

### Platform-wide
- Credential login (email + password) and Google OAuth via **Better Auth**
- JWT stored in HTTPOnly cookies for secure API access
- Server-side pagination, `$regex` search, and `$in` filtering via MongoDB
- Stripe Checkout for premium founder upgrades
- Fully responsive design (mobile, tablet, desktop)
- Dark/light theme toggle
- Framer Motion animations on the home page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), Tailwind CSS v4, DaisyUI v5 |
| Animation | Framer Motion |
| Auth | Better Auth (credential + Google OAuth) |
| Backend | Express.js (Node.js) |
| Database | MongoDB (Atlas) |
| Payments | Stripe Checkout |
| Image Upload | ImgBB API |
| Charts | Recharts |

---

## Project Structure

```
client/                        # Next.js frontend
├── src/
│   ├── app/
│   │   ├── (auth)/            # Sign in, sign up, forgot password, post-login
│   │   ├── api/
│   │   │   ├── auth/          # Better Auth handler, issue-token, clear-token
│   │   │   └── checkout_sessions/   # Stripe session creation
│   │   ├── dashboard/
│   │   │   ├── admin/         # Admin overview, users, startups, transactions
│   │   │   ├── founder/       # Overview, my-startup, add/manage opportunities, applications
│   │   │   └── collaborator/  # Overview, my-applications, profile
│   │   ├── opportunities/     # Browse + detail pages
│   │   ├── startups/          # Browse + detail pages
│   │   ├── plans/             # Premium upgrade + payment success
│   │   └── profile/           # Public profile
│   ├── components/
│   │   ├── dashboard/         # DashboardSidebar
│   │   ├── pages/home/        # Banner, FeaturedStartUps, FeaturedOpportunities, Statistics, WhyJoin
│   │   ├── shared/            # Navbar, Footer, SiteChrome, ThemeController
│   │   └── ui/                # OpportunityCard, StartupCard, skeleton loaders
│   └── lib/
│       ├── actions/           # Server Actions (applications, opportunities, payments, startups, users)
│       ├── api/               # Client-side fetch helpers
│       ├── core/server.js     # serverFetch + internalFetch utilities
│       ├── auth.js            # Better Auth server config
│       ├── auth-client.js     # Better Auth client config
│       └── stripe.js          # Stripe instance + plan price IDs

server/
└── index.js                   # Express API (all routes, JWT middleware, MongoDB collections)
```

---

## Environment Variables

### Client (`client/.env.local`)

```env
# MongoDB (used by Better Auth for session/user storage)
MONGO_DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
AUTH_DB_NAME=StartupForge_auth

# MongoDB (used by issue-token route to check isBlocked)
MONGO_DB_NAME=StartupForge_db

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_FOUNDER_PREMIUM_PRICE_ID=price_...

# Internal API key — shared with the Express server to protect payment endpoints
INTERNAL_API_KEY=a_long_random_secret_string

# Express server URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Server (`server/.env`)

```env
PORT=5000

# MongoDB
MONGO_DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
MONGO_DB_NAME=StartupForge_db

# JWT
JWT_SECRET=your_jwt_secret_here

# CORS — set to your deployed client URL in production
CLIENT_URL=http://localhost:3000

# Internal API key — must match the client's INTERNAL_API_KEY
INTERNAL_API_KEY=a_long_random_secret_string
```

> **Never commit `.env` or `.env.local` files to version control.**

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (free tier is fine)
- A Stripe account (test mode)
- A Google Cloud project with OAuth credentials
- An ImgBB API key

### 1. Clone the repository

```bash
git clone https://github.com/IM-Tamim/StartupForge-client.git
cd StartupForge-client
```

### 2. Set up the server

```bash
cd server
npm install
# create .env and fill in the values from the table above
npm start          # or: node index.js
```

The API will be available at `http://localhost:5000`.

### 3. Set up the client

```bash
cd client
npm install
# create .env.local and fill in the values from the table above
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Deployment

### Client — Vercel (recommended)

1. Push your `client/` folder to a GitHub repo (or the root of your repo).
2. Import the project in [vercel.com](https://vercel.com).
3. Add all variables from the **Client env table** above in **Project → Settings → Environment Variables**.
4. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to your Vercel production URL.
5. Set `NEXT_PUBLIC_API_URL` to your deployed server URL.
6. Deploy. Vercel handles `next build` automatically.

> The `next.config.mjs` rewrites proxy `/api/startups/*`, `/api/opportunities/*`, etc. to the Express server. In production these rewrites target `NEXT_PUBLIC_API_URL`, so make sure that variable is set correctly.

### Server — Render / Railway / any Node host

1. Push your `server/` folder to a GitHub repo.
2. Create a new **Web Service** and point it at the repo.
3. Set build command: `npm install`, start command: `node index.js`.
4. Add all variables from the **Server env table** above.
5. Set `CLIENT_URL` to your Vercel production URL (no trailing slash).
6. Deploy.

### Google OAuth — add authorised redirect URIs

In Google Cloud Console → your OAuth client, add:

```
https://your-client-url.vercel.app/api/auth/callback/google
```

### Stripe webhook (optional but recommended for production)

If you want real-time payment confirmations, add a Stripe webhook pointing to:

```
https://your-client-url.vercel.app/api/checkout_sessions
```

---

## Common Deployment Checklist

- [ ] All environment variables set on both client and server hosts
- [ ] `CLIENT_URL` on the server matches the exact Vercel URL (no trailing slash)
- [ ] Google OAuth redirect URI updated for the production domain
- [ ] MongoDB Atlas Network Access allows connections from `0.0.0.0/0` (or your host's IP range)
- [ ] Stripe price ID matches the live/test mode you are using
- [ ] `INTERNAL_API_KEY` is identical on both client and server

---

## API Overview

All routes below are served by the Express server. Protected routes require a valid `access_token` HTTPOnly cookie.

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/stats` | Public | Platform-wide public statistics |
| GET | `/api/startups` | Public | List approved startups (search, filter, limit) |
| GET | `/api/startups/:id` | Public | Single startup detail |
| POST | `/api/startups` | Founder | Create a startup |
| PATCH | `/api/startups/:id` | Founder / Admin | Update startup |
| DELETE | `/api/startups/:id` | Founder / Admin | Delete startup |
| GET | `/api/opportunities` | Public | List opportunities (search, filter, pagination) |
| GET | `/api/opportunities/:id` | Public | Single opportunity detail |
| POST | `/api/opportunities` | Founder | Post an opportunity (premium gated after 3) |
| PATCH | `/api/opportunities/:id` | Founder / Admin | Update opportunity |
| DELETE | `/api/opportunities/:id` | Founder / Admin | Delete opportunity |
| GET | `/api/applications` | Token | Fetch applications (by applicant or founder) |
| POST | `/api/applications` | Collaborator | Submit an application |
| PATCH | `/api/applications/:id` | Founder / Admin | Update application status |
| GET | `/api/users` | Admin | List all users |
| PATCH | `/api/users/:id/block` | Admin | Block / unblock a user |
| PATCH | `/api/users/profile` | Token | Update own profile (name, image, bio, skills) |
| GET | `/api/admin/startups` | Admin | List all startups (any status) |
| PATCH | `/api/admin/startups/:id/approve` | Admin | Approve a startup |
| DELETE | `/api/admin/startups/:id` | Admin | Remove a startup |
| GET | `/api/admin/stats` | Admin | Admin dashboard statistics |
| GET | `/api/payments` | Admin | List all transactions |
| POST | `/api/payments` | Internal | Record a payment (called by Next.js after Stripe success) |
| PATCH | `/api/users/plan` | Internal | Upgrade a user's plan (called by Next.js after Stripe success) |

---

## Security Notes

- **JWT** is signed with `JWT_SECRET` and stored in an `httpOnly`, `SameSite=lax` cookie — inaccessible to JavaScript.
- **Blocked users** cannot log in (checked at JWT issuance) and are immediately signed out if they are already in a session when blocked.
- **Payment and plan-upgrade endpoints** are protected by `x-internal-key` so they cannot be called directly from a browser.
- **Role enforcement** is applied on every protected route via `verifyFounder`, `verifyCollaborator`, and `verifyAdmin` middlewares.
- **MongoDB credentials** and all secrets are stored in environment variables only — never hardcoded.

---

## License

IMT