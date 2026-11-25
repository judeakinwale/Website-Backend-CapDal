import mongoose from "mongoose";
import {
  ModelRepository,
  ObjectId,
  QueryFilter,
  UpdateQuery,
} from "./model.repository";
import ErrorResponse from "../../utils/errorResponse";
import { updateDocMetadata } from "../../utils/audit.utils";
import { DefaultItem } from "../../types/default";
import { BaseUser } from "../../types/user";

type DocResponse<T> = Promise<mongoose.IfAny<
  T,
  any,
  mongoose.Document<unknown, {}, T, {}, mongoose.DefaultSchemaOptions> &
    mongoose.Require_id<T> & {
      __v: number;
    } & mongoose.AddDefaultId<T, {}, mongoose.DefaultSchemaOptions>
> | null>;

// TODO: add audit logic where needed
export class BaseService<T extends DefaultItem> {
  repo: ModelRepository<T>; // private
  name: string = "Base Service";
  entityName: string = "Item";

  constructor(repo: ModelRepository<T>) {
    this.repo = repo;
  }

  static normalizeId = (id: ObjectId | string): ObjectId => {
    if (typeof id === "string") return new mongoose.Types.ObjectId(id);
    if (!mongoose.isValidObjectId(id))
      throw new ErrorResponse(`[${this.name}] Invalid id provided!`, 400);

    return id;
  };

  private _normalizeId = BaseService.normalizeId;

  normalizeUserId = (user?: BaseUser): ObjectId | undefined => {
    if (!user?.id) return;
    return this._normalizeId(user?.id);
  };

  ensureIdOrFilter = (
    id?: ObjectId | string,
    filter?: QueryFilter<T>,
  ): void => {
    if (!id && !filter)
      throw new ErrorResponse(
        `[${this.name}] Provide either an id or filter!`,
        400,
      );
  };

  find = async (filter: QueryFilter<T>): Promise<T[]> => {
    const items = await this.repo.findAll(filter);

    return items as T[];
  };

  findOne = async (
    id?: ObjectId | string,
    filter?: QueryFilter<T>,
  ): Promise<T> => {
    this.ensureIdOrFilter(id, filter);

    let item;
    if (id) item = await this.repo.findById(this._normalizeId(id));
    if (filter) item = await this.repo.findOne(filter);

    if (!item)
      throw new ErrorResponse(
        `[${this.name}] ${this.entityName} not found!`,
        404,
      );

    return item;
  };

  // -----
  async create(payload: T, user?: BaseUser): Promise<T> {
    const userId = this.normalizeUserId(user);
    payload = updateDocMetadata<T>(payload, userId);

    const created = await this.repo.create(payload);
    if (!created)
      throw new ErrorResponse(
        `[${this.name}] Error creating ${this.entityName}!`,
        400,
      );

    return created;
  }

  async update(
    payload: UpdateQuery<T>,
    id?: ObjectId | string,
    filter?: QueryFilter<T>,
    upsert?: boolean,
    user?: BaseUser,
  ): Promise<T> {
    this.ensureIdOrFilter(id, filter);

    const userId = this.normalizeUserId(user);
    payload = updateDocMetadata<UpdateQuery<T>>(payload, userId, true);

    let updated;
    if (id)
      updated = await this.repo.updateById(this._normalizeId(id), payload);
    if (filter) updated = await this.repo.updateOne(filter, payload, upsert);
    if (!updated)
      throw new ErrorResponse(
        `[${this.name}] Error updating ${this.entityName}!`,
        400,
      );

    return updated;
  }
  // -----

  delete = async (
    id?: ObjectId | string,
    filter?: QueryFilter<T>,
    user?: BaseUser,
  ): Promise<T> => {
    this.ensureIdOrFilter(id, filter);

    const userId = this.normalizeUserId(user);

    let deleted;
    if (id) deleted = await this.repo.deleteById(this._normalizeId(id));
    if (filter) deleted = await this.repo.deleteOne(filter);
    if (!deleted)
      throw new ErrorResponse(
        `[${this.name}] Error deleting ${this.entityName}!`,
        400,
      );

    return deleted;
  };

  deleteMany = async (filter?: QueryFilter<T>, user?: BaseUser) => {
    const userId = this.normalizeUserId(user);

    const deleted = await this.repo.deleteMany(filter);
    if (!deleted)
      throw new ErrorResponse(
        `[${this.name}] Error deleting multiple ${this.entityName}s!`,
        400,
      );

    return deleted;
  };
}
