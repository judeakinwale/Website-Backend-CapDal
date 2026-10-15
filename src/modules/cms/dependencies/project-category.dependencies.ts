import { PopulateOptions } from "../../shared/model.repository";
import { MProjectCategory } from "../models/project-category.schema";
import ProjectCategoryController from "../controllers/project-category.controllers";
import ProjectCategoryRepository from "../repositories/project-category.repository";
import ProjectCategoryService from "../services/project-category.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const projectCategoryRepo = new ProjectCategoryRepository(MProjectCategory, undefined, populate);
export const projectCategoryService = new ProjectCategoryService(projectCategoryRepo);
export const projectCategoryController = new ProjectCategoryController(projectCategoryService);
