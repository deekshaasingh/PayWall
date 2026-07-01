<div align="center">

# 💸 PayFlow

**A full-stack digital wallet and peer-to-peer transfer platform, built from scratch.**

Auth · Wallets · Transfers · Ledger · Admin Controls · Spending Insights

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## What is PayFlow?

PayFlow is a wallet and money-transfer backend built to practice the constraints that make financial systems genuinely harder than a typical CRUD app: state that must never go negative, every change independently auditable, and access control that has to account for more than just "logged in or not."

Every user gets a wallet with a live balance. Users can top up their balance, send money to any other registered user by email, and see a full, timestamped ledger of every transaction they've been part of. An admin role can view every user and transaction platform-wide and freeze or unfreeze accounts — and that freeze takes effect immediately, even against tokens issued before the freeze happened.

On top of the core ledger sits a **Spending Insights** engine: a live 7-day rolling aggregation that compares a user's current week of transfers against the previous week, computes percent change, and surfaces their top counterparty — all computed directly from the transaction collection, no external service required.

---

## ✨ Features

| | |
|---|---|
| 🔐 **Authentication** | Signup, login, JWT (1-hour expiry), bcrypt password hashing, protected-route middleware |
| 💰 **Wallet** | Live balance per user, top-up endpoint |
| 🔁 **Transfers** | Peer-to-peer transfers by email, with balance and receiver validation |
| 📜 **Ledger** | Immutable, timestamped transaction history — sent and received, per user |
| 🛠️ **Admin panel** | View all users, view all transactions, freeze/unfreeze any account |
| 📊 **Spending Insights** | Rolling 7-day spend/receive aggregation, percent change, top counterparty |
| 🎨 **Custom frontend** | Next.js + Tailwind, its own design system (navy/cobalt/emerald, Bricolage Grotesque + Inter + IBM Plex Mono) |

---

## 🧱 Tech Stack

**Backend:** Node.js · Express.js · MongoDB Atlas · Mongoose · JWT · bcryptjs · Zod · CORS

**Frontend:** Next.js (App Router) · Tailwind CSS · React Context (auth state)

**Tooling:** Postman (manual endpoint verification) · MongoDB Atlas (managed cluster)

---

## 📁 Project Structure

```
PayFlow/
├── backend/
│   ├── server.js                  # Entry point — connects DB, starts server
│   ├── src/
│   │   ├── app.js                 # Express app, CORS, route mounting
│   │   ├── config/db.js           # MongoDB connection
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── transaction.model.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── wallet.controller.js
│   │   │   └── admin.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── admin.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── admin.routes.js
│   │   └── validators/
│   │       └── auth.validator.js
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.js                # Landing page
    │   ├── login/page.js
    │   ├── signup/page.js
    │   ├── dashboard/page.js      # Wallet, transfers, insights, history
    │   ├── lib/
    │   │   ├── api.js             # Fetch wrapper for backend calls
    │   │   └── AuthContext.js     # Auth state (token, login, logout)
    │   ├── layout.js
    │   └── globals.css
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas cluster (free tier is fine)

### 1. Clone the repo
```bash
git clone https://github.com/deekshaasingh/PayWall.git
cd PayWall
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Run it:
```bash
node server.js
```
You should see `Database Connected Successfully!` and `Server is running on port 5000!`

### 3. Set up the frontend
```bash
cd ../frontend
npm install
```

Create a `.env.local` file inside `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run it:
```bash
npm run dev
```

Visit **http://localhost:3000**.

> **Note on Atlas:** if you see a `MongooseServerSelectionError`, whitelist your current IP under Atlas → Network Access, and check your cluster hasn't auto-paused from inactivity (common on the free tier).

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/signup` | — | Create a new account |
| `POST` | `/login` | — | Authenticate, receive a JWT |
| `GET` | `/wallet` | JWT | Get current balance |
| `POST` | `/wallet/add-withdraw` | JWT | Add funds to balance |
| `POST` | `/transfer` | JWT | Send money to another user by email |
| `GET` | `/transactions` | JWT | Get personal transaction history |
| `GET` | `/insights` | JWT | Get 7-day spending insights |
| `GET` | `/admin/users` | JWT + Admin | List all users |
| `GET` | `/admin/transactions` | JWT + Admin | List all transactions |
| `PATCH` | `/admin/freeze/:id` | JWT + Admin | Toggle a user's frozen status |

**Promoting a user to admin** is intentionally not exposed as an API endpoint — it's done by manually setting `role: "admin"` on a user document in MongoDB Atlas. This removes the self-escalation attack surface entirely rather than trying to secure it.

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (cost factor 10) — never stored or logged in plaintext
- `authMiddleware` re-fetches the user from MongoDB on **every** request rather than trusting the JWT payload — so a frozen account loses access immediately, not just after its token expires
- Admin routes are gated by a separate `adminMiddleware`, keeping authentication and authorization as distinct concerns
- `/admin/users` explicitly excludes the password field from its response, even though it's already hashed

**Known limitation:** the transfer endpoint updates sender and receiver balances with two independent `.save()` calls rather than a single atomic MongoDB session transaction. In a production system, this would be wrapped in `session.startTransaction()` to eliminate a theoretical partial-failure edge case. Documented here deliberately, as a known trade-off rather than an oversight.

---

## 🗺️ Roadmap

- [ ] Admin panel frontend (backend endpoints are built and tested)
- [ ] Deployment (Render/Railway for backend, Vercel for frontend)
- [ ] Atomic transfers via MongoDB session transactions
- [ ] AI-assisted fraud/anomaly detection on transfers
- [ ] Natural-language transfer input

---

<div align="center">

Built by **Deeksha**

</div>
