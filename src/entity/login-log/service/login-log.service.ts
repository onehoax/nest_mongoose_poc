import { Inject, Injectable } from "@nestjs/common";
import { HttpResponse } from "@app/shared/response/model/http-response.model";
import { ILoginLog } from "@app/entity/login-log/interface/login-log.interface";
import { common } from "@app/shared/constant/response-message.constant";
import {
  ILoginLogRepository,
  LOGIN_LOG_REPOSITORY,
} from "@app/entity/login-log/interface/login-log.repository";
import DeviceDetector = require("device-detector-js");
import { LoginLogCreateDto } from "@app/entity/login-log/dto/login-log-create.dto";

@Injectable()
export class LoginLogService {
  public constructor(
    @Inject(LOGIN_LOG_REPOSITORY)
    private readonly loginLogRepository: ILoginLogRepository,
  ) {}

  public async findAll(): Promise<HttpResponse<ILoginLog[]>> {
    const loginLogs: ILoginLog[] = await this.loginLogRepository.findAll();

    return new HttpResponse<ILoginLog[]>({
      data: loginLogs,
      success: true,
      message: common.success,
    });
  }

  public async create(
    loginLogCreateDto: LoginLogCreateDto,
  ): Promise<HttpResponse<ILoginLog>> {
    const deviceDetector = new DeviceDetector();

    const loginLog: Partial<ILoginLog> = {
      userId: loginLogCreateDto.userId,
      ipAddress: loginLogCreateDto.ipAddress,
      userAgent: JSON.stringify(
        deviceDetector.parse(loginLogCreateDto.userAgent),
      ),
    };

    await this.loginLogRepository.create(loginLog);

    const savedLogin: ILoginLog =
      await this.loginLogRepository.create(loginLogCreateDto);

    return new HttpResponse<ILoginLog>({
      data: savedLogin,
      success: true,
      message: common.success,
    });
  }
}
