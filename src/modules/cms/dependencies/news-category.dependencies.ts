import { PopulateOptions } from "../../shared/model.repository";
import { MNewsCategory } from "../models/news-category.schema";
import NewsCategoryController from "../controllers/news-category.controllers";
import NewsCategoryRepository from "../repositories/news-category.repository";
import NewsCategoryService from "../services/news-category.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const newsCategoryRepo = new NewsCategoryRepository(MNewsCategory, undefined, populate);
export const newsCategoryService = new NewsCategoryService(newsCategoryRepo);
export const newsCategoryController = new NewsCategoryController(newsCategoryService);
