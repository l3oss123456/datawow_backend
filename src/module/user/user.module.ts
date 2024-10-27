// import { JwtAuthGuard } from '@/auth/jwt_auth.guard';
import { UserController } from '@/controller/user/user.controller';
import { UserService } from '@/service/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
