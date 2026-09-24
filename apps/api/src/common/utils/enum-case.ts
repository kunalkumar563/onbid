import { Transform } from 'class-transformer';

/**
 * The frontend was built expecting lowercase enum-ish strings everywhere
 * (status: "passed", not "PASSED"). Rather than either renaming every
 * Prisma enum (churns the whole schema/migration history) or asking the
 * frontend to change every type/string literal across dozens of files,
 * this is a boundary-only transform: uppercase on the way in (before
 * class-validator's @IsIn/@IsEnum checks run), lowercase on the way out.
 * Internal code — services, Prisma — only ever sees/produces uppercase,
 * exactly as it did before any of this.
 */

/** DTO field decorator: uppercases an incoming string before validation. Usage: @UppercaseInput() @IsIn([...]) field: string; */
export function UppercaseInput() {
  return Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value));
}

/** For a single enum-ish value going out to the frontend. */
export function toLowerCaseValue<T extends string | null | undefined>(value: T): T {
  return (value == null ? value : (value.toLowerCase() as T)) as T;
}

/** Shallow-maps a list of named keys on an object to lowercase, returning a new object. Leaves everything else (ids, free text, numbers) untouched. */
export function lowercaseKeys<T extends Record<string, unknown>>(obj: T, keys: (keyof T)[]): T {
  const copy: Record<string, unknown> = { ...obj };
  for (const key of keys) {
    const value = copy[key as string];
    if (typeof value === 'string') copy[key as string] = value.toLowerCase();
  }
  return copy as T;
}
