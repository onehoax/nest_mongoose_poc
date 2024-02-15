import { IBase } from "@app/shared/entity/interface/base.interface";

export class Base implements IBase {
  public readonly id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
