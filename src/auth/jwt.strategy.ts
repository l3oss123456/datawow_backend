// src/strategy/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@/service/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret_key',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneUserByUsernameService({
      username: payload.username,
    });

    // if (!user) {
    //   throw new UnauthorizedException();
    // }

    return { username: user.data.username, _id: user.data._id.toString() };
  }
}
