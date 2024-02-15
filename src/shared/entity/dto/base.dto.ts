import { IBase } from "@app/shared/entity/interface/base.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class BaseDto implements IBase {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Id",
    type: String,
    example: "65a28ecd659e1ddcf7f6ecad",
  })
  public readonly id!: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: "Created at date",
    type: Date,
    example: "2022-01-22T23:10:08.870822",
  })
  public readonly createdAt!: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: "Updated at date",
    type: Date,
    example: "2022-01-22T23:10:08.870822",
  })
  public readonly updatedAt!: Date;
}
