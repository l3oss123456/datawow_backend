import {
  CreateBlogCommentDTO,
  UpdateBlogCommentDTO,
} from '@/dto/blog/blog_comment.dto';
import * as R from 'ramda';
import { BlogCommentModel } from '@/model/mongodb/blog/blog_comment.model';
import mongodb_domain from '@/utils/mongodb_domain';
import responseHandler from '@/utils/responseHandler';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BlogModel } from '@/model/mongodb/blog/blog.model';
import { SocketGateway } from '@/connection/socket/socket.gateway';

@Injectable()
export class BlogCommentService {
  constructor(private readonly socketGateway: SocketGateway) {}

  getAlllBlogCommentService = async ({
    blog_id,
    sort_field,
    sort_order,
    page = null,
    per_page = null,
  }) => {
    try {
      const find_blog = await mongodb_domain.MongodbFindOne({
        model: BlogModel,
        filter: { _id: blog_id },
      });
      if (R.isNil(find_blog?.data)) {
        throw {
          code: 500,
          description: 'ไม่พบ blog นี้',
        };
      }
      const user_pipeline = [
        {
          $lookup: {
            from: 'users',
            let: { user_id: '$user_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$_id' }, '$$user_id'],
                  },
                },
              },
              {
                $project: { _id: 1, username: 1, image: 1 },
              },
            ],
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const obj = await mongodb_domain.MongodbAggregate({
        model: BlogCommentModel,
        pipeline: [
          {
            $match: { blog_id: blog_id },
          },
          ...user_pipeline,
        ],
        page: page,
        per_page: per_page,
        sort_field: sort_field,
        sort_order: sort_order,
        project: { __v: 0, user_id: 0 },
      });

      return obj;
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  };

  createBlogCommentService = async ({
    body,
  }: {
    body: CreateBlogCommentDTO;
  }) => {
    await mongodb_domain.MongodbCreate({
      model: BlogCommentModel,
      data: body,
    });

    this.socketGateway.broadcast('isHaveNewBlogComment', 'true');

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

      this.socketGateway.broadcast('isHaveNewBlogComment', 'true');

      return responseHandler.UpdateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  };
}
