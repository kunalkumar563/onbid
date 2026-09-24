import { IsOptional, IsString } from 'class-validator';

export class RefreshDto {
  // Optional: the frontend calls logout/refresh with no body at all,
  // relying on the refreshToken cookie instead — see auth.controller.ts's
  // cookie fallback. A Bearer-token API consumer can still send it explicitly.
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
