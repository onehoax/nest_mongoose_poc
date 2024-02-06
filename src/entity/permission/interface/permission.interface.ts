import { IBase } from "@app/shared/entity/interface/base.interface";

export interface IPermission extends IBase {
  readonly module: string;
  readonly path: string;
  readonly method: string;
  readonly description: string;
}
