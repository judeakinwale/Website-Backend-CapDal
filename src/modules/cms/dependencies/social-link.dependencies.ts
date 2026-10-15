import { PopulateOptions } from "../../shared/model.repository";
import { MSocialLink } from "../models/social-link.schema";
import SocialLinkController from "../controllers/social-link.controllers";
import SocialLinkRepository from "../repositories/social-link.repository";
import SocialLinkService from "../services/social-link.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const socialLinkRepo = new SocialLinkRepository(MSocialLink, undefined, populate);
export const socialLinkService = new SocialLinkService(socialLinkRepo);
export const socialLinkController = new SocialLinkController(socialLinkService);
