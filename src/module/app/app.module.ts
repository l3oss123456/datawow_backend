import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from '@/connection/database/mongodb/mongodb.module';
import { MulterMiddleware } from '../../middleware/multer.middleware';

// import { AdminModule } from '../admin/admin.module';
// import { LotteryModule } from '../lottery/lottery.module';
import { SocketGateway } from '@/connection/socket/socket.gateway';
import { OnStartUpServerService } from '@/service/onStartUpServer/onStartUpServer.service';
// import { ProductModule } from '../product/product.module';
import { BlogModule } from '../blog/blog.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { BlogCommentModule } from '../blog_comment/blog_comment.module';
// import { PassportModule } from '@nestjs/passport';

// import { LoginModule } from '../login/login.module';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    MongodbModule,
    // AdminModule,
    // LotteryModule,
    // ProductModule,
    AuthModule,
    BlogModule,
    BlogCommentModule,
    UserModule,
    // LoginModule,
  ],
  providers: [SocketGateway, OnStartUpServerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MulterMiddleware).forRoutes('*'); // Apply to all routes
  }
}
