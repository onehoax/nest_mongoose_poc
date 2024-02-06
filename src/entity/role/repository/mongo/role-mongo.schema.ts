import { PermissionMongo } from "@app/entity/permission/repository/mongo/permission-mongo.schema";
import { IRole } from "@app/entity/role/interface/role.interface";
import { MongoPluginEnum } from "@app/shared/database/mongo/enum/mongo-plugin.enum";
import { BaseMongo } from "@app/shared/database/mongo/schema/base-mongo.schema";
import { EntityEnum } from "@app/shared/entity/enum/entity.enum";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

const { Types } = mongoose.Schema;

@Schema({
  autoIndex: true,
  autoCreate: true,
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class RoleMongo extends BaseMongo implements IRole {
  @Prop({ type: Types.String, required: true })
  public readonly slug!: string;

  @Prop({ type: Types.String, required: true })
  public readonly name!: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: EntityEnum.PERMISSION }],
    autopopulate: true,
    required: true,
  })
  public readonly permissions!: PermissionMongo[];
}

export const RoleMongoSchema = SchemaFactory.createForClass(RoleMongo).plugin(
  require(MongoPluginEnum.AUTO_POPULATE),
);

export const RoleMongoModel: ModelDefinition = {
  name: RoleMongo.name,
  schema: RoleMongoSchema,
};
