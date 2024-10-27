import { SocketGateway } from '@/connection/socket/socket.gateway';
import { BlogController } from '@/controller/blog/blog.controller';
import { BlogService } from '@/service/blog/blog.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [BlogController],
  providers: [BlogService, SocketGateway],
})
export class BlogModule {}
