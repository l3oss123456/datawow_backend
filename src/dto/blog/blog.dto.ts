import { BlogTypeEnum } from '@/enum/blog/blog.enum';
import { ApiProperty } from '@nestjs/swagger';

export class BlogFilterDTO {
  @ApiProperty({
    required: false,
    default: ``,
    description: `หัวข้อ`,
  })
  title?: string;
  @ApiProperty({
    required: false,
    description: 'ประเภทของ blog',
    enum: BlogTypeEnum,
    default: 'History',
  })
  type?: string;
}

export class CreateBlogDTO {
  @ApiProperty({
    required: true,
    description: 'ประเภท',
    enum: BlogTypeEnum,
    default: 'History',
  })
  type: string;

  @ApiProperty({
    required: true,
    description: 'หัวข้อ',
    default: '',
  })
  title: string;

  @ApiProperty({
    required: true,
    description: 'รายละเอียด',
    default: '',
  })
  description: string;
}

export class UpdateBlogDTO {
  @ApiProperty({
    required: false,
    description: 'ประเภท',
    enum: BlogTypeEnum,
    default: 'History',
  })
  type: string;

  @ApiProperty({
    required: false,
    description: 'หัวข้อ',
    default: '',
  })
  title: string;

  @ApiProperty({
    required: false,
    description: 'รายละเอียด',
    default: '',
  })
  description: string;
}
