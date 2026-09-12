export type Language = "vi" | "en";

export interface UnitItem {
  id: number;
  unitNumber: number;
  title: string;
  stage: number;
  stageName: string;
  hasVideo: boolean;
  questionCount: number;
}

export interface VerbItem {
  v1: string;
  v2: string;
  v3: string;
  meaningVi: string;
  meaningEn: string;
  phonetic: string;
  example: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
