import { DefaultItem } from "../../../types/default";

export interface ProjectCategory extends DefaultItem {}

export interface Project extends DefaultItem {
  title: string;
  image: string;
  description?: string;
  category?: string; // ProjectCategory.title
  blurb?: string;
  location?: string;
  isFeatured?: boolean;
  completedAt?: string | Date;
}
