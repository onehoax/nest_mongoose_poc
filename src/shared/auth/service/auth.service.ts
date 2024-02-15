import { IUserTest } from "@app/entity/user-test/interface/user.interface";
import {
  IUserTestRepository,
  USER_TEST_REPOSITORY,
} from "@app/entity/user-test/interface/user.repository.interface";
import { IAuth } from "@app/shared/auth/interface/auth.interface";
import { BcryptService } from "@app/shared/bcrypt/service/bcrypt.service";
import {
  account,
  auth,
  common,
} from "@app/shared/constant/response-message.constant";
import { HttpResponse } from "@app/shared/response/model/http-response.model";
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { IJwtTokens } from "@app/shared/jwt/interface/jwt-tokens.interface";
import { ICountResponse } from "@app/shared/response/interface/count-response.interface";
import { ResponseActionEnum } from "@app/shared/response/enum/response-action.enum";
import { JwtCustomService } from "@app/shared/jwt/service/jwt-custom.service";
import { Request } from "express";
import { reverseToken } from "@app/shared/jwt/jwt-custom.util";
import { IAuthResponse } from "@app/shared/auth/interface/auth-response.interface";
import {
  ILoginLogRepository,
  LOGIN_LOG_REPOSITORY,
} from "@app/entity/login-log/interface/login-log.repository";
import { ILoginLog } from "@app/entity/login-log/interface/login-log.interface";
import DeviceDetector = require("device-detector-js");

@Injectable()
export class AuthService {
  public constructor(
    @Inject(USER_TEST_REPOSITORY)
    private readonly userRepository: IUserTestRepository,
    @Inject(LOGIN_LOG_REPOSITORY)
    private readonly loginLogRepository: ILoginLogRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtCustomService: JwtCustomService,
  ) {}

  private async getNewTokens(
    userId: string,
    userName: string,
  ): Promise<IJwtTokens> {
    const tokens = await this.jwtCustomService.getTokens({
      id: userId,
      userName: userName,
    });
    const reversedRefreshToken: string = reverseToken(tokens.refreshToken);
    const hashedRefreshToken: string =
      await this.bcryptService.hash(reversedRefreshToken);
    await this.userRepository.updateRefreshToken(userId, hashedRefreshToken);

    Logger.debug(
      `Getting new access/refresh token pair: saving refresh token in DB`,
    );

    return tokens;
  }

  private async saveLogin(userId: string, req: Request): Promise<void> {
    const deviceDetector = new DeviceDetector();

    const userAgentHeader = req.headers["user-agent"];
    const userAgent: string = userAgentHeader
      ? JSON.stringify(deviceDetector.parse(userAgentHeader))
      : "";
    const loginLog: Partial<ILoginLog> = {
      userId,
      ipAddress: req.ip ? req.ip : "",
      userAgent: userAgent,
    };

    await this.loginLogRepository.create(loginLog);
    await this.userRepository.updateLastLogin(userId);
  }

  public async signIn(
    body: IAuth,
    req: Request,
  ): Promise<HttpResponse<IAuthResponse>> {
    const dbUser: IUserTest | null =
      await this.userRepository.findByUsernameOrEmail(body.userName);
    if (!dbUser) {
      Logger.error(`Invalid user name: ${body.userName}`);
      throw new UnauthorizedException(account.invalidUsername);
    }

    const passwordMatch: boolean = await this.bcryptService.compare(
      body.password,
      dbUser.password,
    );

    if (!passwordMatch) {
      Logger.error(`Invalid password: ${body.password}`);
      throw new UnauthorizedException(auth.invalidPassword);
    }

    const tokens: IJwtTokens = await this.getNewTokens(
      dbUser.id,
      dbUser.userName,
    );

    const userLogin: IAuthResponse = {
      tokens: tokens,
      user: dbUser,
    };

    this.saveLogin(dbUser.id, req);

    return new HttpResponse<IAuthResponse>({
      data: userLogin,
      success: true,
      message: common.success,
    });
  }

  public async refreshToken(req): Promise<HttpResponse<IAuthResponse>> {
    const dbUser: IUserTest = <IUserTest>req;

    const tokens: IJwtTokens = await this.getNewTokens(
      dbUser.id,
      dbUser.userName,
    );

    const userLogin: IAuthResponse = {
      tokens: tokens,
      user: dbUser,
    };

    return new HttpResponse<IAuthResponse>({
      data: userLogin,
      success: true,
      message: common.success,
    });
  }

  public async logOut(req): Promise<HttpResponse<ICountResponse>> {
    const dbUser: IUserTest = <IUserTest>req.user;

    const userId: string = dbUser.id;
    const updatedCount: number = await this.userRepository.updateRefreshToken(
      userId,
      "",
    );

    Logger.debug(`Logging out user with id: ${userId}`);

    return new HttpResponse<ICountResponse>({
      data: { records: updatedCount, action: ResponseActionEnum.UPDATED },
      success: true,
      message: common.success,
    });
  }
}
