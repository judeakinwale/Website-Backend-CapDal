import { Url } from "url";
import { DefaultItem, DefaultLinkItem } from "../../../types/default";

export enum NavLinkContentDisplay {
  "list" = "list",
  "grid" = "grid",
}

export interface NavLink extends DefaultItem {
  title: string;
  href?: Url | string;
  description?: string;
  order?: number;
  subLinks?: NavLink[];
  contentDisplay?: NavLinkContentDisplay;
}

export interface SocialLink extends DefaultLinkItem {
  // icon: string; // Lucide react icon // ? this is already handled using the title
}
