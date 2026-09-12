export type Language = "en" | "vn";

export interface ProjectItem {
  id: string;
  category: "modeling" | "documentation" | "families" | "automation";
  title: {
    en: string;
    vn: string;
  };
  subtitle: {
    en: string;
    vn: string;
  };
  services: {
    en: string[];
    vn: string[];
  };
  tools: string[];
  brief: {
    en: string;
    vn: string;
  };
  deliverables: {
    en: string[];
    vn: string[];
  };
  keyResults: {
    en: string[];
    vn: string[];
  };
  coverImage: string;
  galleryImages: string[];
}

export interface ServiceItem {
  id: string;
  iconName: string;
  title: {
    en: string;
    vn: string;
  };
  shortDesc: {
    en: string;
    vn: string;
  };
  details: {
    en: string[];
    vn: string[];
  };
  badge: {
    en: string;
    vn: string;
  };
}

export interface ToolFeature {
  id: string;
  number: string;
  icon: string;
  title: {
    en: string;
    vn: string;
  };
  problem: {
    en: string;
    vn: string;
  };
  solution: {
    en: string;
    vn: string;
  };
  value: {
    en: string;
    vn: string;
  };
  capabilities: {
    en: string[];
    vn: string[];
  };
}

export interface ComparisonRow {
  task: {
    en: string;
    vn: string;
  };
  manual: {
    en: string;
    vn: string;
  };
  smobim: {
    en: string;
    vn: string;
  };
  improvement: {
    en: string;
    vn: string;
  };
}

export interface FaqItem {
  question: {
    en: string;
    vn: string;
  };
  answer: {
    en: string;
    vn: string;
  };
}

export interface WorkflowStep {
  step: string;
  title: {
    en: string;
    vn: string;
  };
  desc: {
    en: string;
    vn: string;
  };
  outcome: {
    en: string;
    vn: string;
  };
}

export interface TestimonialItem {
  id: string;
  author: {
    name: string;
    location: string;
    avatarImage: string;
    avatarInitials?: string;
    role?: {
      en: string;
      vn: string;
    };
    company?: {
      en: string;
      vn: string;
    };
  };
  projectType: {
    en: string;
    vn: string;
  };
  date?: string;
  rating: number;
  content: {
    en: string;
    vn: string;
  };
  highlightTag: {
    en: string;
    vn: string;
  };
}

