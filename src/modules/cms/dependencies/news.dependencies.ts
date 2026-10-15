import { PopulateOptions } from "../../shared/model.repository";
import { MNews } from "../models/news.schema";
import NewsController from "../controllers/news.controllers";
import NewsRepository from "../repositories/news.repository";
import NewsService from "../services/news.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const newsRepo = new NewsRepository(MNews, undefined, populate);
export const newsService = new NewsService(newsRepo);
export const newsController = new NewsController(newsService);
