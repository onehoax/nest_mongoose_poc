import { ILoginLogRepository } from "@app/entity/login-log/interface/login-log.repository";
import { ILoginLog } from "@app/entity/login-log/interface/login-log.interface";
import { LoginLog } from "@app/entity/login-log/repository/mongo/login-log-mongo.schema";
import { MongoRepository } from "@app/shared/database/mongo/repository/mongo.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class LoginLogMongoRepository
  extends MongoRepository<ILoginLog>
  implements ILoginLogRepository
{
  public constructor(@InjectModel(LoginLog.name) private readonly loginLogModel: Model<LoginLog>) {
    super(loginLogModel);
  }
}
