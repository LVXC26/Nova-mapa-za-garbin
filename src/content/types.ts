export type Locale = "sl" | "en";

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  tag: string;
  title: string;
  description: string;
  points: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  title: string;
  tag: string;
  description: string;
}

export interface ProjectItem {
  images: string[];
  title: string;
  category: string;
  description: string;
}

export interface SiteContent {
  locale: Locale;
  meta: {
    title: string;
    description: string;
  };
  nav: {
    items: NavItem[];
    cta: { label: string; href: string };
    langSwitch: { label: string; href: string };
  };
  hero: {
    eyebrow: string;
    titleLines: [string, string];
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    badges: string[];
    hud: {
      status: string;
      project: string;
      lines: { label: string; value: string }[];
      flipHint: string;
      backTitle: string;
      backCta: { label: string; href: string };
    };
  };
  servicesSection: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ServiceItem[];
  };
  industries: {
    eyebrow: string;
    title: string;
    intro: string;
    items: string[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    intro: string;
    items: GalleryItem[];
  };
  process: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: ProcessStep[];
  };
  projects: {
    eyebrow: string;
    title: string;
    intro: string;
    note: string;
    items: ProjectItem[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    values: { title: string; description: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    email: string;
    location: string;
    social: { label: string; href: string }[];
    form: {
      name: string;
      email: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      note: string;
    };
  };
  footer: {
    tagline: string;
    rights: string;
  };
}
