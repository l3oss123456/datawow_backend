import { LoginDTO } from '@/dto/login/login.dto';
import { AuthService } from '@/service/auth/auth.service';
import helper from '@/utils/helper';
import responseHandler from '@/utils/responseHandler';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post(`/login`)
  @ApiConsumes('multipart/form-data')
  //   @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  async loginController(
    @Body() body: LoginDTO,
    // @UploadedFiles()
    // files: {
    //   image?: any;
    // },
  ) {
    // return this.service.createBlogService({ body: body });

    let _body = helper.ToConvertDataTypeFormData(LoginDTO, body);
    const token = await this.service.loginService({ body: _body });

    return responseHandler.Success({
      results: {
        data: token,
      },
    });
  }
}
