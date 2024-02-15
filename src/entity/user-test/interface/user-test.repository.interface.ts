import { IUserTestResponse } from "@app/entity/user-test/interface/user-test-response.interface";
import { IUserTest } from "@app/entity/user-test/interface/user-test.interface";

export interface IUserTestRepository {
  findOne: (id: string) => Promise<IUserTest | null>;
  findByUsernameOrEmail: (
    userName?: string,
    email?: string,
  ) => Promise<IUserTest | null>;
  findAll: () => Promise<IUserTestResponse[]>;
  create: (roleCreateDto: Partial<IUserTest>) => Promise<IUserTestResponse>;
  update: (id: string, roleUpdateDto: Partial<IUserTest>) => Promise<number>;
  updateRefreshToken: (id: string, token: string) => Promise<number>;
  updateLastLogin: (id: string) => Promise<number>;
  delete: (id: string) => Promise<number>;
}

export const USER_TEST_REPOSITORY = Symbol("USER_TEST_REPOSITORY");
