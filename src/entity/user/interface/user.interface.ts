import { IRole } from "@app/entity/role/interface/role.interface";
import { IBase } from "@app/shared/entity/interface/base.interface";

export interface IUser extends IBase {
  readonly fullName: string;
  readonly userName: string;
  readonly email: string;
  readonly password: string;
  readonly status: string;
  readonly language: string;
  readonly role: IRole;
  readonly isSuperUser: boolean;
  readonly refreshToken?: string;
  readonly lastLogin?: Date;
}
