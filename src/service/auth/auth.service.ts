import { BadRequestException, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDTO } from '@/dto/login/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async loginService({ body }: { body: LoginDTO }) {
    try {
      let payload = { username: '', user_id: '' };
      const find_user = await this.userService.findOneUserByUsernameService({
        username: body.username,
      });

      if (R.isNil(find_user?.data) || R.isEmpty(find_user?.data)) {
        await this.userService
          .createUserService({
            body: { image: '', username: body.username },
          })
          .then(async (resp) => {
            if (resp.code === 1000) {
              const user = await this.userService.findOneUserByUsernameService({
                username: body.username,
              });
              if (!R.isNil(user.data)) {
                payload = {
                  username: user?.data?.username ?? '',
                  user_id: user?.data?._id?.toString() ?? '',
                };
              }
            }
          });
      } else {
        payload = {
          username: find_user.data.username,
          user_id: find_user.data._id.toString(),
        };
      }

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }
}
