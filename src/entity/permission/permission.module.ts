import { PermissionController } from "@app/entity/permission/controller/permission.controller";
import { PERMISSION_REPOSITORY } from "@app/entity/permission/interface/permission.repository.interface";
import { PermissionMongoRepository } from "@app/entity/permission/repository/mongo/permission-mongo.repository";
import { PermissionMongoModel } from "@app/entity/permission/repository/mongo/permission-mongo.schema";
import { PermissionService } from "@app/entity/permission/service/permission.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([PermissionMongoModel])],
  exports: [PERMISSION_REPOSITORY],
  providers: [
    PermissionService,
    { provide: PERMISSION_REPOSITORY, useClass: PermissionMongoRepository },
  ],
  controllers: [PermissionController],
})
export class PermissionModule {}
