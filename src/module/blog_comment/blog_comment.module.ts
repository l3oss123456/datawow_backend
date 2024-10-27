import { SocketGateway } from '@/connection/socket/socket.gateway';
import { BlogCommentController } from '@/controller/blog_comment/blog_comment.controller';
import { BlogCommentService } from '@/service/blog_comment/blog_comment.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [BlogCommentController],
  providers: [BlogCommentService, SocketGateway],
})
export class BlogCommentModule {}
