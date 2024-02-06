import { defaultFilter, getIsDeleted } from "@app/shared/database/mongo/utils/mongo.utils";
import { Model, UpdateWriteOpResult } from "mongoose";

export abstract class MongoRepository<I> {
  public constructor(private readonly model: Model<I>) {}

  public async findOne(id: string): Promise<I | null> {
    return await this.model.findOne({ $and: [{ _id: id }, defaultFilter] }).exec();
  }

  public async findMany(ids: string[]): Promise<I[]> {
    return await this.model.find({ $and: [{ _id: { $in: ids } }, defaultFilter] }).exec();
  }

  public async findAll(): Promise<I[]> {
    return await this.model.find(defaultFilter).exec();
  }

  public async create(createDto: Partial<I>): Promise<I> {
    return await this.model.create(createDto);
  }

  public async createMany(createDtos: Partial<I>[]): Promise<I[]> {
    return await this.model.create(createDtos);
  }

  public async update(id: string, updateDto: Partial<I>): Promise<number> {
    return await this.model
      .updateOne({ _id: id }, updateDto)
      .exec()
      .then((result: UpdateWriteOpResult): number => result.modifiedCount);
  }

  public async delete(id: string): Promise<number> {
    return await this.model
      .updateOne({ _id: id }, { $set: getIsDeleted(true) })
      .exec()
      .then((result: UpdateWriteOpResult): number => result.modifiedCount);
  }

  public async deleteMany(ids: string[]): Promise<number> {
    return await this.model
      .updateMany({ _id: { $in: ids } }, { $set: getIsDeleted(true) })
      .exec()
      .then((result: UpdateWriteOpResult): number => result.modifiedCount);
  }
}
