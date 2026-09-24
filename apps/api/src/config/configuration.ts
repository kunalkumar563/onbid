/**
 * Central place that reads process.env once and shapes it.
 * Everything else in the app should go through ConfigService, not process.env directly —
 * keeps env access testable and makes it obvious what the app actually depends on.
 */
export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  // Off by default, everywhere. When true: KYC auto-verifies on
  // registration (no real Signzy submission exists to complete live), and
  // any Razorpay order (verification fee, entry fee, winning-bid payment)
  // auto-confirms immediately via the exact same internal path a real
  // webhook would trigger — same ledger entries, same events, same status
  // transitions, just triggered synchronously instead of by a webhook call
  // that would never arrive without real Checkout/credentials. Real
  // verification (the actual verifier queue/schedule/complete workflow)
  // and real bidding/escrow/shipping/disputes are entirely unaffected —
  // this only touches the two steps that need infrastructure a live demo
  // audience can't watch you complete anyway (submitting a real PAN/Aadhaar
  // on stage, or a real payment).
  demoMode: process.env.DEMO_MODE === 'true',

  corsOrigins: process.env.CORS_ORIGINS || '*',
  // Used to build links that go INTO emails (password reset) — the
  // frontend's own origin, not this API's.
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  jwt: {
    // RS256 per tech stack doc — asymmetric so future services can verify tokens
    // without holding a signing secret. See scripts/generate-jwt-keys.ts.
    // PEM values are stored in env with literal "\n" (PaaS env UIs can't hold
    // real newlines) so we unescape them back into real newlines here.
    accessPrivateKey: process.env.JWT_ACCESS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    accessPublicKey: process.env.JWT_ACCESS_PUBLIC_KEY?.replace(/\\n/g, '\n'),
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtlDays: parseInt(process.env.JWT_REFRESH_TTL_DAYS || '30', 10),
  },

  kyc: {
    provider: process.env.KYC_PROVIDER || 'signzy', // 'signzy' | 'idfy'
    signzy: {
      baseUrl: process.env.SIGNZY_BASE_URL || 'https://preproduction.signzy.tech',
      username: process.env.SIGNZY_USERNAME,
      apiKey: process.env.SIGNZY_API_KEY,
      callbackUrl: process.env.SIGNZY_CALLBACK_URL,
      webhookSecret: process.env.SIGNZY_WEBHOOK_SECRET,
    },
    idfy: {
      baseUrl: process.env.IDFY_BASE_URL || 'https://eve.idfy.com',
      accountId: process.env.IDFY_ACCOUNT_ID,
      apiKey: process.env.IDFY_API_KEY,
      webhookUrl: process.env.IDFY_WEBHOOK_URL,
      webhookSecret: process.env.IDFY_WEBHOOK_SECRET,
    },
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },

  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET || 'onbid-media',
    // R2's S3-compatible endpoint is per-account: https://<accountid>.r2.cloudflarestorage.com
    endpoint: process.env.R2_ENDPOINT,
    // Public/CDN base URL for reading objects back (R2 public bucket or a custom domain).
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL,
  },

  notifications: {
    fcm: {
      // Full service-account JSON, stored as a single-line env var (same
      // \n-escaping approach as the JWT keys — see scripts/generate-jwt-keys.ts).
      serviceAccountJson: process.env.FCM_SERVICE_ACCOUNT_JSON,
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      fromName: process.env.RESEND_FROM_NAME || 'Onbid',
    },
    // Auction-ending-soon reminder fires this many minutes before endTime.
    auctionEndingSoonMinutes: parseInt(process.env.AUCTION_ENDING_SOON_MINUTES || '15', 10),
    // Payment reminder fires this many hours before the 48h deadline.
    paymentReminderHoursBefore: parseInt(process.env.PAYMENT_REMINDER_HOURS_BEFORE || '12', 10),
  },
});
