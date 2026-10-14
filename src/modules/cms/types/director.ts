import { DefaultItem } from "../../../types/default";

export interface Director extends DefaultItem {
  name: string;
  title: string;
  image: string;
  summary?: string;
  link?: string;
  // value: string;
}
