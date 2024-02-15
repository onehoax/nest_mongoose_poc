import { IRole } from "@app/entity/role/interface/role.interface";
import { UserTestStatusEnum } from "@app/entity/user-test/enum/user-test-status.enum";
import { IBase } from "@app/shared/entity/interface/base.interface";

export interface IUserTest extends IBase {
  readonly fullName: string;
  readonly userName: string;
  readonly email: string;
  readonly password: string;
  readonly status: UserTestStatusEnum;
  readonly language: string;
  readonly role: IRole;
  readonly isSuperUser: boolean;
  readonly refreshToken?: string;
  readonly lastLogin?: Date;
}
