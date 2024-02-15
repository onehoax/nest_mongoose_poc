import { CoreUserModel } from "@app/entity/core-user/repository/mongo/core-user-mongo.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([CoreUserModel])],
})
export class CoreUserModule {}
