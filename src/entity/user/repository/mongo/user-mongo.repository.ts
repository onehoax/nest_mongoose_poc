import { IUser } from "@app/entity/user/interface/user.interface";
import { IUserRepository } from "@app/entity/user/interface/user.repository.interface";
import { User } from "@app/entity/user/repository/mongo/user-mongo.schema";
import { MongoRepository } from "@app/shared/database/mongo/repository/mongo.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateWriteOpResult } from "mongoose";

export class UserMongoRepository
  extends MongoRepository<IUser>
  implements IUserRepository
{
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }

  public async findByUsernameOrEmail(
    userName?: string,
    email?: string,
  ): Promise<IUser | null> {
    return await this.userModel
      .findOne({
        $and: [
          { $or: [{ userName: userName }, { email: email }] },
          { isDeleted: false },
        ],
      })
      .exec();
  }

  public async updateRefreshToken(id: string, token: string): Promise<number> {
    return await this.userModel
      .updateOne({ _id: id }, { $set: { refreshToken: token } })
      .exec()
      .then((result: UpdateWriteOpResult): number => result.modifiedCount);
  }

  public async updateLastLogin(id: string): Promise<number> {
    return await this.userModel
      .updateOne({ _id: id }, { $set: { lastLogin: new Date() } })
      .exec()
      .then((result: UpdateWriteOpResult): number => result.modifiedCount);
  }

  // TODO - mv to mongo repo
  public async getCount(filter: {}): Promise<number> {
    return await this.userModel.countDocuments(filter).exec();
  }
}
