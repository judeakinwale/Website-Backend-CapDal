import { PopulateOptions } from "../../shared/model.repository";
import { MCertificate } from "../models/certificate.schema";
import CertificateController from "../controllers/certificate.controllers";
import CertificateRepository from "../repositories/certificate.repository";
import CertificateService from "../services/certificate.service";

export const populate: PopulateOptions[] = [
  {
    path: "createdBy",
    populate: { path: "name email" },
  },
];

export const certificateRepo = new CertificateRepository(
  MCertificate,
  undefined,
  populate,
);
export const certificateService = new CertificateService(certificateRepo);
export const certificateController = new CertificateController(
  certificateService,
);
