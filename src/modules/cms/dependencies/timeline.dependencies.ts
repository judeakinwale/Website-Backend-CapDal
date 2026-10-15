import { PopulateOptions } from "../../shared/model.repository";
import { MTimeline } from "../models/timeline.schema";
import TimelineController from "../controllers/timeline.controllers";
import TimelineRepository from "../repositories/timeline.repository";
import TimelineService from "../services/timeline.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const timelineRepo = new TimelineRepository(MTimeline, undefined, populate);
export const timelineService = new TimelineService(timelineRepo);
export const timelineController = new TimelineController(timelineService);
