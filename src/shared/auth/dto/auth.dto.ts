import { UserTestDto } from "@app/entity/user-test/dto/user-test.dto";
import { PickType } from "@nestjs/swagger";

export class AuthDto extends PickType(UserTestDto, [
  "userName",
  "password",
] as const) {}
