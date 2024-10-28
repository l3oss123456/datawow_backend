import {
  CreateBlogCommentDTO,
  UpdateBlogCommentDTO,
} from '@/dto/blog/blog_comment.dto';
import { PaginationDTO, SortDTO } from '@/dto/global.dto';
import { BlogCommentService } from '@/service/blog_comment/blog_comment.service';
import * as R from 'ramda';
import helper from '@/utils/helper';
import responseHandler from '@/utils/responseHandler';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Blog-Comments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('blog-comment')
export class BlogCommentController {
  constructor(private readonly service: BlogCommentService) {}

  @Get(`:blog_id`)
  async getOneBlogCommentController(
    @Param('blog_id') blog_id: string,
    @Query() { page, per_page }: PaginationDTO,
    @Query() { sort_field, sort_order }: SortDTO,
  ) {
    const obj = await this.service.getAlllBlogCommentService({
      blog_id: blog_id,
      sort_field,
      sort_order,
      page,
      per_page,
    });

    return responseHandler.Success({
      results: {
        data: obj.data,
        total: obj.total,
        page: !R.isNil(page) ? Number(page) : null,
        per_page: !R.isNil(per_page) ? Number(per_page) : null,
      },
    });
  }

  @Post(`/`)
  //   @ApiBearerAuth()
  //   @UseGuards(AuthGuard('jwt'))
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
  //   @ApiBearerAuth()
  //   @UseGuards(AuthGuard('jwt'))
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
