import { IUserTest } from "@app/entity/user-test/interface/user-test.interface";
import { auth } from "@app/shared/constant/response-message.constant";
import { IJwtPayload } from "@app/shared/jwt/interface/jwt-payload.interface";
import { JwtCustomService } from "@app/shared/jwt/service/jwt-custom.service";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  public constructor(private readonly jwtCustomService: JwtCustomService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const refreshToken: string | undefined = req
      .get("Authorization")
      ?.replace("Bearer", "")
      .trim();

    if (!refreshToken) {
      Logger.error(`No access token in request`);
      throw new UnauthorizedException(auth.invalidToken);
    }

    const jwtPayload: IJwtPayload =
      await this.jwtCustomService.verifyRefreshToken(refreshToken);

    const user: IUserTest =
      await this.jwtCustomService.validateRefreshTokenPayload(
        jwtPayload,
        refreshToken,
        RefreshTokenGuard.name,
      );

    req.user = user;

    return true;
  }
}
