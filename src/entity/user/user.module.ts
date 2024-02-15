import { CoreUserModel } from "@app/entity/user/repository/mongo/user-mongo.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([CoreUserModel])],
})
export class UserModule {}
