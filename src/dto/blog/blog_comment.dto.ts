import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogCommentDTO {
  // @ApiProperty({
  //   required: false,
  //   description: 'รูปภาพสินค้า',
  //   default: '',
  //   // format: 'binary',
  // })
  // image: string;
  // image: Express.Multer.File;

  @ApiProperty({
    required: true,
    description: 'id blog',
    default: '',
  })
  blog_id: string;

  // @ApiProperty({
  //   required: true,
  //   description: 'id ผู้ใช้งาน',
  //   default: '',
  // })
  // user_id: string;

  @ApiProperty({
    required: true,
    description: 'ข้อความ comment',
    default: '',
  })
  comment_text: string;
}

export class UpdateBlogCommentDTO {
  @ApiProperty({
    required: true,
    description: 'ข้อความ comment',
    default: '',
  })
  comment_text: string;
}
