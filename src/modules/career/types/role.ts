import { DefaultItem } from "../../../types/default";

export enum RoleType {
  FULL_TIME = "Full-Time",
  PART_TIME = "Part-Time",
  CONTRACT = "Contract",
  INTERN = "Intern",
  TEMPORARY = "Temporary",
}

export interface RoleDivision extends DefaultItem {}

export interface Role extends DefaultItem {
  title: string;
  description: string;
  division: string; // RoleDivision.title
  type: RoleType;
  location: string;
  image?: string;
  expiresAt?: string | Date;
}
