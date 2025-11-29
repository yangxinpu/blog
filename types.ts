
export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link?: string;
}

export interface TechItem {
  name: string;
  description: string;
  color: string;
  logo: string; // SVG path d attribute
}

export interface ThoughtItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

export interface HobbyItem {
  id: string;
  name: string;
  description: string;
  iconKey: 'book' | 'camera' | 'activity' | 'plane' | 'film' | 'music';
}

export interface VideoItem {
  id: number;
  src: string;
  title: string;
  category: string;
}
export interface Content {
  hero: {
    motto: string;
    name: string;
    subtitle: string;
    scroll: string;
  };
  stack: {
    title: string;
    subtitle: string;
    items: TechItem[];
  };
  projects: {
    title: string;
    items: Project[];
  };
  thoughts: {
    title: string;
    subtitle: string;
    items: ThoughtItem[];
  };
  manifesto: string[];
  hobbies: {
    title: string;
    subtitle: string;
    items: HobbyItem[];
  };
  videos: {
    title: string;
    subtitle: string;
    items: VideoItem[];
  };
}


export type Language = 'en' | 'zh';
export type Theme = 'dark' | 'light';
