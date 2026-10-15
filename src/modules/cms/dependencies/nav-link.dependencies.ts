import { PopulateOptions } from "../../shared/model.repository";
import { MNavLink } from "../models/nav-link.schema";
import NavLinkController from "../controllers/nav-link.controllers";
import NavLinkRepository from "../repositories/nav-link.repository";
import NavLinkService from "../services/nav-link.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const navLinkRepo = new NavLinkRepository(MNavLink, undefined, populate);
export const navLinkService = new NavLinkService(navLinkRepo);
export const navLinkController = new NavLinkController(navLinkService);
