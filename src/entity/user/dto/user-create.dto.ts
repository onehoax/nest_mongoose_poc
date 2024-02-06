import { UserDto } from "@app/entity/user/dto/user.dto";
import { OmitType } from "@nestjs/swagger";

export class UserCreateDto extends OmitType(UserDto, [
  "id",
  "refreshToken",
  "lastLogin",
] as const) {}
