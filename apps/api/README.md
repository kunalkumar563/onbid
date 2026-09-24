<<<<<<< HEAD
# Onbid Backend

Modular monolith (NestJS) for Onbid — a campus-first auction marketplace for secondhand goods.
Built per `Onbid_Backend_Tech_Stack.md` and `Onbid_Backend_Build_Phases.md`.

**Status: Phases 0–7 built** (infra, auth & KYC, listings & verification, real-time bidding,
escrow & payments, shipping & delivery proof, disputes & admin ops, notifications). Phases 8–9
are the only ones left before Phase 10 (explicitly out of scope) — Phase 8 needs the frontend
repo to exist, Phase 9 is hardening/launch-readiness.

---

## 1. First-time setup

```bash
npm install

# Postgres + Redis for local dev (or point DATABASE_URL/REDIS_URL at anything else)
docker compose up -d

cp .env.example .env
# Generate an RS256 keypair for JWT signing, paste the two lines it prints into .env:
npx ts-node scripts/generate-jwt-keys.ts

# Generates the Prisma client AND creates+applies the first migration
npx prisma migrate dev --name init_users_kyc

npm run start:dev
```

Then:

```bash
curl http://localhost:3000/health
# {"status":"ok","info":{"postgres":{"status":"up"},"redis":{"status":"up"}}, ...}
```

Run tests: `npm test`. Run lint: `npm run lint`.

---

## 2. What's actually verified vs. what needs your environment

This was built in a sandboxed container with restricted network egress, so a few things
could be built and type-checked but **not run end-to-end**. None of these are code bugs —
they're one-time steps that need an environment with normal internet access or real vendor
credentials, which you'll hit naturally the first time you set this up:

