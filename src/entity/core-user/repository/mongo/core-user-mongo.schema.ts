import { UserSignupTypeEnum } from "@app/entity/core-user/enum/user-signup-type.enum";
import { UserTypeEnum } from "@app/entity/core-user/enum/user-type.enum";
import { ICoreUser } from "@app/entity/core-user/interface/core-user.interface";
import { MongoPluginEnum } from "@app/shared/database/mongo/enum/mongo-plugin.enum";
import { Base } from "@app/shared/database/mongo/schema/base-mongo.schema";
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
      delete ret._v;
      delete ret.password;
    },
  },
})
export class CoreUser extends Base implements ICoreUser {
  @Prop({ type: Types.String, required: true })
  public readonly firstName: string;

  @Prop({ type: Types.String, required: true })
  public readonly secondName: string;

  @Prop({ type: Types.String, required: true })
  public readonly lastName: string;

  @Prop({ type: Types.String, required: true })
  public readonly secondLastName: string;

  @Prop({ type: Types.String, required: true })
  public readonly password: string;

  @Prop({ type: Types.Date, required: false, default: null })
  public readonly lastLogin: Date;

  @Prop({ type: Types.Boolean, required: true, default: true })
  public readonly isVisible: boolean;

  @Prop({ type: Types.Boolean, required: true, default: false })
  public readonly isSuperuser: boolean;

  @Prop({ type: Types.Boolean, required: true, default: false })
  public readonly isStaff: boolean;

  @Prop({ type: Types.Boolean, required: true, default: true })
  public readonly isActive: boolean;

  @Prop({ type: Types.Date, required: false, default: Date.now() })
  public readonly dateJoined: Date;

  @Prop({ type: Types.String, required: true })
  public readonly email: string;

  @Prop({ type: Types.Boolean, required: true, default: false })
  public readonly isBanned: boolean;

  @Prop({ type: Types.Number, required: true, default: UserTypeEnum.PARTNER })
  public readonly userType: UserTypeEnum;

  @Prop({ type: Types.String, required: true, default: LanguageEnum.ENGLISH })
  public readonly language: LanguageEnum;

  @Prop({ type: Types.String, required: false })
  public readonly phone?: string;

  @Prop({ type: Types.Boolean, required: false })
  public readonly deactivatedAt?: Date;

  @Prop({ type: Types.Number, required: true, default: 0 })
  public readonly passwordAttempts: number;

  @Prop({ type: Types.Boolean, required: true, default: false })
  public readonly isReactivated: boolean;

  @Prop({
    type: Types.String,
    required: true,
    default: UserSignupTypeEnum.INLAZE,
  })
  public readonly signupType: UserSignupTypeEnum;

  @Prop({ type: Types.Number, required: false })
  public readonly personType?: number;

  @Prop({ type: Types.String, required: false })
  public readonly identification?: string;

  @Prop({ type: Types.Number, required: false })
  public readonly identificationType?: number;

  @Prop({ type: Types.String, required: true })
  public readonly country: string;

  @Prop({ type: Types.String, required: false })
  public readonly city?: string;

  @Prop({ type: Types.String, required: false })
  public readonly fiscalAddress?: string;

  @Prop({ type: Types.String, required: false })
  public readonly channelName?: string;

  @Prop({ type: Types.String, required: false })
  public readonly channelUrl?: string;
}

export const CoreUserSchema = SchemaFactory.createForClass(CoreUser)
  .index({ email: 1 }, { unique: true })
  .plugin(require(MongoPluginEnum.AUTO_POPULATE));

export const CoreUserModel: ModelDefinition = {
  name: CoreUser.name,
  schema: CoreUserSchema,
};
