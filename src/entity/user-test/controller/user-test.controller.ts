import { UserTestCreateDto } from "@app/entity/user-test/dto/user-test-create.dto";
import { UserTestUpdateDto } from "@app/entity/user-test/dto/user-test-update.dto";
import { IUserTestResponse } from "@app/entity/user-test/interface/user-test-response.interface";
import { UserTestService } from "@app/entity/user-test/service/user-test.service";
import {
  GenericCreateDocumentation,
  GenericDeleteDocumentation,
  GenericFindAllDocumentation,
  GenericFindByIdDocumentation,
  GenericUpdateDocumentation,
} from "@app/shared/doc/generic.doc";
import { EntityEnum } from "@app/shared/entity/enum/entity.enum";
import { ICountResponse } from "@app/shared/response/interface/count-response.interface";
import { HttpResponse } from "@app/shared/response/model/http-response.model";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

const controllerName: string = "user";

@ApiTags(controllerName)
@Controller(controllerName)
@ApiBearerAuth()
export class UserTestController {
  public constructor(private readonly userService: UserTestService) {}

  @Get("/:id")
  @GenericFindByIdDocumentation(EntityEnum.USER)
  public findOne(
    @Param("id") id: string,
  ): Promise<HttpResponse<IUserTestResponse>> {
    return this.userService.findOne(id);
  }

  @Get()
  @GenericFindAllDocumentation(EntityEnum.USER)
  public findAll(): Promise<HttpResponse<IUserTestResponse[]>> {
    return this.userService.findAll();
  }

  @Post()
  @GenericCreateDocumentation(EntityEnum.USER)
  @ApiBody({
    type: UserTestCreateDto,
    required: true,
  })
  public create(
    @Body() UserTestCreateDto: UserTestCreateDto,
  ): Promise<HttpResponse<IUserTestResponse>> {
    return this.userService.create(UserTestCreateDto);
  }

  @Patch("/:id")
  @GenericUpdateDocumentation(EntityEnum.USER)
  @ApiBody({
    type: UserTestUpdateDto,
    required: true,
  })
  public update(
    @Param("id") id: string,
    @Body() UserTestUpdateDto: UserTestUpdateDto,
  ): Promise<HttpResponse<ICountResponse>> {
    return this.userService.update(id, UserTestUpdateDto);
  }

  @Delete("/:id")
  @GenericDeleteDocumentation(EntityEnum.USER)
  public delete(
    @Param("id") id: string,
  ): Promise<HttpResponse<ICountResponse>> {
    return this.userService.delete(id);
  }
}
