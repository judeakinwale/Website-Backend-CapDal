import { PopulateOptions } from "../../shared/model.repository";
import { MIdentity } from "../models/identity.schema";
import IdentityController from "../controllers/identity.controllers";
import IdentityRepository from "../repositories/identity.repository";
import IdentityService from "../services/identity.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const identityRepo = new IdentityRepository(MIdentity, undefined, populate);
export const identityService = new IdentityService(identityRepo);
export const identityController = new IdentityController(identityService);
