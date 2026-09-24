import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService, AuthTokens } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from './types/authenticated-user.type';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  /**
   * The frontend was built expecting cookie-based sessions
   * (credentials:"include", no token read from response bodies) — this
   * sets both tokens as httpOnly cookies IN ADDITION to returning them in
   * the JSON body, so a Bearer-header API consumer keeps working exactly as
   * before and the existing frontend code needs zero changes to its auth
   * handling. See jwt.strategy.ts for the read side.
   *
   * sameSite/secure are environment-aware, not a fixed guess: this
   * repo's own Phase 0 setup deploys the frontend to Vercel and the
   * backend to Railway/Render — genuinely separate domains in production —
   * while local dev proxies the frontend's /api/* calls to the backend via
   * Vite (see apps/web/vite.config.js), making them same-origin from the
   * browser's point of view. Cross-site cookies need `SameSite=None` +
   * `Secure` to be sent at all (browsers reject None without Secure); same-
   * origin local dev works fine with the more conservative `Lax` over
   * plain HTTP.
   */
  private setAuthCookies(res: Response, tokens: AuthTokens): void {
    const isProd = this.config.get<string>('env') === 'production';
    const accessTtlMs = 15 * 60 * 1000; // matches the JWT's own default access TTL
    const refreshTtlMs = this.config.get<number>('jwt.refreshTtlDays', 30) * 24 * 60 * 60 * 1000;

    res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: accessTtlMs,
    });
    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: refreshTtlMs,
      path: '/api/auth', // only sent back on auth endpoints — no reason for every route to receive it
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/api/auth' });
  }

  /** Body value wins if present (explicit API consumers); falls back to the cookie (the frontend's actual usage). */
  private resolveRefreshToken(dto: RefreshDto, req: Request): string {
    const token = dto.refreshToken ?? (req as any).cookies?.[REFRESH_TOKEN_COOKIE];
    if (!token) throw new UnauthorizedException('No refresh token provided');
    return token;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setAuthCookies(res, result.tokens);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setAuthCookies(res, result.tokens);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.resolveRefreshToken(dto, req);
    const tokens = await this.authService.refresh(token);
    this.setAuthCookies(res, tokens);
    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = dto.refreshToken ?? (req as any).cookies?.[REFRESH_TOKEN_COOKIE];
    if (token) await this.authService.logout(user.id, token);
    this.clearAuthCookies(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.resetPassword(dto.token, dto.newPassword);
    this.setAuthCookies(res, result.tokens);
    return result;
  }
}
