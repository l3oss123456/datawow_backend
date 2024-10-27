import {
  CreateBlogCommentDTO,
  UpdateBlogCommentDTO,
} from '@/dto/blog/blog_comment.dto';
import * as R from 'ramda';
import { BlogCommentModel } from '@/model/mongodb/blog/blog_comment.model';
import mongodb_domain from '@/utils/mongodb_domain';
import responseHandler from '@/utils/responseHandler';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class BlogCommentService {
  constructor() {}

  createBlogCommentService = async ({
    body,
  }: {
    body: CreateBlogCommentDTO;
  }) => {
    await mongodb_domain.MongodbCreate({
      model: BlogCommentModel,
      data: body,
    });

    return responseHandler.CreateSuccess();
  };

  updateBlogCommentService = async ({
    blog_comment_id,
    user_id,
    body,
  }: {
    blog_comment_id: string;
    user_id: string;
    body: UpdateBlogCommentDTO;
  }) => {
    try {
      const find_blog_comment = await mongodb_domain.MongodbFindOne({
        model: BlogCommentModel,
        filter: {
          _id: blog_comment_id,
          user_id: user_id,
        },
      });
      if (R.isNil(find_blog_comment.data)) {
        throw {
          code: 500,
          description: 'ไม่สามารถแก้ comment นี้ได้',
        };
      }

      await mongodb_domain.MongodbUpdateById({
        model: BlogCommentModel,
        _id: blog_comment_id,
        data: body,
      });

      return responseHandler.UpdateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  };
}
