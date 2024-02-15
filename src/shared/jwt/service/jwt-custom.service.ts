import {
  IJwtInfo,
  IJwtPayload,
} from "@app/shared/jwt/interface/jwt-payload.interface";
import { IJwtTokens } from "@app/shared/jwt/interface/jwt-tokens.interface";
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { auth } from "@app/shared/constant/response-message.constant";
import {
  IUserTestRepository,
  USER_TEST_REPOSITORY,
} from "@app/entity/user-test/interface/user-test.repository.interface";
import { BcryptService } from "@app/shared/bcrypt/service/bcrypt.service";
import { reverseToken } from "@app/shared/jwt/jwt-custom.util";
import { IUserTest } from "@app/entity/user-test/interface/user-test.interface";
import { EnvironmentVars } from "@app/shared/enum/environment-vars.enum";

@Injectable()
export class JwtCustomService {
  public constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    @Inject(USER_TEST_REPOSITORY)
    private readonly userRepository: IUserTestRepository,
  ) {}

  private async tryTokenVerify(
    token: string,
    secret: string,
  ): Promise<IJwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, { secret: secret });
    } catch (err: unknown) {
      if (err instanceof TokenExpiredError) Logger.error("JWT has expired");
      throw new UnauthorizedException(auth.invalidToken);
    }
  }

  public async verifyAccessToken(token: string): Promise<IJwtPayload> {
    return this.tryTokenVerify(
      token,
      this.configService.get<string>(EnvironmentVars.JWT_ACCESS_SECRET),
    );
  }

  public async verifyRefreshToken(token: string): Promise<IJwtPayload> {
    return this.tryTokenVerify(
      token,
      this.configService.get<string>(EnvironmentVars.JWT_REFRESH_SECRET),
    );
  }

  public decodeToken(token: string): IJwtInfo {
    return this.jwtService.decode(token);
  }

  public async getTokens(payload: IJwtPayload): Promise<IJwtTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>(
          EnvironmentVars.JWT_ACCESS_SECRET,
        ),
        expiresIn: this.configService.get<string>(
          EnvironmentVars.JWT_ACCESS_EXPIRATION_TIME,
        ),
      }),
      this.jwtService.signAsync(
        { id: payload.id },
        {
          secret: this.configService.get<string>(
            EnvironmentVars.JWT_ACCESS_SECRET,
          ),
          expiresIn: this.configService.get<string>(
            EnvironmentVars.JWT_ACCESS_EXPIRATION_TIME,
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async getUserFromDb(
    userId: string,
    context: string,
  ): Promise<IUserTest> {
    const dbUser: IUserTest | null = await this.userRepository.findOne(userId);

    if (!dbUser) {
      Logger.error(`No user in db with id: ${userId}`);
      throw new UnauthorizedException(auth.invalidToken);
    }

    return dbUser;
  }

  public async validateAccessTokenPayload(
    jwtPayload: IJwtPayload,
    context: string,
  ): Promise<IUserTest> {
    const dbUser: IUserTest = await this.getUserFromDb(jwtPayload.id, context);

    const isValid: boolean = jwtPayload.userName === dbUser.userName;

    if (!isValid) {
      Logger.error(
        `Jwt payload.username doesn't match user with id: ${dbUser.id}`,
      );
      throw new UnauthorizedException(auth.invalidToken);
    }

    return dbUser;
  }

  public async validateRefreshTokenPayload(
    jwtPayload: IJwtPayload,
    refreshToken: string,
    context: string,
  ): Promise<IUserTest> {
    const dbUser: IUserTest = await this.getUserFromDb(jwtPayload.id, context);

    if (!dbUser.refreshToken) {
      Logger.error(`No Refresh token for user with id: ${dbUser.id}`);
      throw new UnauthorizedException(auth.invalidToken);
    }

    const isValid: boolean = await this.bcryptService.compare(
      reverseToken(refreshToken),
      dbUser.refreshToken,
    );

    if (!isValid) {
      Logger.error(
        `Refresh token in request does not match refresh token in db for user with id: ${dbUser.id}`,
      );

      throw new UnauthorizedException(auth.invalidToken);
    }

    return dbUser;
  }
}
