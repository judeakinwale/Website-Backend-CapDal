import { DefaultItem } from "../../../types/default";

export interface Inquiry extends DefaultItem {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  // title: string;
  // content: string;
}
