import { UserSignupTypeEnum } from "@app/entity/core-user/enum/user-signup-type.enum";
import { UserTypeEnum } from "@app/entity/core-user/enum/user-type.enum";
import { IBase } from "@app/shared/entity/interface/base.interface";
import { LanguageEnum } from "@app/shared/enum/language.enum";

export interface ICoreUser extends IBase {
  readonly firstName: string;
  readonly secondName: string;
  readonly lastName: string;
  readonly secondLastName: string;
  readonly password: string;
  readonly lastLogin?: Date;
  readonly isVisible: boolean;
  readonly isSuperuser: boolean;
  readonly isStaff: boolean;
  readonly isActive: boolean;
  readonly dateJoined: Date;
  readonly email: string;
  readonly isBanned: boolean;
  readonly userType: UserTypeEnum;
  readonly language: LanguageEnum;
  readonly phone?: string;
  readonly deactivatedAt?: Date;
  readonly passwordAttempts: number;
  readonly isReactivated: boolean;
  readonly signupType: UserSignupTypeEnum;
  readonly personType?: number;
  readonly identification?: string;
  readonly identificationType?: number;
  readonly country: string;
  readonly city?: string;
  readonly fiscalAddress?: string;
  readonly channelName?: string;
  readonly channelUrl?: string;
  readonly channelType?: number;
}
