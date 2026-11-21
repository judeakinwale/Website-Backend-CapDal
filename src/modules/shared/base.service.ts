import mongoose from "mongoose";
import { ModelRepository, ObjectId, QueryFilter } from "./model.repository";
import ErrorResponse from "../../utils/errorResponse";
import { updateDocMetadata } from "../../utils/audit.utils";
import { DefaultItem } from "../../types/default";
import { BaseUser } from "../../types/user";
import { APIResponse } from "./base.dto";

export class BaseService<T extends DefaultItem> {
  private repo: ModelRepository<T>;
  name: string = "Base Service";

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

  private normalizeUserId = (user?: BaseUser): ObjectId | undefined => {
    if (!user?.id) return;
    return this._normalizeId(user?.id);
  };

  find = async (filter: QueryFilter<T>): Promise<APIResponse<T[]>> => {
    const items = await this.repo.findAll(filter);

    const response: APIResponse = {
      success: true,
      data: items,
      count: items.length,
    };
    return response;
  };

  findOne = async (
    id?: ObjectId | string,
    filter?: QueryFilter<T>,
  ): Promise<APIResponse<T>> => {
    if (!id && !filter)
      throw new ErrorResponse(
        `[${this.name}] Provide either an id or filter!`,
        400,
      );

    let item;
    if (id) item = await this.repo.findById(this._normalizeId(id));
    if (filter) item = await this.repo.findOne(filter);

    if (!item) throw new ErrorResponse(`[${this.name}] Item not found!`, 404);

    const response: APIResponse = {
      success: true,
      data: item,
    };
    return response;
  };

  create = async (payload: T, user?: BaseUser): Promise<APIResponse<T>> => {
    const userId = this.normalizeUserId(user);
    payload = updateDocMetadata<T>(payload, userId);

    const created = await this.repo.create(payload);
    if (!created)
      throw new ErrorResponse(`[${this.name}] Error creating item!`, 400);

    const response: APIResponse = {
      success: true,
      data: created,
    };
    return response;
  };

  update = async (
    payload: Partial<T>,
    id?: ObjectId | string,
    filter?: QueryFilter<T>,
    upsert?: boolean,
    user?: BaseUser,
  ): Promise<APIResponse<T>> => {
    if (!id && !filter)
      throw new ErrorResponse(
        `[${this.name}] Provide either an id or filter!`,
        400,
      );

    const userId = this.normalizeUserId(user);
    payload = updateDocMetadata<Partial<T>>(payload, userId, true);

    let updated;
    if (id)
      updated = await this.repo.updateById(this._normalizeId(id), payload);
    if (filter) updated = await this.repo.updateOne(filter, payload, upsert);
    if (!updated)
      throw new ErrorResponse(`[${this.name}] Error updating item!`, 400);

    const response: APIResponse = {
      success: true,
      data: updated,
    };
    return response;
  };

  delete = async (
    id?: ObjectId | string,
    filter?: QueryFilter<T>,
    user?: BaseUser,
  ): Promise<APIResponse<T>> => {
    if (!id && !filter)
      throw new ErrorResponse(
        `[${this.name}] Provide either an id or filter!`,
        400,
      );

    const userId = this.normalizeUserId(user);

    let deleted;
    if (id) deleted = await this.repo.deleteById(this._normalizeId(id));
    if (filter) deleted = await this.repo.deleteOne(filter);
    if (!deleted)
      throw new ErrorResponse(`[${this.name}] Error deleting item!`, 400);

    const response: APIResponse = {
      success: true,
      data: deleted,
      message: "Delete Successful",
    };
    return response;
  };

  deleteMany = async (filter?: QueryFilter<T>, user?: BaseUser) => {
    const userId = this.normalizeUserId(user);

    const deleted = await this.repo.deleteMany(filter);
    if (!deleted)
      throw new ErrorResponse(
        `[${this.name}] Error deleting multiple items!`,
        400,
      );

    const response: APIResponse = {
      success: true,
      count: deleted.deletedCount,
      message: "Bulk Delete Successful",
    };
    return response;
  };
}
