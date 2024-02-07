import { IPermission } from "@app/entity/permission/interface/permission.interface";

export interface IPermissionRepository {
  findOne: (id: string) => Promise<IPermission | null>;
  findMany: (ids: string[]) => Promise<IPermission[]>;
  findAll: () => Promise<IPermission[]>;
  findByPathAndMethod: (
    path: string,
    method: string,
  ) => Promise<IPermission | null>;
  createMany: (
    permissionCreateDtos: Partial<IPermission>[],
  ) => Promise<IPermission[]>;
  update: (
    id: string,
    permissionUpdateDto: Partial<IPermission>,
  ) => Promise<number>;
  deleteMany: (ids: string[]) => Promise<number>;
}

export const PERMISSION_REPOSITORY = Symbol("PERMISSION_REPOSITORY");
