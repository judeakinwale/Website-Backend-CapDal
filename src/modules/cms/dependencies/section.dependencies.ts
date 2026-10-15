import { PopulateOptions } from "../../shared/model.repository";
import { MSection } from "../models/section.schema";
import SectionController from "../controllers/section.controllers";
import SectionRepository from "../repositories/section.repository";
import SectionService from "../services/section.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const sectionRepo = new SectionRepository(MSection, undefined, populate);
export const sectionService = new SectionService(sectionRepo);
export const sectionController = new SectionController(sectionService);
