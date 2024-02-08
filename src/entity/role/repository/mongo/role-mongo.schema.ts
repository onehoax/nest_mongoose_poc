import { Permission } from "@app/entity/permission/repository/mongo/permission-mongo.schema";
import { IRole } from "@app/entity/role/interface/role.interface";
import { MongoPluginEnum } from "@app/shared/database/mongo/enum/mongo-plugin.enum";
import { Base } from "@app/shared/database/mongo/schema/base-mongo.schema";
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
export class Role extends Base implements IRole {
  @Prop({ type: Types.String, required: true })
  public readonly slug!: string;

  @Prop({ type: Types.String, required: true })
  public readonly name!: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: EntityEnum.PERMISSION }],
    autopopulate: true,
    required: true,
  })
  public readonly permissions!: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role)
  .index({ slug: 1, name: 1 }, { unique: true })
  .plugin(require(MongoPluginEnum.AUTO_POPULATE));

export const RoleModel: ModelDefinition = {
  name: Role.name,
  schema: RoleSchema,
};
