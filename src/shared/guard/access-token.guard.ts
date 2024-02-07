import { IUser } from "@app/entity/user/interface/user.interface";
import { auth } from "@app/shared/constant/response-message.constant";
import { IS_PUBLIC_KEY } from "@app/shared/decorators/public.decorator";
import { IS_TOKEN_REFRESH_KEY } from "@app/shared/decorators/token-refresh.decorator";
import { IJwtPayload } from "@app/shared/jwt/interface/jwt-payload.interface";
import { JwtCustomService } from "@app/shared/jwt/service/jwt-custom.service";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly jwtCustomService: JwtCustomService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    const publicMessage: string = `This endpoint is ${isPublic ? "" : "not"} public`;

    Logger.debug(publicMessage);

    if (isPublic) return true;

    const isTokenRefresh: boolean = this.reflector.getAllAndOverride<boolean>(
      IS_TOKEN_REFRESH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isTokenRefresh) {
      Logger.debug("Refresh token endpoint");
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const accessToken: string | undefined = req
      .get("Authorization")
      ?.replace("Bearer", "")
      .trim();

    if (!accessToken) {
      Logger.debug(`No access token in request`);
      throw new UnauthorizedException(auth.invalidToken);
    }

    const jwtPayload: IJwtPayload =
      await this.jwtCustomService.verifyAccessToken(accessToken);

    const user: IUser = await this.jwtCustomService.validateAccessTokenPayload(
      jwtPayload,
      AccessTokenGuard.name,
    );

    req.user = user;

    return true;
  }
}
