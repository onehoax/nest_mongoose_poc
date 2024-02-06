import { LoginLogModule } from "@app/entity/login-log/login-log.module";
import { PermissionModule } from "@app/entity/permission/permission.module";
import { RoleModule } from "@app/entity/role/role.module";
import { UserModule } from "@app/entity/user/user.module";
import { HealthModule } from "@app/health/health.module";
import { AuthModule } from "@app/shared/auth/auth.module";
import { BcryptModule } from "@app/shared/bcrypt/bcrypt.module";
import { EnvironmentVars } from "@app/shared/enum/environment-vars.enum";
import { AccessTokenGuard } from "@app/shared/guard/access-token.guard";
import { PermissionGuard } from "@app/shared/guard/permission.guard";
import { JwtCustomModule } from "@app/shared/jwt/jwt-custom.module";
import { LoggerMiddleWare } from "@app/shared/middleware/logger.middleware";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(EnvironmentVars.MONGO_URI),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    BcryptModule,
    JwtCustomModule,
    AuthModule,
    LoginLogModule,
    PermissionModule,
    RoleModule,
    RoleModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleWare).forRoutes("*");
  }
}