| Item | What was verified here | What you need to do |
|---|---|---|
| **Prisma client generation** | Schema is written and the rest of the codebase type-checks cleanly against it | `binaries.prisma.sh` (Prisma's engine-binary CDN) wasn't reachable from this sandbox. Run `npx prisma migrate dev` yourself — completely standard, no credentials needed, will just work. |
| **End-to-end boot / `/health` / register-login flow** | Full project compiles (`tsc --noEmit` clean except the not-yet-generated Prisma types); 2 of 3 test suites run and pass (10/10 tests) against mocked dependencies; the 3rd (`auth.service.spec.ts`) fails only because it imports the `User` type that doesn't exist until you generate the client | Run `npx prisma migrate dev` first, then `npm test` and `npm run start:dev` — should just work |
| **Live deploy URL for Phase 0's "done when"** | Dockerfile, `railway.json`, `render.yaml`, and CI workflow are all written | Connect the repo in Railway or Render's dashboard (needs your account) — one click after that |
| **Real Signzy/IDfy KYC verification** | Provider-agnostic interface (`KycProvider`) + a Signzy adapter implementing the auth → verify → webhook pattern their docs describe | Signzy's exact endpoint paths/payload shapes are behind an account-gated docs portal. `src/modules/kyc/providers/signzy.provider.ts` has every placeholder marked — swap in the real paths once you have sandbox credentials, and confirm their actual webhook signing scheme (a placeholder HMAC check is in place so nothing is accepted unsigned in the meantime) |
| **Razorpay (verification fee + entry fee)** | Fully built and accurate — confirmed the order-creation flow and *both* signature schemes (checkout instant-confirm and webhook) against Razorpay's current public docs via live search, not just training-data memory | Just needs real `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/`RAZORPAY_WEBHOOK_SECRET` — no placeholder endpoints here, unlike Signzy, since Razorpay's API is fully public |
| **The atomic bid compare-and-set (Phase 3's core risk)** | **Actually proven, not just reasoned about.** Redis isn't network-restricted the way Prisma's engine CDN is, so I installed Redis in this sandbox and ran `test/bid-lock.e2e-spec.ts` for real against the exact shipped Lua scripts: 50 truly-concurrent bids (zero `await` between firing them) resolve with no lost updates and Redis's final state matching the highest accepted bid exactly, rollback correctly restores prior state without ever clobbering a legitimately newer bid, and the below-₹2,500 placeholder increment is enforced as coded. All 4 tests pass — see them run yourself with `docker compose up -d && npx jest --config ./test/jest-e2e.json bid-lock` | Nothing — this one's genuinely done. It'll keep running in your CI on every future change to the Lua script. |
| **Commission/payout math (Phase 4's core risk)** | Extracted into a pure function (`escrow-math.ts`) the same way the bid increment tiers were, specifically so it could be genuinely unit-tested rather than only typechecked — `escrow-math.spec.ts`, 4/4 passing, actually run in this sandbox | Nothing to add here either — the arithmetic is proven. What's *not* provable without your Razorpay account is the end-to-end Route flow feeding real fee/tax numbers into it (see below) |
| **RazorpayX Route (linked accounts, held transfers, release)** | The overall mechanism — Linked Account → held Transfer → release by flipping `on_hold` — is confirmed against Razorpay's own Route documentation via live search, not assumed. Core REST paths match what those docs show | Two real gaps, flagged in code: (1) Route needs to be enabled on your account specifically, separate from vanilla Payments; (2) I have NOT independently confirmed the complete field schema for creating a Linked Account + Stakeholder (KYC-adjacent fields vary by business type) — `RazorpayService.createLinkedAccount`'s header comment marks this explicitly. Test against Razorpay's sandbox before relying on it. |
| **Notification templates** | Every one of the PRD's 9 event types has a working template, unit-tested — `notification-templates.spec.ts`, 10/10 passing, including a test that fails loudly if a new `NotificationType` is ever added without a matching template | FCM push and SendGrid email delivery themselves need real credentials to actually send — both fail gracefully (logged, not thrown) when unconfigured, so the rest of the app keeps working without them in dev |

Everything else — module structure, auth, refresh rotation, RBAC scaffolding, health checks,
CI, Docker — was built and checked in this sandbox as far as the environment allowed.

---

## 3. Assumptions I made (flagging per your instructions, not silently deciding)

- **Roles are an array, not a single value.** The PRD/tech stack mention "buyer, seller,
  verifier, admin" as role flags, but buying and selling aren't mutually exclusive — every
  account can do both. So `User.roles` is `Role[]`, defaulting to `[BUYER, SELLER]` at
  registration; `VERIFIER`/`ADMIN` get added on top of that later (not built yet — that's an
  admin-side action from a later phase).
- **Google OAuth is deferred.** The PRD marks it "optional" and it's not in Phase 1's
  "done when" bullet list, so I didn't build it. `User.passwordHash` is nullable and there's
  an `authProvider` enum already in the schema, so adding it later doesn't require a
  migration that touches existing rows.
- **KYC requires both PAN and Aadhaar to pass**, not either/or, per PRD §4.1 ("mandatory for
  every account"). `User.kycStatus` only flips to `VERIFIED` once both have an individual
  `VERIFIED` record; it flips to `REJECTED` the moment either one fails.
- **Signzy was picked as the default provider** over IDfy (the PRD names both without
  deciding). It's a one-line env var (`KYC_PROVIDER=idfy`) to switch once `IdfyProvider` is
  implemented — right now it's a stub that throws a clear error if selected.
- **Refresh tokens live only in Redis**, never in Postgres, per tech stack §4. They're opaque
  random tokens (not JWTs) — only a SHA-256 hash is stored, and rotation invalidates the old
  token in the same operation that issues the new one.
- **KYC webhook is HMAC-signature-gated** using a shared secret (`SIGNZY_WEBHOOK_SECRET`).
  This endpoint can flip someone's KYC status, which gates real money movement (bidding,
  selling) downstream — it fails closed (rejects) if the secret isn't configured, rather than
  silently trusting an unsigned request.
- **⚠️ The bid increment below ₹2,500 is a placeholder needing product confirmation, not just
  an engineering assumption.** The PRD's increment table starts at ₹2,500, but Stationery
  (₹300 floor) and Fashion Accessories (₹500 floor) can run well below that with no defined
  tier. I used a flat ₹50, isolated in exactly one place (`BELOW_2500_INCREMENT` in
  `auctions.constants.ts` — the *same* number also appears inline in the Lua script, since Lua
  can't import a TypeScript constant; both are commented pointing at each other). Confirm the
  real number before real auctions in those categories go live.
- **A "listing" and an "auction" are the same database row** (`Auction` model), not two
  separate tables — confirmed by the PRD's own data model, where `verification_requests`
  references `auctions(id)` directly. `AuctionStatus` tracks which lifecycle stage a row is in.
- **Sellers can't bid on their own listing.** Not stated in the PRD, but standard
  auction-integrity practice (preventing shill bidding) — cheap to add, and a real gap if
  skipped. Enforced in `BiddingService`, so it applies regardless of whether a bid comes in via
  REST or WebSocket.
- **Bids can arrive via REST *or* WebSocket, both hitting the same `BiddingService.placeBid`.**
  The PRD documents `POST /api/auctions/:id/bids` as REST; the tech stack doc describes bids
  arriving "over the socket." Rather than picking one and contradicting the other doc, both are
  real entry points into one shared, non-duplicated decision path — the WebSocket path is what
  actually gets broadcast to other live bidders in real time either way.
- **A seller can resubmit for verification after a rejection.** Not spelled out in the PRD's
  verification flow description, but implied by its own data model: `auctions` and
  `verification_requests` reference each other bidirectionally, which only makes sense if an
  auction can accumulate more than one verification attempt over time.
- **Verification checklist item wording is illustrative**, not a verbatim reproduction of any
  exact ops/training document — I was confident about the PRD's *structural* facts (category
  minimums, bid tiers, lifecycle states, since I re-read those sections directly) but not
  confident enough in my recall of exact checklist copy to present placeholder wording as
  certain. The checklist is a flexible, category-keyed structure either way — adjust the text
  in `verification-checklists.ts` freely without touching any logic.
- **Cross-module coordination uses domain events (`@nestjs/event-emitter`), not direct
  imports**, wherever two modules would otherwise need to import each other (payments needs to
  notify verification once a fee is paid; verification/bidding both need to call *into*
  payments to create an order first). This avoids circular-import workarounds and keeps the
  module boundaries in the tech stack doc genuinely enforced rather than papered over.

## Phase 4/5 — money-movement decisions (read this section before touching real funds)

The system prompt for this build is explicit that anything involving escrow release, refunds,
or commission calculation should be surfaced rather than guessed at. Here's exactly where each
one landed, and why:

- **Commission is a flat 7%** and **the payment window is 48 hours** — both stated explicitly
  in the build-phases/PRD docs, not inferred.
- **The 3-day auto-release window** comes from the build-phases doc's own example ("e.g. 3
  days post-delivery-confirmation") — treated as the real default, not a placeholder.
- **⚠️ The gateway fee is never assumed as a percentage.** Razorpay's actual fee varies by
  payment method and by your specific negotiated rate — there's no generic number to look up.
  Razorpay's own Route documentation explicitly says to compute payouts from the *real* `fee`/
  `tax` fields they report on each captured payment, not an estimated rate. That's what this
  does (`RazorpayService.fetchPaymentFees`, fed into `computePayout`) — this is the
  documented-correct approach, not a workaround for missing information.
- **⚠️ Entry-fee refund rule during the non-payment cascade — flagged for your separate
  confirmation, per your explicit answer when I asked.** If a winning bidder doesn't pay
  within 48h, the item cascades to the next-highest bidder (PRD §4.5). An individual bidder
  who loses their turn in that cascade is **not** refunded their entry fee — they simply had
  their window and it passed. If the cascade **fully exhausts** every bidder with nobody ever
  paying, that's treated as equivalent to the PRD's explicit "auction cancelled after going
  live" clause, and every entry-fee-paying bidder on that auction **is** refunded. You said to
  proceed with my best default here rather than pin down the exact rule now — this is that
  default, isolated in `EscrowService.handlePaymentDeadline`/`refundAllEntryFees` — revisit
  before it matters for real money.
- **Bank details never touch our database.** `POST /api/payments/payout-account` passes a
  seller's bank account number/IFSC straight to Razorpay and stores only the returned
  `razorpayLinkedAccountId` — same principle as KYC (store the provider's reference, never the
  underlying sensitive data).
- **The escrow ledger (`EscrowLedgerEntry`) is append-only by convention, enforced through code
  organization**: `EscrowService.appendLedger` is the only method in the codebase that touches
  that table, and it only ever calls `.create()`. There's no database-level trigger preventing
  an update/delete — Postgres doesn't stop you from doing something the application layer
  doesn't do — so if this codebase grows and someone adds a second write path to that table
  later, that's the one convention worth protecting deliberately (e.g., a migration-time
  `REVOKE UPDATE, DELETE` grant would make it structurally enforced, not just convention —
  worth doing before this handles real transaction volume).
- **A seller with no Razorpay linked account yet doesn't block the buyer's payment.** The
  payment captures and the transaction moves to PAID regardless; the payout transfer is
  attempted at that point and, if it can't be created (seller hasn't onboarded), deferred to
  release time — where, if it's *still* missing, the transaction is marked `WITHHELD` rather
  than silently stuck. This needs an operational answer (who checks for `WITHHELD`
  transactions and follows up?) that's outside this backend's scope but worth having a plan
  for before launch.
- **Release requires `DELIVERED` first, always** — the PRD's phrasing ("released once the
  buyer confirms delivery, **or** automatically after a fixed window **following** delivery
  confirmation") reads as delivery confirmation being a prerequisite for *either* release path,
  not an alternative to it. There's no path in this build where funds release without a
  delivery confirmation on file.
- **Shipping proof photo counts (1–10)** aren't specified in the PRD the way listing/
  verification photo counts are — this is a low-stakes inferred default matching the pattern
  used elsewhere, not a documented requirement.

## Phase 6/7 — more money-movement decisions, and what got wired up automatically

- **⚠️ Who bears the cost of a dispute refund — flagged for your separate confirmation, per
  your explicit answer when I asked.** The PRD's own `disputes` table has no column for a
  refund amount, and none of the three docs say who pays when a buyer gets money back. The
  *amount* is always an admin's per-case judgment call (the PRD frames dispute resolution as
  comparing photos and deciding — that's inherently human discretion, not a formula, so
  `ResolveDisputeDto.refundAmount` just captures whatever the admin decides). But **where that
  money comes from** was genuinely unanswered, so I asked, and you said to proceed with my best
  default: **the seller's payout absorbs the full cost of any refund; the platform's 7%
  commission is never itself refunded, regardless of dispute outcome.** This is the most common
  real-world marketplace pattern, but it's also the option most favorable to the platform —
  said plainly so it doesn't read as a neutral engineering default. Implemented in
  `EscrowService.refundFull`/`refundPartialAndRelease`. Revisit before it matters for real
  money.
