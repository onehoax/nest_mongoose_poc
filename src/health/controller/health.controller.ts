import { Public } from "@app/shared/decorators/public.decorator";
import { GeneralResponseDocumentation } from "@app/shared/doc/generic.doc";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

const controllerName: string = "health";

@Public()
@ApiTags(controllerName)
@Controller(controllerName)
export class HealthController {
  @Get()
  @GeneralResponseDocumentation("App Health")
  public run(): string {
    return "OK";
  }
}
