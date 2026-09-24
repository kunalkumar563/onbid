import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Usage: @Roles('ADMIN', 'VERIFIER') on a controller method, paired with RolesGuard.
 * Matches Prisma's Role enum values as plain strings so this file has no
 * dependency on the generated Prisma client.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
