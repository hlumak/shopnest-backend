import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL =
      configService.get<string>('SERVER_URL') + '/auth/google/callback';

    if (!clientID || !clientSecret) {
      throw new Error('Google client ID and secret must be defined');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
      passReqToCallback: true
    });
  }

  validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) {
    const { displayName, emails, photos } = profile;

    const user = {
      email: emails ? emails[0].value : null,
      name: displayName,
      picture: photos ? photos[0].value : null
    };

    done(null, user);
  }
}
