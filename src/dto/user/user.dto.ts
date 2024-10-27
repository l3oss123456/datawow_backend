import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    required: false,
    description: 'รูปภาพ user',
    default: '',
    // format: 'binary',
  })
  image: string;
  // image: Express.Multer.File;

  @ApiProperty({
    required: true,
    description: 'username',
    default: '',
  })
  username: string;
}
