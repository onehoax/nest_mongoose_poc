import { UserTestCreateDto } from "@app/entity/user-test/dto/user-test-create.dto";
import { UserTestUpdateDto } from "@app/entity/user-test/dto/user-test-update.dto";
import { IUserTestResponse } from "@app/entity/user-test/interface/user-test-response.interface";
import {
  IUserTestRepository,
  USER_TEST_REPOSITORY,
} from "@app/entity/user-test/interface/user-test.repository.interface";
import { BcryptService } from "@app/shared/bcrypt/service/bcrypt.service";
import { common, entity } from "@app/shared/constant/response-message.constant";
import { ResponseActionEnum } from "@app/shared/response/enum/response-action.enum";
import { ICountResponse } from "@app/shared/response/interface/count-response.interface";
import { HttpResponse } from "@app/shared/response/model/http-response.model";
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class UserTestService {
  public constructor(
    @Inject(USER_TEST_REPOSITORY)
    private readonly userRepository: IUserTestRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  public async findOne(id: string): Promise<HttpResponse<IUserTestResponse>> {
    const user: IUserTestResponse | null =
      await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException(entity.notExists);

    return new HttpResponse<IUserTestResponse>({
      data: user,
      success: true,
      message: common.success,
    });
  }

  public async findAll(): Promise<HttpResponse<IUserTestResponse[]>> {
    const users: IUserTestResponse[] = await this.userRepository.findAll();

    return new HttpResponse<IUserTestResponse[]>({
      data: users,
      success: true,
      message: common.success,
    });
  }

  public async create(
    UserTestCreateDto: UserTestCreateDto,
  ): Promise<HttpResponse<IUserTestResponse>> {
    const exists: IUserTestResponse | null =
      await this.userRepository.findByUsernameOrEmail(
        UserTestCreateDto.userName,
        UserTestCreateDto.email,
      );

    if (exists) throw new ConflictException(entity.alreadyExists);

    UserTestCreateDto.password = await this.bcryptService.hash(
      UserTestCreateDto.password,
    );

    const user: IUserTestResponse =
      await this.userRepository.create(UserTestCreateDto);

    return new HttpResponse<IUserTestResponse>({
      data: user,
      success: true,
      message: common.success,
    });
  }

  public async update(
    id: string,
    UserTestUpdateDto: UserTestUpdateDto,
  ): Promise<HttpResponse<ICountResponse>> {
    let exists: IUserTestResponse | null =
      await this.userRepository.findOne(id);

    if (!exists) throw new NotFoundException(entity.notExists);

    const newUserName: string | undefined = UserTestUpdateDto.userName;
    const newEmail: string | undefined = UserTestUpdateDto.email;
    if (newUserName || newEmail) {
      exists = await this.userRepository.findByUsernameOrEmail(
        newUserName,
        newEmail,
      );
      if (exists) throw new ConflictException(entity.alreadyExists);
    }

    const newPassword: string | undefined = UserTestUpdateDto.password;
    if (newPassword)
      UserTestUpdateDto.password = await this.bcryptService.hash(newPassword);

    const updatedCount: number = await this.userRepository.update(
      id,
      UserTestUpdateDto,
    );

    if (!updatedCount) throw new InternalServerErrorException(common.failure);

    return new HttpResponse<ICountResponse>({
      data: { records: updatedCount, action: ResponseActionEnum.UPDATED },
      success: true,
      message: common.success,
    });
  }

  public async delete(id: string): Promise<HttpResponse<ICountResponse>> {
    const exists: IUserTestResponse | null =
      await this.userRepository.findOne(id);

    if (!exists) throw new NotFoundException(entity.notExists);

    const deletedCount: number = await this.userRepository.delete(id);

    if (!deletedCount) throw new InternalServerErrorException(common.failure);

    return new HttpResponse<ICountResponse>({
      data: { records: deletedCount, action: ResponseActionEnum.DELETED },
      success: true,
      message: common.success,
    });
  }
}
