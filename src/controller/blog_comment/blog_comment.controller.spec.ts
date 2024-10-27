import { Test, TestingModule } from '@nestjs/testing';
import { BlogCommentController } from './blog_comment.controller';

describe('BlogCommentController', () => {
  let controller: BlogCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogCommentController],
    }).compile();

    controller = module.get<BlogCommentController>(BlogCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
