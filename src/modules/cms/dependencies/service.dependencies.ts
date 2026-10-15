import { PopulateOptions } from "../../shared/model.repository";
import { MService } from "../models/service.schema";
import ServiceController from "../controllers/service.controllers";
import ServiceRepository from "../repositories/service.repository";
import ServiceService from "../services/service.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const serviceRepo = new ServiceRepository(MService, undefined, populate);
export const serviceService = new ServiceService(serviceRepo);
export const serviceController = new ServiceController(serviceService);
