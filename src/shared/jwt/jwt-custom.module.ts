import { UserTestModule } from "@app/entity/user-test/user-test.module";
import { BcryptModule } from "@app/shared/bcrypt/bcrypt.module";
import { JwtCustomService } from "@app/shared/jwt/service/jwt-custom.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule.register({}), UserTestModule, BcryptModule],
  providers: [JwtCustomService],
  exports: [JwtCustomService],
})
export class JwtCustomModule {}
