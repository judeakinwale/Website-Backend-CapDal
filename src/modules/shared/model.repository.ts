import mongoose from "mongoose";
// -----
import type {
  Model,
  ClientSession,
  PopulateOptions,
  QueryFilter,
  QueryOptions,
} from "mongoose";

export type {
  Model,
  ClientSession,
  PopulateOptions,
  QueryFilter,
  QueryOptions,
} from "mongoose";
// -----

export type ObjectId = mongoose.Types.ObjectId;

export class ModelRepository<T> {
  private model: Model<T>;
  private session?: ClientSession;
  // TODO: implement audit logs
  // public auditService: AuditService;
  private populate: PopulateOptions | (PopulateOptions | string)[] = [];
  // private defaultOptions: QueryFilter<T>;

  public updateOptions: QueryOptions = { new: true, runValidators: true };
  public upsertOptions: QueryOptions = { ...this.updateOptions, upsert: true };
  private sessionOptions?: QueryOptions;

  constructor(
    model: Model<T>,
    // auditService: AuditService
    session?: ClientSession,
    populate?: PopulateOptions | (PopulateOptions | string)[],
    // defaultOptions: QueryOptions<T>,
  ) {
    this.model = model;
    // this.auditService = auditService
    this.session = session;
    if (session) this.sessionOptions = { session: this.session };
    if (populate) this.populate = populate;

    // this.defaultOptions = defaultOptions;
  }

  findAll = async (
    filter: QueryFilter<T>,
  ): Promise<mongoose.IfAny<T, Model<T>>[]> => {
    const items = await this.model.find(filter).populate(this.populate);
    return items;
  };

  findOne = async (filter: QueryFilter<T>) => {
    const item = await this.model.findOne(filter).populate(this.populate);
    return item;
  };

  findById = async (id: ObjectId) => {
    const item = await this.model.findById(id).populate(this.populate);
    return item;
  };

  // create = async (payload: Partial<T> | Partial<T>[]) => {
  create = async (payload: Partial<T>) => {
    // this.session?.withTransaction(async () => {
    //   const created = await this.model.create(payload, this.sessionOptions);
    //   // await auditService.create("create", this.model.toString(), this.session);
    //   return created
    // });
    const created = await this.model.create(payload);
    return created;
  };

  // ? if there are issues with pre and post hooks, rename these to quick* and
  // ? create methods for manual update / upsert (create) with .save() called
  // -----
  updateOne = async (
    filter: QueryFilter<T>,
    payload: Partial<T>,
    upsert: boolean = false, // create doc, {filter + payload}, if doc matching filter doesn't exist
  ) => {
    const options = upsert ? this.upsertOptions : this.updateOptions;
    const updated = await this.model
      .findOneAndUpdate(filter, payload, options)
      .populate(this.populate);
    return updated;
  };

  updateById = async (id: ObjectId, payload: Partial<T>) => {
    const updated = await this.model
      .findByIdAndUpdate(id, payload, this.updateOptions)
      .populate(this.populate);
    return updated;
  };
  // -----

  deleteOne = async (filter: QueryFilter<T>) => {
    const deleted = await this.model.findOneAndDelete(filter); // same as this. model.deleteOne
    return deleted;
  };

  deleteMany = async (filter?: QueryFilter<T>) => {
    const deleted = await this.model.deleteMany(filter);
    return deleted;
  };

  deleteById = async (id: ObjectId) => {
    const deleted = await this.model.findByIdAndDelete(id);
    return deleted;
  };
}
