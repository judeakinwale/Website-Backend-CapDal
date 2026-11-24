import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/async";
import { BaseService } from "./base.service";
import { QueryFilter } from "./model.repository";
import { DefaultItem } from "../../types/default";
import { BaseUser } from "../../types/user";
import { APIResponse } from "./base.dto";

export class BaseController<T extends DefaultItem> {
  private service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  static parseUserFromRes = (res: Response): BaseUser | undefined => {
    const user: BaseUser | undefined = res.locals.user;
    return user;
  };

  static parseReqParam = (param: string | string[]): string => {
    if (!param) return "";
    if (typeof param === "string") return param;
    if (Array.isArray(param)) return param[0] || "";
    return "";
  };

  // TODO: implement advancedResults middleware functionality here by
  // TODO: parsing req.query into mongoose.QueryFilter<T>
  static parseReqQuery = (query: Record<string, any>): QueryFilter<any> => {
    const queryCopy = { ...query };
    return {};
  };

  find = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const filter = BaseController.parseReqQuery(req.query);
      const items = await this.service.find(filter);

      const resp: APIResponse = {
        success: true,
        data: items,
        count: items.length,
      };
      res.status(200).json(resp);
    },
  );

  findOne = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = BaseController.parseReqParam(req.params.id);
      const filter = BaseController.parseReqQuery(req.query);

      const item = await this.service.findOne(id, filter);

      const resp: APIResponse = {
        success: true,
        data: item,
      };
      res.status(200).json(resp);
    },
  );

  create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = BaseController.parseUserFromRes(res);

      const created = await this.service.create(req.body, user);

      const resp: APIResponse = {
        success: true,
        data: created,
      };
      res.status(201).json(resp);
    },
  );

  update = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = BaseController.parseReqParam(req.params.id);
      const filter = BaseController.parseReqQuery(req.query);
      const upsert = req.query.upsert === "true" && !id && !!filter;
      const user = BaseController.parseUserFromRes(res);

      const updated = await this.service.update(
        req.body,
        id,
        filter,
        upsert,
        user,
      );

      const resp: APIResponse = {
        success: true,
        data: updated,
      };
      res.status(200).json(resp);
    },
  );

  delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = BaseController.parseReqParam(req.params.id);
      const filter = BaseController.parseReqQuery(req.query);
      const user = BaseController.parseUserFromRes(res);

      const deleted = await this.service.delete(id, filter, user);

      const resp: APIResponse = {
        success: true,
        data: deleted,
        message: "Delete Successful",
      };
      res.status(200).json(resp);
    },
  );

  deleteMany = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const filter = BaseController.parseReqQuery(req.query);
      const user = BaseController.parseUserFromRes(res);

      const deleted = await this.service.deleteMany(filter, user);

      const resp: APIResponse = {
        success: true,
        count: deleted.deletedCount,
        message: "Bulk Delete Successful",
      };
      res.status(200).json(resp);
    },
  );
}
