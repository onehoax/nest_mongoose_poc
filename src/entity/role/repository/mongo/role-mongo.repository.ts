import { IRole } from "@app/entity/role/interface/role.interface";
import { IRoleRepository } from "@app/entity/role/interface/role.repository.interface";
import { Role } from "@app/entity/role/repository/mongo/role-mongo.schema";
import { MongoRepository } from "@app/shared/database/mongo/repository/mongo.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class RoleMongoRepository
  extends MongoRepository<IRole>
  implements IRoleRepository
{
  public constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {
    super(roleModel);
  }

  public async findByName(name: string): Promise<IRole | null> {
    return await this.roleModel.findOne({ name: name }).exec();
  }
}
