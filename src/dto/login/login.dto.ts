import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    required: true,
    description: 'username',
    default: '',
  })
  username: string;
}
