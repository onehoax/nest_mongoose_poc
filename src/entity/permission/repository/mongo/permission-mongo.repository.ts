import { IPermission } from "@app/entity/permission/interface/permission.interface";
import { IPermissionRepository } from "@app/entity/permission/interface/permission.repository.interface";
import { Permission } from "@app/entity/permission/repository/mongo/permission-mongo.schema";
import { MongoRepository } from "@app/shared/database/mongo/repository/mongo.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class PermissionMongoRepository
  extends MongoRepository<IPermission>
  implements IPermissionRepository
{
  public constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {
    super(permissionModel);
  }

  public async findByPathAndMethod(
    path: string,
    method: string,
  ): Promise<IPermission | null> {
    return await this.permissionModel
      .findOne({
        $and: [{ path: path }, { method: method }],
      })
      .exec();
  }
}
