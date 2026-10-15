import { PopulateOptions } from "../../shared/model.repository";
import { MProject } from "../models/project.schema";
import ProjectController from "../controllers/project.controllers";
import ProjectRepository from "../repositories/project.repository";
import ProjectService from "../services/project.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const projectRepo = new ProjectRepository(MProject, undefined, populate);
export const projectService = new ProjectService(projectRepo);
export const projectController = new ProjectController(projectService);
