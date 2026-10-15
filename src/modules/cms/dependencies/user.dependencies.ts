import { PopulateOptions } from "../../shared/model.repository";
import { MUser } from "../models/user.schema";
import UserController from "../controllers/user.controllers";
import UserRepository from "../repositories/user.repository";
import UserService from "../services/user.service";

const populate: PopulateOptions[] = [
  { path: "createdBy", populate: { path: "name email" } },
];

export const userRepo = new UserRepository(MUser, undefined, populate);
export const userService = new UserService(userRepo);
export const userController = new UserController(userService);
