import { DefaultItem } from "../../../types/default";

export enum StatSection {
  HOME = "home",
  PROJECTS = "projects",
  CAREERS = "careers",
  GENERAL = "general",
}

export interface Stat extends DefaultItem {
  title: string;
  value: string;
  section?: StatSection;
}
