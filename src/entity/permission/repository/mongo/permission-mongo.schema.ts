import { IPermission } from "@app/entity/permission/interface/permission.interface";
import { BaseMongo } from "@app/shared/database/mongo/schema/base-mongo.schema";
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
export class PermissionMongo extends BaseMongo implements IPermission {
  @Prop({ type: Types.String, required: true })
  public readonly module!: string;

  @Prop({ type: Types.String, required: true })
  public readonly path!: string;

  @Prop({ type: Types.String, required: true })
  public readonly method!: string;

  @Prop({ type: Types.String, required: true })
  public readonly description!: string;
}

export const PermissionMongoSchema =
  SchemaFactory.createForClass(PermissionMongo);

export const PermissionMongoModel: ModelDefinition = {
  name: PermissionMongo.name,
  schema: PermissionMongoSchema,
};
