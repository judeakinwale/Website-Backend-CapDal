import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middleware/async";
import { BaseService } from "./base.service";
import { QueryFilter } from "./model.repository";
import { DefaultItem } from "../../types/default";
import { BaseUser } from "../../types/user";

export class BaseController<T extends DefaultItem> {
  private service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  parseUserFromRes = (res: Response): BaseUser | undefined => {
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
      const resp = await this.service.find(filter);

      res.status(200).json(resp);
    },
  );

  findOne = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = BaseController.parseReqParam(req.params.id);
      const filter = BaseController.parseReqQuery(req.query);

      const resp = await this.service.findOne(id, filter);

      res.status(200).json(resp);
    },
  );

  create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = this.parseUserFromRes(res);

      const resp = await this.service.create(req.body, user);

      res.status(201).json(resp);
    },
  );

  update = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = BaseController.parseReqParam(req.params.id);
      const filter = BaseController.parseReqQuery(req.query);
      const upsert = req.query.upsert === "true" && !id && !!filter;
      const user = this.parseUserFromRes(res);

      const resp = await this.service.update(
        req.body,
        id,
        filter,
        upsert,
        user,
      );

      res.status(200).json(resp);
    },
  );

  delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = BaseController.parseReqParam(req.params.id);
      const filter = BaseController.parseReqQuery(req.query);
      const user = this.parseUserFromRes(res);

      const resp = await this.service.delete(id, filter, user);

      res.status(200).json(resp);
    },
  );
}
