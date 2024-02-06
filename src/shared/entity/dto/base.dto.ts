import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BaseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Id",
    type: String,
    example: "65a28ecd659e1ddcf7f6ecad",
  })
  public readonly id!: string;
}
