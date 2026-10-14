import { DefaultBulletPoint, DefaultItem, DefaultSimpleLink } from "../../../types/default";

export enum SiteSections {
  HEADER = "header",
  HEADER_CONTACT = "header-contact",
  FOOTER = "footer",
  FOOTER_NEWSLETTER = "footer-newsletter",
  WHO_WE_ARE = "who-we-are",
  HOME_SERVICES = "home-services",
  HOME_LANDMARKS = "home-landmarks",
  HOME_INSIGHTS = "home-insights",
  HOME_CTA = "home-cta",
  HOME_HERO = "home-hero",
  ABOUT_FOUNDERS = "about-founders",
  ABOUT_TIMELINE = "about-timeline",
  ABOUT_DIRECTORS = "about-directors",
  ABOUT_CERTIFICATES = "about-certificates",
  ABOUT_HERO = "about-hero",
  SERVICES_CTA = "services-cta",
  SERVICES_HERO = "services-hero",
  PROJECTS_PROJECTS = "projects-projects",
  PROJECTS_HERO = "projects-hero",
  CONTACT_FORM = "contact-form",
  CONTACT_HEADQUARTERS = "contact-headquarters",
  CONTACT_HERO = "contact-hero",
  CAREER_CULTURE = "career-culture",
  CAREER_CULTURE_QUOTE = "career-culture_quote",
  CAREER_ROLES = "career-roles",
  CAREER_CTA = "career-cta",
  CAREER_HERO = "career-hero",
  NEWS_NEWS = "news-news",
  NEWS_MEDIA = "news-media",
  NEWS_NEWSLETTER = "news-newsletter",
  NEWS_HERO = "news-hero",
}

export interface SectionImage extends DefaultSimpleLink {}

export interface SectionLink extends DefaultSimpleLink {
  title: string;
}

export interface SectionBulletPoint extends DefaultBulletPoint {}

export interface Section extends DefaultItem {
  title: string;
  section: SiteSections;
  subTitle?: string;
  content?: string;
  blurb?: string;
  // image?: string;
  // altImage?: string;
  // imageDescription?: string;
  // altImageDescription?: string;
  images?: SectionImage[];
  // link?: string;
  // linkText?: string;
  links?: SectionLink[];
  bulletPoints?: SectionBulletPoint[]; // for services and our founder sections
}
