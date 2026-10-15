import { PopulateOptions } from "../../shared/model.repository";
import { MInquiry } from "../models/inquiry.schema";
import InquiryController from "../controllers/inquiry.controllers";
import InquiryRepository from "../repositories/inquiry.repository";
import InquiryService from "../services/inquiry.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const inquiryRepo = new InquiryRepository(MInquiry, undefined, populate);
export const inquiryService = new InquiryService(inquiryRepo);
export const inquiryController = new InquiryController(inquiryService);
