import { UserTestCreateDto } from "@app/entity/user-test/dto/user-create.dto";
import { PartialType } from "@nestjs/swagger";

export class UserTestUpdateDto extends PartialType(UserTestCreateDto) {}
