import {
  CreateBlogCommentDTO,
  UpdateBlogCommentDTO,
} from '@/dto/blog/blog_comment.dto';
import { BlogCommentService } from '@/service/blog_comment/blog_comment.service';
import helper from '@/utils/helper';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Blog-Comments')
@Controller('blog-comment')
export class BlogCommentController {
  constructor(private readonly service: BlogCommentService) {}

  @Post(`/`)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  createBlogCommentController(
    @Body() body: CreateBlogCommentDTO,
    // @UploadedFiles()
    // files: {
    //   image?: any;
    // },
    @Request() req,
  ) {
    let _body = helper.ToConvertDataTypeFormData(CreateBlogCommentDTO, body);
    _body = { ..._body, user_id: req.user._id };
    return this.service.createBlogCommentService({ body: _body });
  }

  @Patch(`/:blog_comment_id`)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  updateBlogCommentController(
    @Body() body: UpdateBlogCommentDTO,
    // @UploadedFiles()
    // files: {
    //   image?: any;
    // },
    @Param('blog_comment_id') blog_comment_id: string,
    @Request() req,
  ) {
    let _body = helper.ToConvertDataTypeFormData(CreateBlogCommentDTO, body);
    _body = { ..._body, user_id: req.user._id };
    return this.service.updateBlogCommentService({
      blog_comment_id: blog_comment_id,
      user_id: req.user._id,
      body: _body,
    });
  }
}
