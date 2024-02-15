import { IUserTest } from "@app/entity/user-test/interface/user-test.interface";

export interface IUserTestResponse
  extends Omit<IUserTest, "password" | "refreshToken"> {}
