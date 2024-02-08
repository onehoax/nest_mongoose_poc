import { Role } from "@app/entity/role/repository/mongo/role-mongo.schema";
import { UserStatusEnum } from "@app/entity/user/enum/user-status.enum";
import { IUser } from "@app/entity/user/interface/user.interface";
import { MongoPluginEnum } from "@app/shared/database/mongo/enum/mongo-plugin.enum";
import { Base } from "@app/shared/database/mongo/schema/base-mongo.schema";
import { EntityEnum } from "@app/shared/entity/enum/entity.enum";
import { LanguageEnum } from "@app/shared/enum/language.enum";
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
      delete ret.password;
      delete ret.refreshToken;
    },
  },
})
export class User extends Base implements IUser {
  @Prop({ type: Types.String, required: true })
  public readonly fullName!: string;

  @Prop({ type: Types.String, required: true })
  public readonly userName!: string;

  @Prop({ type: Types.String, required: true })
  public readonly email!: string;

  @Prop({ type: Types.String, required: true })
  public readonly password!: string;

  @Prop({ type: Types.String, required: true, default: UserStatusEnum.ACTIVE })
  public readonly status!: string;

  @Prop({ type: Types.String, required: true, default: LanguageEnum.ENGLISH })
  public readonly language!: string;

  @Prop({
    type: Types.ObjectId,
    ref: EntityEnum.ROLE,
    autopopulate: true,
    required: true,
  })
  public readonly role!: Role;

  @Prop({ type: Types.Boolean, required: true, default: false })
  public readonly isSuperUser!: boolean;

  @Prop({ type: Types.String, required: false, default: "" })
  public readonly refreshToken?: string;

  @Prop({ type: Types.Date, required: false, default: null })
  public readonly lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User)
  .index({ email: 1 }, { unique: true })
  .plugin(require(MongoPluginEnum.AUTO_POPULATE));

export const UserModel: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
};
