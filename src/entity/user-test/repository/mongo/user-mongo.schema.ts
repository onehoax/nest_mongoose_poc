import { Role } from "@app/entity/role/repository/mongo/role-mongo.schema";
import { UserTestStatusEnum } from "@app/entity/user-test/enum/user-status.enum";
import { IUserTest } from "@app/entity/user-test/interface/user.interface";
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
export class UserTest extends Base implements IUserTest {
  @Prop({ type: Types.String, required: true })
  public readonly fullName!: string;

  @Prop({ type: Types.String, required: true })
  public readonly userName!: string;

  @Prop({ type: Types.String, required: true })
  public readonly email!: string;

  @Prop({ type: Types.String, required: true })
  public readonly password!: string;

  @Prop({
    type: Types.String,
    required: true,
    default: UserTestStatusEnum.ACTIVE,
  })
  public readonly status!: UserTestStatusEnum;

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

export const UserTestSchema = SchemaFactory.createForClass(UserTest)
  .index({ email: 1 }, { unique: true })
  .plugin(require(MongoPluginEnum.AUTO_POPULATE));

export const UserTestModel: ModelDefinition = {
  name: UserTest.name,
  schema: UserTestSchema,
};
