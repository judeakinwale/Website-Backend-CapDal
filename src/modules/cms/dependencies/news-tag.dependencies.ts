import { PopulateOptions } from "../../shared/model.repository";
import { MNewsTag } from "../models/news-tag.schema";
import NewsTagController from "../controllers/news-tag.controllers";
import NewsTagRepository from "../repositories/news-tag.repository";
import NewsTagService from "../services/news-tag.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const newsTagRepo = new NewsTagRepository(MNewsTag, undefined, populate);
export const newsTagService = new NewsTagService(newsTagRepo);
export const newsTagController = new NewsTagController(newsTagService);
