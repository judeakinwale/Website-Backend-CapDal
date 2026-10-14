export interface DefaultItem {
  id?: string;

  title: string;
  value?: string;

  order?: number;

  isActive?: boolean;
  createdBy?: string | Record<string, any>;
  updatedBy?: string | Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface DefaultLinkItem extends DefaultItem {
  href: string;
}

export interface DefaultSimpleLink {
  title?: string;
  url: string;
  description?: string;
  order?: number;
}

export interface DefaultBulletPoint {
  title: string;
  description?: string;
  icon?: string;
  order?: number;
}

// ? only the title, subtitle, content, image and, link(maybe), should be used here
export interface DefaultConfig extends DefaultLinkItem {
  section?: string;
  subTitle?: string;
  content?: string;
  blurb?: string;
  // image?: string;
  // altImage?: string;
  // imageDescription?: string;
  // altImageDescription?: string;
  images?: DefaultSimpleLink[];
  // link?: string;
  // linkText?: string;
  links?: DefaultSimpleLink[];
}
