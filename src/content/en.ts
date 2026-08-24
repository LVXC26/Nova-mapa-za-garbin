import type { SiteContent } from "./types";

export const en: SiteContent = {
  locale: "en",
  meta: {
    title: "LVX Experience — Video Production, Marketing & Web Design",
    description:
      "LVX Experience is a studio for video production, Facebook & Instagram marketing, organic social media management, web design and Google SEO.",
  },
  nav: {
    items: [
      { label: "Home", href: "/en" },
      { label: "Services", href: "/en/services" },
      { label: "Projects", href: "/en/projects" },
      { label: "About", href: "/en/about" },
      { label: "Contact", href: "/en/contact" },
    ],
    cta: { label: "Start a project ↗", href: "/en/contact" },
    langSwitch: { label: "SI", href: "/" },
  },
  hero: {
    eyebrow: "Video · Marketing · Web · SEO",
    titleLines: ["An experience your", "audience notices."],
    subtitle:
      "LVX Experience creates video content, marketing campaigns and websites that help brands stand out on Facebook, Instagram and Google.",
    ctaPrimary: { label: "Start a project", href: "/en/contact" },
    ctaSecondary: { label: "See services", href: "/en/services" },
    badges: ["Open for projects", "Video production", "Marketing & SEO"],
    hud: {
      status: "IN PRODUCTION",
      project: "lvx_project_reel_v3",
      lines: [
        { label: "phase", value: "editing" },
        { label: "format", value: "9:16 · 16:9" },
        { label: "publish", value: "FB / IG / Web" },
      ],
      flipHint: "Hold and drag to rotate",
      backTitle: "See our work",
      backCta: { label: "All projects →", href: "/en/projects" },
    },
  },
  servicesSection: {
    eyebrow: "Services · 01",
    title: "Everything a brand needs, in one place.",
    intro:
      "From the first idea to publishing — we cover your brand's entire digital presence.",
    items: [
      {
        tag: "Video",
        title: "Video production",
        description:
          "Filming and editing promotional, product and social videos, tailored for Reels, TikTok and YouTube.",
        points: ["On-location filming", "Editing & color grading", "Short and long formats"],
      },
      {
        tag: "Marketing",
        title: "Facebook & Instagram marketing",
        description:
          "Paid campaigns targeted at the right people — from setup to results optimization.",
        points: ["Ad campaigns", "Audience targeting", "Performance tracking"],
      },
      {
        tag: "Social",
        title: "Organic social media management",
        description:
          "A content calendar, posting and community care that builds brand awareness day by day.",
        points: ["Content strategy", "Regular posting", "Community engagement"],
      },
      {
        tag: "Web",
        title: "Website design",
        description:
          "Fast, modern and mobile-friendly websites that turn visitors into customers.",
        points: ["Modern design", "Mobile-first", "Fast loading"],
      },
      {
        tag: "SEO",
        title: "Google SEO",
        description:
          "Search engine and local SEO optimization that grows organic traffic long-term.",
        points: ["Technical SEO audit", "Local visibility", "Organic traffic growth"],
      },
    ],
  },
  industries: {
    eyebrow: "Industries · 02",
    title: "Industries we love working with.",
    intro: "We adapt to the specifics of every industry — from hospitality to personal brands.",
    items: [
      "Hospitality & cafés",
      "Hotels & tourism",
      "Wellness & spa",
      "Local products",
      "Personal brands",
      "Events & weddings",
    ],
  },
  gallery: {
    eyebrow: "Snapshots · 03",
    title: "Snapshots from our shoots.",
    intro: "A few extra shots from example projects, showing the kind of content we create.",
    items: [
      {
        src: "/images/gallery/martinova-5.jpg",
        alt: "Restaurant ambiance",
        title: "Restaurant",
        tag: "Hospitality",
        description: "Photo/video content for a restaurant.",
      },
      {
        src: "/images/gallery/hotel-lonca-5.jpg",
        alt: "Hotel ambiance",
        title: "Hotel & tourism",
        tag: "Hotel",
        description: "Showcase content for a hotel property.",
      },
      {
        src: "/images/gallery/athlete-gym-5.jpg",
        alt: "Gym ambiance",
        title: "Gym & fitness",
        tag: "Fitness",
        description: "Dynamic footage for a fitness studio.",
      },
      {
        src: "/images/gallery/mia-kozmetika-5.jpg",
        alt: "Cosmetics detail",
        title: "Cosmetics brand",
        tag: "Cosmetics",
        description: "Product content for a cosmetics brand.",
      },
      {
        src: "/images/gallery/martinova-6.jpg",
        alt: "Restaurant extra detail",
        title: "Restaurant",
        tag: "Hospitality",
        description: "Photo/video content for a restaurant.",
      },
      {
        src: "/images/gallery/hotel-lonca-6.jpg",
        alt: "Hotel extra detail",
        title: "Hotel & tourism",
        tag: "Hotel",
        description: "Showcase content for a hotel property.",
      },
      {
        src: "/images/gallery/athlete-gym-6.jpg",
        alt: "Gym extra detail",
        title: "Gym & fitness",
        tag: "Fitness",
        description: "Dynamic footage for a fitness studio.",
      },
      {
        src: "/images/gallery/mia-kozmetika-6.jpg",
        alt: "Cosmetics extra detail",
        title: "Cosmetics brand",
        tag: "Cosmetics",
        description: "Product content for a cosmetics brand.",
      },
    ],
  },
  process: {
    eyebrow: "Process · 04",
    title: "How we take a project from idea to publish.",
    intro: "A clear process so you always know what's happening at every stage.",
    steps: [
      {
        number: "01",
        title: "Brief",
        description: "We learn your brand, goals and audience, and agree on the project direction.",
      },
      {
        number: "02",
        title: "Concept & script",
        description: "We prepare a concept, script and visual references before filming.",
      },
      {
        number: "03",
        title: "Production",
        description: "We film video content and gather material for marketing campaigns.",
      },
      {
        number: "04",
        title: "Editing & publishing",
        description: "We edit, design and publish content across the agreed channels.",
      },
      {
        number: "05",
        title: "Growth & optimization",
        description: "We track results and optimize campaigns and SEO for long-term growth.",
      },
    ],
  },
  projects: {
    eyebrow: "Projects · 2026",
    title: "Example projects.",
    intro:
      "As LVX Experience is just getting started, here are example projects that illustrate the kind of work we do.",
    note: "Placeholder examples — these will be replaced with real client projects as they become available.",
    items: [
      {
        images: [
          "/images/projects/hartatek-1.jpg",
          "/images/gallery/martinova-2.jpg",
          "/images/gallery/martinova-3.jpg",
          "/images/gallery/martinova-4.jpg",
          "/images/gallery/martinova-7.jpg",
          "/images/gallery/martinova-8.jpg",
        ],
        title: "Example: Restaurant",
        category: "Video production & Social",
        description: "Photo/video content and social media management for a restaurant.",
      },
      {
        images: [
          "/images/projects/hartatek-2.jpg",
          "/images/gallery/hotel-lonca-2.jpg",
          "/images/gallery/hotel-lonca-3.jpg",
          "/images/gallery/hotel-lonca-4.jpg",
          "/images/gallery/hotel-lonca-7.jpg",
          "/images/gallery/hotel-lonca-8.jpg",
        ],
        title: "Example: Hotel & tourism",
        category: "Website & SEO",
        description: "A showcase website with local Google SEO optimization.",
      },
      {
        images: [
          "/images/projects/hartatek-3.jpg",
          "/images/gallery/athlete-gym-2.jpg",
          "/images/gallery/athlete-gym-3.jpg",
          "/images/gallery/athlete-gym-4.jpg",
          "/images/gallery/athlete-gym-7.jpg",
          "/images/gallery/athlete-gym-8.jpg",
        ],
        title: "Example: Gym & fitness",
        category: "Marketing campaign",
        description: "A Facebook and Instagram ad campaign to grow membership.",
      },
      {
        images: [
          "/images/projects/hartatek-4.jpg",
          "/images/gallery/mia-kozmetika-2.jpg",
          "/images/gallery/mia-kozmetika-3.jpg",
          "/images/gallery/mia-kozmetika-4.jpg",
          "/images/gallery/mia-kozmetika-7.jpg",
          "/images/gallery/mia-kozmetika-8.jpg",
        ],
        title: "Example: Cosmetics brand",
        category: "Video & Organic management",
        description: "Product videos and ongoing social media management for a cosmetics brand.",
      },
      {
        images: [
          "/images/gallery/kaos-okusov-1.jpg",
          "/images/gallery/kaos-okusov-2.jpg",
          "/images/gallery/kaos-okusov-3.jpg",
          "/images/gallery/kaos-okusov-4.jpg",
          "/images/gallery/kaos-okusov-5.jpg",
          "/images/gallery/kaos-okusov-6.jpg",
        ],
        title: "Example: Burger restaurant",
        category: "Organic social management",
        description: "Ongoing social media management and content showcasing a burger restaurant's menu and atmosphere.",
      },
      {
        images: [
          "/images/gallery/slajs-1.jpg",
          "/images/gallery/slajs-2.jpg",
          "/images/gallery/slajs-3.jpg",
          "/images/gallery/slajs-4.jpg",
          "/images/gallery/slajs-5.jpg",
          "/images/gallery/slajs-6.jpg",
        ],
        title: "Example: Pinsa & sandwich bar",
        category: "Organic social management",
        description: "Eye-catching posts for a pinsa and focaccia sandwich menu.",
      },
      {
        images: [
          "/images/gallery/dvor-tacen-1.jpg",
          "/images/gallery/dvor-tacen-2.jpg",
          "/images/gallery/dvor-tacen-3.jpg",
          "/images/gallery/dvor-tacen-4.jpg",
          "/images/gallery/dvor-tacen-5.jpg",
          "/images/gallery/dvor-tacen-6.jpg",
        ],
        title: "Example: Restaurant & guesthouse",
        category: "Organic social management",
        description: "Social media management for a restaurant with a dining offer and overnight stays.",
      },
    ],
  },
  about: {
    eyebrow: "About",
    title: "A team for video, marketing and digital growth.",
    paragraphs: [
      "LVX Experience is a studio working in video production, social media marketing, organic profile management, website design and Google SEO.",
      "We believe great content and a clear digital strategy help brands grow — so we connect creative production with data-driven marketing.",
      "Every project starts with a clear brief and is carried through the whole process, from idea to publishing and results optimization.",
    ],
    values: [
      { title: "Creativity", description: "Every video and every post tells its own story." },
      { title: "Results", description: "We measure success with data, not just likes." },
      { title: "Reliability", description: "We keep agreed deadlines and report progress regularly." },
    ],
  },
  contact: {
    eyebrow: "Contact · 2026",
    title: "Have a project in mind? Let's talk.",
    intro: "Tell us about your brand and goals — we'll get back to you within a few days with a proposal.",
    email: "info@lvxexperience.com",
    location: "Slovenia",
    social: [
      { label: "Instagram", href: "https://www.instagram.com/" },
      { label: "Facebook", href: "https://www.facebook.com/" },
      { label: "YouTube", href: "https://www.youtube.com/" },
    ],
    form: {
      name: "Full name",
      email: "Email address",
      message: "Message",
      messagePlaceholder: "Tell us a bit about your project…",
      submit: "Send inquiry",
      note: "This opens your email app with a message addressed to LVX Experience.",
    },
  },
  footer: {
    tagline: "Video production, marketing and digital growth.",
    rights: "All rights reserved.",
  },
};
