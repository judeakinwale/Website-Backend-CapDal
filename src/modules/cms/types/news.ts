import { DefaultItem } from "../../../types/default";

export interface NewsTag extends DefaultItem {}
export interface NewsCategory extends DefaultItem {}

export interface News extends DefaultItem {
  title: string;
  image: string;
  body: string;
  category?: string; // NewsCategory.title
  tag?: string; // NewsTag.title
  publishedAt?: string | Date;
}
