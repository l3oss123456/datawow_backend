import { CreateUserDTO } from '@/dto/user/user.dto';
import { UserModel } from '@/model/mongodb/user/user.model';
import mongodb_domain from '@/utils/mongodb_domain';
import responseHandler from '@/utils/responseHandler';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getAllUserService = async ({}) => {
    const obj = await mongodb_domain.MongodbAggregate({
      model: UserModel,
      pipeline: [],
      //   sort_field: sort_field,
      //   sort_order: sort_order,
      project: { __v: 0 },
    });

    return responseHandler.Success({
      results: {
        data: obj.data,
        total: obj.total,
        page: Number(0),
        per_page: Number(0),
      },
    });
  };

  findOneUserByUsernameService = async ({ username }: { username: string }) => {
    try {
      const obj = await mongodb_domain.MongodbFindOne({
        model: UserModel,
        filter: { username: username },
      });

      return obj;
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  };

  createUserService = async ({ body }: { body: CreateUserDTO }) => {
    try {
      if (!body) {
        throw new BadRequestException({
          message: 'Request body cannot be empty',
        });
      }

      let _body = { ...body };

      //   if (R.isNil(_body.image) || R.isEmpty(_body.image)) {
      //     throw {
      //       code: 3001,
      //       description: 'Please enter product image',
      //     };
      //   }

      await mongodb_domain.MongodbCreate({
        model: UserModel,
        data: _body,
      });

      return responseHandler.CreateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  };
}
