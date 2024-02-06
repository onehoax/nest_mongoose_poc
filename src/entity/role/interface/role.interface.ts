import { IPermission } from "@app/entity/permission/interface/permission.interface";
import { IBase } from "@app/shared/entity/interface/base.interface";

export interface IRole extends IBase {
  readonly slug: string;
  readonly name: string;
  readonly permissions: IPermission[];
}
