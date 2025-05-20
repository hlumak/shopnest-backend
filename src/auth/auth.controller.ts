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
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RequestWithCookies } from './request-with-cookies.interface';
import { FastifyReply, FastifyRequest } from 'fastify';
import { GoogleUserInfo, OAuthUserData } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const { refreshToken, ...response } = await this.authService.login(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token failed');
    }
    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookies
    );

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: FastifyReply) {
    this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }

  @Get('google/callback')
  async googleAuthCallback(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const fastifyInstance = req.server;

    const tokenResponse =
      await fastifyInstance.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        req
      );

    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.token.access_token}`
        }
      }
    );

    const userInfo = (await userInfoResponse.json()) as GoogleUserInfo;

    const userData: OAuthUserData = {
      user: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture
      }
    };

    const { refreshToken, ...response } =
      await this.authService.validateOAuthLogin(userData);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return res
      .status(302)
      .redirect(
        `${process.env.CLIENT_URL}/oauth-success?accessToken=${response.accessToken}`
      );
  }
}
