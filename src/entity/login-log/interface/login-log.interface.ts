import { IBase } from "@app/shared/entity/interface/base.interface";

export interface ILoginLog extends IBase {
  readonly userId: string;
  readonly ipAddress: string;
  readonly userAgent: string;
}
