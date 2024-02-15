import { UserTestController } from "@app/entity/user-test/controller/user.controller";
import { USER_TEST_REPOSITORY } from "@app/entity/user-test/interface/user.repository.interface";
import { UserMongoRepository } from "@app/entity/user-test/repository/mongo/user-mongo.repository";
import { UserTestModel } from "@app/entity/user-test/repository/mongo/user-mongo.schema";
import { UserTestService } from "@app/entity/user-test/service/user.service";
import { BcryptModule } from "@app/shared/bcrypt/bcrypt.module";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([UserTestModel]), BcryptModule],
  exports: [USER_TEST_REPOSITORY],
  providers: [
    UserTestService,
    { provide: USER_TEST_REPOSITORY, useClass: UserMongoRepository },
  ],
  controllers: [UserTestController],
})
export class UserTestModule {}
