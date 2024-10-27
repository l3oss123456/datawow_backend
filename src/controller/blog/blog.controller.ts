import {
  BlogFilterDTO,
  CreateBlogDTO,
  UpdateBlogDTO,
} from '@/dto/blog/blog.dto';
import { PaginationDTO, SortDTO } from '@/dto/global.dto';
import { BlogService } from '@/service/blog/blog.service';
import helper from '@/utils/helper';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Get(`/`)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  getAllBlogController(
    @Query() filter_info: BlogFilterDTO,
    //   @Query() date_duration: DateDurationDTO,
    @Query() { page, per_page }: PaginationDTO,
    @Query() { sort_field, sort_order }: SortDTO,
  ) {
    return this.service.getAllBlogService({
      filter_info,
      sort_field,
      sort_order,
      //   date_duration,
      page,
      per_page,
    });
  }

  @Get(`/get-by-user`)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  getAllBlogByUserController(
    @Query() filter_info: BlogFilterDTO,
    @Query() { page, per_page }: PaginationDTO,
    @Query() { sort_field, sort_order }: SortDTO,
    @Request() req,
  ) {
    return this.service.getAllBlogByUserService({
      filter_info,
      user_id: req.user._id,
      sort_field,
      sort_order,
      //   date_duration,
      page,
      per_page,
    });
  }

  @Get(`:blog_id`)
  getOneBlogController(@Param('blog_id') blog_id: string) {
    return this.service.getOneBlogService({
      blog_id: blog_id,
    });
  }

  @Post(`/`)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  createBlogController(
    @Body() body: CreateBlogDTO,
    // @UploadedFiles()
    // files: {
    //   image?: any;
    // },
    @Request() req,
  ) {
    let _body = helper.ToConvertDataTypeFormData(CreateBlogDTO, body);
    _body = { ..._body, user_id: req.user._id };
    return this.service.createBlogService({ body: _body });
  }

  @Patch(`:blog_id`)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  updateBlogController(
    @Param('blog_id') blog_id: string,
    @Body() body: UpdateBlogDTO,
    // @UploadedFiles()
    // files: {
    //   image?: any;
    // },
  ) {
    let _body = helper.ToConvertDataTypeFormData(UpdateBlogDTO, body);

    // if (!R.isNil(files) && !R.isEmpty(files)) {
    //   if (!R.isNil(files.image) && !R.isEmpty(files.image)) {
    //     _body = { ..._body, image: files.image[0] };
    //   }
    // }

    return this.service.updateBlogService({
      blog_id: blog_id,
      body: _body,
    });
  }

  @Delete(`:blog_id`)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  deleteBlogController(@Param('blog_id') blog_id: string) {
    return this.service.deleteBlogService({
      blog_id: blog_id,
    });
  }
}
