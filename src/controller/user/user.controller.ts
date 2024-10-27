// import { JwtAuthGuard } from '@/auth/jwt_auth.guard';
import { CreateUserDTO } from '@/dto/user/user.dto';
import { UserService } from '@/service/user/user.service';
import helper from '@/utils/helper';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
// @UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get(`/`)
  getAllUserController(
    // @Query() { sort_field, sort_order }: SortDTO,
    // @Query() { page, per_page }: PaginationDTO,
    // @Query() date_duration: DateDurationDTO,
    // @Query() filter_info: BlogFilterDTO,
    @Request() req,
  ) {
    return this.service.getAllUserService({
      //   filter_info,
      //   sort_field,
      //   sort_order,
      //   date_duration,
      //   page,
      //   per_page,
    });
  }

  @Post(`/`)
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  createUserController(
    @Body() body: CreateUserDTO,
    // @UploadedFiles()
    // files: {
    //   image?: any;
    // },
  ) {
    // return this.service.createBlogService({ body: body });

    let _body = helper.ToConvertDataTypeFormData(CreateUserDTO, body);

    return this.service.createUserService({ body: _body });
  }
}
