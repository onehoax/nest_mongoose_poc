import { Model, UpdateWriteOpResult } from "mongoose";

export abstract class MongoRepository<I> {
  public constructor(private readonly model: Model<I>) {}

  public async findOne(id: string): Promise<I | null> {
    return await this.model.findOne({ _id: id }).exec();
  }

  public async findMany(ids: string[]): Promise<I[]> {
    return await this.model.find({ _id: { $in: ids } }).exec();
  }

  public async findAll(): Promise<I[]> {
    return await this.model.find().exec();
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
      .deleteOne({ _id: id })
      .exec()
      .then((result): number => result.deletedCount);
  }

  public async deleteMany(ids: string[]): Promise<number> {
    return await this.model
      .deleteMany({ _id: { $in: ids } })
      .exec()
      .then((result): number => result.deletedCount);
  }
}
