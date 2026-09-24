/**
 * Run once per environment (local dev, staging, prod) to produce an RS256
 * keypair for access-token signing. DO NOT commit the output — each
 * environment should have its own keys.
 *
 * Usage:
 *   npx ts-node scripts/generate-jwt-keys.ts
 *
 * This prints two env-var lines with the newlines escaped as \n, which is
 * how Railway/Render/most PaaS env-var UIs expect multi-line PEM values.
 * Paste them directly into JWT_ACCESS_PRIVATE_KEY / JWT_ACCESS_PUBLIC_KEY.
 */
import { generateKeyPairSync } from 'crypto';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
});

const escape = (pem: string) => pem.trim().replace(/\n/g, '\\n');

console.log('# Paste these into your .env (never commit real values):\n');
console.log(`JWT_ACCESS_PRIVATE_KEY="${escape(privateKey)}"\n`);
console.log(`JWT_ACCESS_PUBLIC_KEY="${escape(publicKey)}"\n`);
