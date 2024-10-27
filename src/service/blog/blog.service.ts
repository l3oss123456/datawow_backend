import { CreateBlogDTO } from '@/dto/blog/blog.dto';
import * as R from 'ramda';
import { BlogModel } from '@/model/mongodb/blog/blog.model';
import mongodb_domain from '@/utils/mongodb_domain';
import responseHandler from '@/utils/responseHandler';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SocketGateway } from '@/connection/socket/socket.gateway';

@Injectable()
export class BlogService {
  constructor(private readonly socketGateway: SocketGateway) {}

  async getAllBlogService({
    filter_info,
    sort_field,
    sort_order,
    // date_duration,
    page = null,
    per_page = null,
  }) {
    let match_statement = {};

    if (!R.isNil(filter_info.title) && !R.isEmpty(filter_info.title)) {
      match_statement = {
        ...match_statement,
        title: { $regex: filter_info.title, $options: 'i' }, // Using case-insensitive regex
      };
    }

    if (!R.isNil(filter_info.type) && !R.isEmpty(filter_info.type)) {
      match_statement = {
        ...match_statement,
        type: filter_info.type, // Match the type's field directly
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
              $project: { _id: 1, username: 1 },
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
      {
        $addFields: {
          username: '$user.username',
        },
      },
      {
        $addFields: {
          image: { $ifNull: ['$user.image', ''] },
        },
      },
    ];
    const comment_blog_pipeline = [
      {
        $lookup: {
          from: 'blog_comments',
          let: { blog_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$$blog_id' }, '$blog_id'], // Convert $$blog_id to string
                },
              },
            },
            ...user_pipeline,
            {
              $project: { __v: 0 },
            },
          ],
          as: 'list_comment',
        },
      },
      {
        $addFields: {
          list_comment_count: { $size: '$list_comment' }, // Add this field to count list_comment
        },
      },
    ];

    const obj = await mongodb_domain.MongodbAggregate({
      model: BlogModel,
      sort_field: sort_field,
      sort_order: sort_order,
      pipeline: [
        { $match: match_statement },
        ...comment_blog_pipeline,
        ...user_pipeline,
      ],
      page: page,
      per_page: per_page,
      project: { __v: 0, user_id: 0, user: 0, list_comment: 0 },
    });

    return responseHandler.Success({
      results: {
        data: obj.data,
        total: obj.total,
        page: !R.isNil(page) ? Number(page) : null,
        per_page: !R.isNil(per_page) ? Number(per_page) : null,
      },
    });
  }

  async getAllBlogByUserService({
    filter_info,
    user_id,
    sort_field,
    sort_order,
    page = null,
    per_page = null,
  }) {
    if (R.isNil(user_id) || R.isEmpty(user_id)) {
      throw {
        code: 500,
        desciption: 'ไม่มี user นี้',
      };
    }

    let match_statement: any = { user_id: user_id };

    if (!R.isNil(filter_info.title) && !R.isEmpty(filter_info.title)) {
      match_statement = {
        ...match_statement,
        title: { $regex: filter_info.title, $options: 'i' }, // Using case-insensitive regex
      };
    }

    if (!R.isNil(filter_info.type) && !R.isEmpty(filter_info.type)) {
      match_statement = {
        ...match_statement,
        type: filter_info.type, // Match the type's field directly
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
              $project: { _id: 1, username: 1 },
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
      {
        $addFields: {
          username: '$user.username',
        },
      },
      {
        $addFields: {
          image: { $ifNull: ['$user.image', ''] },
        },
      },
    ];
    const comment_blog_pipeline = [
      {
        $lookup: {
          from: 'blog_comments',
          let: { blog_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$$blog_id' }, '$blog_id'], // Convert $$blog_id to string
                },
              },
            },
            ...user_pipeline,
            {
              $project: { __v: 0 },
            },
          ],
          as: 'list_comment',
        },
      },
      {
        $addFields: {
          list_comment_count: { $size: '$list_comment' }, // Add this field to count list_comment
        },
      },
    ];

    const obj = await mongodb_domain.MongodbAggregate({
      model: BlogModel,
      sort_field: sort_field,
      sort_order: sort_order,
      pipeline: [
        {
          // $match: { user_id: user_id },
          $match: match_statement,
        },
        ...comment_blog_pipeline,
        ...user_pipeline,
      ],
      page: page,
      per_page: per_page,
      project: {
        __v: 0,
        user_id: 0,
        user: 0,
        list_comment: 0,
      },
    });

    return responseHandler.Success({
      results: {
        data: obj.data,
        total: obj.total,
        page: !R.isNil(page) ? Number(page) : null,
        per_page: !R.isNil(per_page) ? Number(per_page) : null,
      },
    });
  }

  async getOneBlogService({ blog_id = '' }: { blog_id: string }) {
    try {
      const find_one = await mongodb_domain.MongodbFindOne({
        model: BlogModel,
        filter: {
          _id: blog_id,
        },
      });
      if (R.isNil(find_one?.data)) {
        throw {
          code: '500',
          description: 'not found blog!',
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
                $project: { _id: 1, username: 1 },
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
        {
          $addFields: {
            username: '$user.username',
          },
        },
        {
          $addFields: {
            image: { $ifNull: ['$user.image', ''] },
          },
        },
      ];
      const comment_blog_pipeline = [
        {
          $lookup: {
            from: 'blog_comments',
            let: { blog_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$$blog_id' }, '$blog_id'], // Convert $$blog_id to string
                  },
                },
              },
              ...user_pipeline,
              {
                $project: { __v: 0 },
              },
            ],
            as: 'list_comment',
          },
        },
        {
          $addFields: {
            list_comment_count: { $size: '$list_comment' }, // Add this field to count list_comment
          },
        },
      ];

      const obj = await mongodb_domain.MongodbAggregate({
        model: BlogModel,
        pipeline: [...comment_blog_pipeline, ...user_pipeline],
        project: { __v: 0, user_id: 0, user: 0, list_comment: 0 },
      });

      return responseHandler.Success({
        results: {
          data: obj.data[0],
        },
      });
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }

  async createBlogService({ body = null }: { body: CreateBlogDTO }) {
    try {
      let _body = { ...body };

      //   if (R.isNil(_body.image) || R.isEmpty(_body.image)) {
      //     throw {
      //       code: 3001,
      //       description: 'Please enter product image',
      //     };
      //   }

      await mongodb_domain.MongodbCreate({
        model: BlogModel,
        data: _body,
      });

      this.socketGateway.broadcast('isHaveNewBlog', 'true');

      return responseHandler.CreateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }

  async updateBlogService({
    blog_id = null,
    body = null,
  }: {
    blog_id: string;
    body: any;
  }) {
    try {
      console.log('blog_idblog_id', blog_id);
      console.log('bodybody', body);

      const find_data = await mongodb_domain.MongodbFindOne({
        model: BlogModel,
        filter: {
          _id: blog_id,
        },
      });
      if (R.isNil(find_data?.data)) {
        throw {
          code: '500',
          description: 'not found blog!',
        };
      }

      let _body = { ...find_data, ...body };

      await mongodb_domain.MongodbUpdateById({
        model: BlogModel,
        _id: blog_id,
        data: _body,
      });

      this.socketGateway.broadcast('isHaveNewBlog', 'true');

      return responseHandler.UpdateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }

  async deleteBlogService({ blog_id = null }: { blog_id: string }) {
    try {
      const find_data = await mongodb_domain.MongodbFindOne({
        model: BlogModel,
        filter: {
          _id: blog_id,
        },
      });
      if (R.isNil(find_data?.data)) {
        throw {
          code: '500',
          description: 'not found blog!',
        };
      }

      await mongodb_domain.MongodbDelete({
        model: BlogModel,
        filter: { _id: blog_id },
      });

      this.socketGateway.broadcast('isHaveNewBlog', 'true');

      return responseHandler.DeleteSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }
}
