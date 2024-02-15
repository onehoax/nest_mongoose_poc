import { UserTestDto } from "@app/entity/user-test/dto/user.dto";
import { OmitType } from "@nestjs/swagger";

export class UserTestCreateDto extends OmitType(UserTestDto, [
  "id",
  "createdAt",
  "updatedAt",
  "refreshToken",
  "lastLogin",
] as const) {}
