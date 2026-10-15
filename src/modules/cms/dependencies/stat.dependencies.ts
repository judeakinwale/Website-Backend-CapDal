import { PopulateOptions } from "../../shared/model.repository";
import { MStat } from "../models/stat.schema";
import StatController from "../controllers/stat.controllers";
import StatRepository from "../repositories/stat.repository";
import StatService from "../services/stat.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const statRepo = new StatRepository(MStat, undefined, populate);
export const statService = new StatService(statRepo);
export const statController = new StatController(statService);
