import { IUserTest } from "@app/entity/user-test/interface/user.interface";

export interface IUserTestResponse
  extends Omit<IUserTest, "password" | "refreshToken"> {}
