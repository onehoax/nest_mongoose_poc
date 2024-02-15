import { IUserTestResponse } from "@app/entity/user-test/interface/user-response.interface";
import { IJwtTokens } from "@app/shared/jwt/interface/jwt-tokens.interface";

export interface IAuthResponse {
  readonly tokens: IJwtTokens;
  readonly user: IUserTestResponse;
}
