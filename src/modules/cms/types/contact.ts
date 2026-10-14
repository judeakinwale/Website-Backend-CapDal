import { DefaultItem } from "../../../types/default";

export enum ContactInfoType {
  ADDRESS = "address",
  PHONE = "phone",
  EMAIL = "email",
  MEDIA_PHONE = "media-phone",
  MEDIA_EMAIL = "media-email",
  CAREER_EMAIL = "career-email",
}

export interface ContactInfo extends DefaultItem {
  title: string;
  // value?: string;
  type: ContactInfoType;
}
