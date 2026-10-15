import { PopulateOptions } from "../../shared/model.repository";
import { MDirector } from "../models/director.schema";
import DirectorController from "../controllers/director.controllers";
import DirectorRepository from "../repositories/director.repository";
import DirectorService from "../services/director.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const directorRepo = new DirectorRepository(MDirector, undefined, populate);
export const directorService = new DirectorService(directorRepo);
export const directorController = new DirectorController(directorService);