- **Disputes can only be raised once delivery is confirmed** (`Transaction.status ===
  'DELIVERED'`), matching the PRD's literal "post-delivery dispute" framing, and **release is
  blocked outright while a dispute is open or under review** — this is how the tech stack
  doc's `dispute_window` state (mentioned in its escrow state-machine sketch, which I hadn't
  originally built as a literal status) actually gets enforced: not as a separate formal
  status, but as a live check inside `EscrowService.release()`. Resolving the dispute is what
  re-triggers release — there's no separate retry loop.
- **A partial refund can't literally edit an existing Razorpay transfer amount** — Razorpay
  doesn't support that. The original held transfer is reversed and a new one is created for
  the reduced amount, then released immediately (the whole point of resolving the dispute is
  that the seller was waiting on this — no reason to make them wait for another auto-release
  cycle on top of it).
- **Wiring notifications into 6 already-built modules was this phase's real work, not scope
  creep.** Several PRD event types (verifier assigned, verification passed/failed, outbid,
  auction ending soon, payment reminder, delivery confirmation needed) had no corresponding
  domain event anywhere in the codebase before this phase, because nothing needed one yet.
  Adding the `events.emit(...)` calls into `AuctionsService`, `VerificationService`,
  `ShippingService`, and `BiddingService` — and extending `BidAcceptedEvent`/`AuctionEndedEvent`
  with the extra fields notifications needed (a listing title, the previous bidder's actual
  amount) — is exactly what a notifications phase is supposed to require, not a sign of
  something built wrong earlier.
