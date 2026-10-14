import { DefaultItem } from "../../../types/default";

export enum IdentityType {
  MISSION = "Mission",
  VISION = "Vision",
  VALUES = "Values",
}

export interface Identity extends DefaultItem {
  title: string;
  type: IdentityType;
  icon?: string;
  content: string;
}
