import mongoose from "mongoose";
// -----
import type {
  Model,
  ClientSession,
  PopulateOptions,
  // ObjectId, // is same as mongoose.schema.types.ObjectId and != mongoose.types.ObjectId
  QueryFilter,
  QueryOptions,
  UpdateQuery,
  HydratedDocument,
} from "mongoose";

export type {
  Model,
  ClientSession,
  PopulateOptions,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
  HydratedDocument,
} from "mongoose";
// -----

export type ObjectId = mongoose.Types.ObjectId;
// -----
// export type BaseDocInstance<T> = mongoose.IfAny<
//   T,
//   any,
//   mongoose.Document<unknown, {}, T, {}, mongoose.DefaultSchemaOptions> &
//     mongoose.Require_id<T> & {
//       __v: number;
//     } & mongoose.AddDefaultId<T, {}, mongoose.DefaultSchemaOptions>
// >;
// export type DocInstance<T, K = null> = BaseDocInstance<T> | K;
// export type DocArrayInstance<T> = mongoose.IfAny<
//   T,
//   mongoose.Model<
//     T,
//     {},
//     {},
//     {},
//     BaseDocInstance<T>,
//     any,
//     mongoose.Require_id<T> extends {
//       __v?: infer U;
//     }
//       ? {
//           __v?: U;
//         } & mongoose.Require_id<T>
//       : mongoose.Require_id<T> & {
//           __v: number;
//         }
//   >,
//   T
// >[];
// -----

export type BaseDocInstance<T> = HydratedDocument<T>;
export type DocInstance<T, K = never> = BaseDocInstance<T> | K;
export type DocArrayInstance<T> = BaseDocInstance<T>[];
// export type DocResponse<T> = Promise<DocInstance<T>>;
// export type DocArrayResponse<T> = Promise<DocArrayInstance<T>>;

export class ModelRepository<T> {
  private model: Model<T>;
  private session?: ClientSession;
  // TODO: implement audit logs as part of a single transaction
  // public auditService: AuditService;
  private populate: PopulateOptions | (PopulateOptions | string)[] = [];

  public updateOptions: QueryOptions = { new: true, runValidators: true };
  public upsertOptions: QueryOptions = { ...this.updateOptions, upsert: true };
  private sessionOptions?: QueryOptions;

  constructor(
    model: Model<T>,
    // auditService: AuditService
    session?: ClientSession,
    populate?: PopulateOptions | (PopulateOptions | string)[],
  ) {
    this.model = model;
    // this.auditService = auditService
    this.session = session;
    if (session) this.sessionOptions = { session: this.session };
    if (populate) this.populate = populate;
  }

  static getValidId = (id: ObjectId | string): ObjectId | undefined => {
    if (id instanceof mongoose.Types.ObjectId) return id;
    if (!mongoose.isValidObjectId(id)) return;

    id = new mongoose.Types.ObjectId(id);
    return id;
  };

  findAll = async (filter: QueryFilter<T>) => {
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

  createMultiple = async (payload: Partial<T>[]) => {
    const created = await this.model.create(payload);
    return created;
  };

  // ? if there are issues with pre and post hooks, rename these to quick* and
  // ? create methods for manual update / upsert (create) with .save() called
  // ----- quick
  updateOne = async (
    filter: QueryFilter<T>,
    payload: UpdateQuery<T>,
    upsert: boolean = false, // create doc, {filter + payload}, if doc matching filter doesn't exist
  ) => {
    const options = upsert ? this.upsertOptions : this.updateOptions;
    const updated = await this.model
      .findOneAndUpdate(filter, payload, options)
      .populate(this.populate);
    return updated;
  };

  updateById = async (id: ObjectId, payload: UpdateQuery<T>) => {
    const updated = await this.model
      .findByIdAndUpdate(id, payload, this.updateOptions)
      .populate(this.populate);
    return updated;
  };
  // -----

  // ----- enforce save
  // ? mutates existing in place
  private _manualUpdate = async (
    existing: DocInstance<T>,
    payload: UpdateQuery<T>,
  ) => {
    if (!existing) return null;

    existing.set(payload);
    await existing.save();

    return existing;
  };

  updateOneWithSave = async (
    filter: QueryFilter<T>,
    payload: UpdateQuery<T>,
    upsert: boolean = false, // create doc, {filter + payload}, if doc matching filter doesn't exist
  ) => {
    const existing = await this.findOne(filter);
    if (!existing && !upsert) return null;

    if (existing) {
      const updated = await this._manualUpdate(existing, payload);
      return updated;
    }

    const createPayload = { ...filter, ...payload };
    const created = await this.create(createPayload);

    return created;
  };

  updateByIdWithSave = async (id: ObjectId, payload: UpdateQuery<T>) => {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = await this._manualUpdate(existing, payload);
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
