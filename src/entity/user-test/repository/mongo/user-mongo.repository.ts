import { IUserTest } from "@app/entity/user-test/interface/user.interface";
import { IUserTestRepository } from "@app/entity/user-test/interface/user.repository.interface";
import { UserTest } from "@app/entity/user-test/repository/mongo/user-mongo.schema";
import { MongoRepository } from "@app/shared/database/mongo/repository/mongo.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateWriteOpResult } from "mongoose";

export class UserMongoRepository
  extends MongoRepository<IUserTest>
  implements IUserTestRepository
{
  public constructor(
    @InjectModel(UserTest.name) private readonly userTestModel: Model<UserTest>,
  ) {
    super(userTestModel);
  }

  public async findByUsernameOrEmail(
    userName?: string,
    email?: string,
  ): Promise<IUserTest | null> {
    return await this.userTestModel
      .findOne({
        $or: [{ userName: userName }, { email: email }],
      })
      .exec();
  }

  public async updateRefreshToken(id: string, token: string): Promise<number> {
    return await this.userTestModel
      .updateOne({ _id: id }, { $set: { refreshToken: token } })
      .exec()
      .then((result: UpdateWriteOpResult): number => result.modifiedCount);
  }

  public async updateLastLogin(id: string): Promise<number> {
    return await this.userTestModel
      .updateOne({ _id: id }, { $set: { lastLogin: new Date() } })
      .exec()
      .then((result: UpdateWriteOpResult): number => result.modifiedCount);
  }
}
