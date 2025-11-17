export const GENRES = ['สยองขวัญ', 'โฆษณาสินค้า', 'รีวิว', 'ตลก', 'ภาพยนตร์'] as const;
export type Genre = typeof GENRES[number];

export type Duration = 15 | 30 | 45;

export interface Character {
  id: number;
  name: string;
  description: string;
  isCameo: boolean;
  gender: string;
  age: string;
}

export interface SavedCameo {
    id: string; // The cameo identifier itself, e.g., "@pheem.tha"
    identifier: string;
    name: string;
    gender: string;
    age: string;
}

export interface TimelineSegment {
  part: number;
  description: string;
}

export interface Timeline {
  hook: string; // 0-3s
  buildUp: string; // 3-8s
  payoff: string; // 8-13s
  finalImpact: string; // 13-15s
}

export interface ReferenceImage {
  id: number;
  base64: string;
  mimeType: string;
}

export interface PromptData {
  genre: Genre;
  duration: Duration;
  title: string;
  location: string;
  characters: Character[];
  timeline: TimelineSegment[];
  camera: string;
  lighting: string;
  style: string;
  referenceImages: ReferenceImage[];
}

// Type for the data structure returned by the Gemini AI helper
export interface AiGeneratedDetails {
  title?: string;
  location?: string;
  characters?: Array<{
    name: string;
    description: string;
    isCameo?: boolean;
    gender?: string;
    age?: string;
  }>;
  timeline?: TimelineSegment[];
}