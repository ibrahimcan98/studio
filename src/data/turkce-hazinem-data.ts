export interface Question {
  id?: string | number;
  q: string;
  options?: string[];
  words?: string[];
  images?: { src: string; alt?: string }[];
  correct: number | string;
}

export interface StoryData {
  title: string;
  theme: string;
  text: string;
  questions: Question[];
}

export interface Rule {
  name: string;
  desc: string;
  example?: string;
  image?: string;
}

export interface ActivityData {
  title: string;
  desc: string;
  type?: string;
  image?: string;
  spots?: any[];
  pairs?: any[];
  questions?: Question[];
  [key: string]: any;
}

export interface SectionData {
  title?: string;
  info?: {
    title: string;
    rules: Rule[];
  };
  etkinlik1?: ActivityData;
  etkinlik2?: ActivityData;
  etkinlik3?: ActivityData;
  etkinlik4?: ActivityData;
  etkinlik5?: ActivityData;
  [key: string]: any;
}

export interface LangData extends SectionData {
  country?: CountryData;
}

export interface CountryData extends SectionData {}

export interface ChestContent {
  story?: StoryData;
  lang?: LangData;
  country?: CountryData;
  [key: string]: any;
}

export const CHESTS_CONTENT: Record<string, ChestContent> = {};
