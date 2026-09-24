export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

/** Payload actually encoded inside the signed access token. */
export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}