- **"Auction ending soon" and "payment reminder" both use a fresh-lookup-at-fire-time design**,
  not pre-rendered content captured when the reminder was scheduled (which could be hours or
  days earlier, by which point a listing's current bid has likely moved). Both are skipped
  entirely if the underlying thing they'd remind about has already resolved by the time they
  fire (auction no longer ACTIVE; transaction no longer AWAITING_PAYMENT).
- **"Ending soon" notifies every distinct bidder on the auction**, not just the current
  highest — there's no watchlist feature in any phase of this build, so "everyone who's
  actually participated" is the most reasonable available audience.
- **Admin endpoints beyond disputes** (`GET /api/admin/verifiers`, `GET
  /api/admin/verification-requests`) aren't in the PRD's enumerated API list, but PRD §4.9
  explicitly describes an admin dashboard needing verifier workload/pass-rate/turnaround stats
  and a filterable cross-verifier queue view — these exist to give Retool something to actually
  bind to for that section, computed live from the underlying data rather than a maintained
  running counter that could drift.

---

## 4. Project layout

```
src/
  main.ts                 bootstrap: CORS, global ValidationPipe, raw-body capture for webhooks
  app.module.ts            root module — wires everything below
  config/                  typed env config (ConfigService, not raw process.env, everywhere else)
  database/                PrismaService + shared Redis client, both @Global
  health/                  GET /health — checks Postgres + Redis, not just process liveness
  common/
    decorators/            @Roles(), @CurrentUser()
    guards/                RolesGuard (JwtAuthGuard lives in modules/auth — see below)
    adapters/              RedisIoAdapter — Socket.io + Redis adapter for cross-instance broadcast
  storage/                 R2Service — presigned upload URLs (@Global, like Prisma/Redis)
  modules/
    auth/                  register/login/refresh/logout/me, RS256 JWT, Redis refresh rotation
    kyc/                   provider-agnostic KYC (Signzy adapter + IDfy stub), webhook handling,
                           KycVerifiedGuard (also re-checked inside BiddingService for the
                           WebSocket path, which skips the HTTP guard pipeline entirely)
    payments/              Razorpay order creation + verification/entry/transaction-payment
                           mechanics + seller payout-account onboarding. Never owns the
                           Transaction entity itself — see escrow/ below.
    listings/              CRUD, category min-price rules, kicks off verification-fee payment
    verification/          verifier profiles, atomic claim-and-schedule, checklist validation,
                           listens for the payment-confirmed event to create the actual request
    auctions/               bid increment tiers + anti-snipe (auctions.constants.ts — actually
                           unit-tested, 11/11 passing), lifecycle transitions, BullMQ
                           activate/close jobs (jobs/auction-lifecycle.processor.ts)
    bidding/                the Lua compare-and-set (scripts/*.lua) + BidLockService,
                           BidStreamService (Redis Stream for reconnect replay),
                           BiddingGateway (Socket.io) and BiddingController (REST) both
                           calling the same BiddingService.placeBid
    escrow/                Transaction entity + state machine, the append-only ledger
                           (escrow-math.ts — also unit-tested, 4/4 passing), the 48h
                           non-payment cascade, delivery/release, BullMQ jobs
                           (jobs/escrow-lifecycle.processor.ts)
    shipping/               predispatch photos, delivery confirmation (which calls
                           EscrowService.markDelivered), proof retrieval
    disputes/               dispute lifecycle (buyer or seller can raise, admin resolves),
                           delegates all actual refund/release execution to EscrowService
    admin/                  cross-verifier reporting for Retool — workload, pass rate,
                           turnaround, computed live from VerificationRequest data
    notifications/          event catalog (9 types, notifications.constants.ts), pure
                           template functions (unit-tested, 10/10 passing), FCM push +
                           SendGrid email, all fed by listeners/notification.listeners.ts
                           which is the ONE place mapping domain events from every other
                           module into an actual notification — nothing else imports
                           this module or knows it exists
prisma/
  schema.prisma            User, KycVerification, Auction, Verifier, VerificationRequest,
                           VerificationFeePayment, Bid, AuctionEntryPayment, Transaction,
                           EscrowLedgerEntry, DeliveryProof, Dispute
scripts/
  generate-jwt-keys.ts     one-time RS256 keypair generator for JWT_ACCESS_*_KEY
test/
  app.e2e-spec.ts          health check + register→me, needs real Postgres+Redis
  bid-lock.e2e-spec.ts     proves the Lua atomicity for real — see table above
```

## 5. API surface built so far

```
GET  /health                  → { status, info: { postgres, redis } }

POST /api/auth/register       → { user, tokens: { accessToken, refreshToken } }
POST /api/auth/login          → same shape
POST /api/auth/refresh        → { accessToken, refreshToken }  (rotates the refresh token)
POST /api/auth/logout         → 204, requires Bearer token      (revokes the given refresh token)
GET  /api/auth/me             → current user profile, requires Bearer token

POST /api/kyc/verify          → initiates PAN or Aadhaar check, requires Bearer token
GET  /api/kyc/status          → overall + per-document status, requires Bearer token
POST /api/kyc/webhook         → public; provider calls this back, HMAC-signature gated

POST /api/payments/payout-account → seller submits bank details once, before any payout can happen
POST /api/payments/confirm    → client-side instant payment confirm (Checkout signature)
POST /api/payments/webhook    → public; Razorpay's authoritative confirm path

POST /api/storage/presign-upload → { purpose, contentType } → presigned R2 PUT URL + key

POST /api/listings                     → create a draft listing, requires KYC verified
GET  /api/listings                     → browse ACTIVE listings, ?category, ?page, ?pageSize
GET  /api/listings/mine                → seller's own listings, any status
GET  /api/listings/:id                 → single listing
PATCH /api/listings/:id                → edit — only while DRAFT or REJECTED
POST /api/listings/:id/request-verification → starts the ₹49 fee payment

POST /api/verifiers                    → admin-only, creates a verifier profile
GET  /api/verifiers/me/queue           → a verifier's claimable + assigned requests
PUT  /api/verifiers/requests/:id/schedule → atomic claim-and-schedule
PUT  /api/verifiers/requests/:id/complete → checklist + photos + verdict

POST /api/auctions/:id/entry-payment   → starts the ₹49 one-time entry-fee payment
POST /api/auctions/:id/bids            → place a bid (REST path)
GET  /api/auctions/:id/bids            → bid history, anonymized bidder tags

GET  /api/transactions/:id             → view a transaction you're a party to
POST /api/transactions/:id/pay         → buyer: creates the Razorpay order for the winning bid
PUT  /api/transactions/:id/release     → admin-only: manual escrow release (Phase 4's "done when")
POST /api/transactions/:id/predispatch-photos   → seller: photos + courier + tracking number
POST /api/transactions/:id/delivery-confirmation → buyer: receipt photos — starts the 3-day auto-release
GET  /api/transactions/:id/proof       → both sides' photo sets

POST /api/disputes                     → buyer or seller raises a dispute (transaction must be DELIVERED)
GET  /api/admin/disputes               → admin queue, ?status=OPEN|UNDER_REVIEW|RESOLVED
GET  /api/admin/disputes/:id           → one screen: dispute + both photo sets + verification checklist
PUT  /api/admin/disputes/:id/resolve   → { resolution, refundAmount? } — executes the actual refund/release

GET  /api/admin/verifiers              → workload, pass rate, turnaround per verifier
GET  /api/admin/verification-requests  → cross-verifier queue, ?status/?category/?location

POST /api/notifications/push-token     → register a device for push
DELETE /api/notifications/push-token   → unregister a device

WebSocket (namespace /bidding, JWT via `auth: { token }` on connect):
  emit "joinAuction" { auctionId, lastEventId? } → replays missed events, then joins the room
  emit "leaveAuction" { auctionId }
  emit "placeBid" { auctionId, amount } → ack callback with the same shape as POST /bids
  listen "bidPlaced" — broadcast to everyone in the room on any accepted bid
  listen "auctionEnded" — broadcast once the auto-close job fires
```

## 6. Next step

Phase 8 (frontend integration) can't meaningfully start until the frontend repo exists, per the
build-phases doc's own sequencing note — so the natural next step once that's ready is handing
this codebase back for that alignment work. In the meantime, Phase 9 (hardening: load testing,
security review, backup/restore, observability) doesn't depend on the frontend either, if
that's a better use of the gap.
=======

>>>>>>> e1702ba8804bb8d5535b88babe3f9de2f792ddba
