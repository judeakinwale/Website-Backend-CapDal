import { PopulateOptions } from "../../shared/model.repository";
import { MContactInfo } from "../models/contact-info.schema";
import ContactInfoController from "../controllers/contact-info.controllers";
import ContactInfoRepository from "../repositories/contact-info.repository";
import ContactInfoService from "../services/contact-info.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const contactInfoRepo = new ContactInfoRepository(MContactInfo, undefined, populate);
export const contactInfoService = new ContactInfoService(contactInfoRepo);
export const contactInfoController = new ContactInfoController(contactInfoService);
