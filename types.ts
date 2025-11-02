export enum ExerciseType {
  CLOZE = 'CLOZE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY',
  ORDERING = 'ORDERING',
}

// --- Bank Item Base Types ---
export interface BankItem {
  id: string;
  title: string;
  tags: string[];
}

// --- Exercise Bank Types ---
export interface ClozeBlank {
  correctAnswer: string;
  hint?: string;
}

export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
  hint?: string;
}

export interface OrderingItem {
  text: string;
  correctOrder: number;
}

export interface BaseExercise extends BankItem {
  type: ExerciseType;
  instructions: string;
}

export interface ClozeExercise extends BaseExercise {
  type: ExerciseType.CLOZE;
  content: string; 
  blanks: ClozeBlank[];
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: ExerciseType.MULTIPLE_CHOICE;
  question: string;
  options: MultipleChoiceOption[];
}

export interface EssayExercise extends BaseExercise {
  type: ExerciseType.ESSAY;
  prompt: string;
  wordCount?: number;
}

export interface OrderingExercise extends BaseExercise {
  type: ExerciseType.ORDERING;
  items: OrderingItem[];
}

export type Exercise = ClozeExercise | MultipleChoiceExercise | EssayExercise | OrderingExercise;

// --- Text Bank Types ---
export interface Text extends BankItem {
  content: string;
  author?: string;
  source?: string;
}

// --- Media Bank Types ---
export interface Media extends BankItem {
  mediaType: 'video' | 'audio' | 'image';
  url: string;
  description: string;
}

// --- Idea Bank Types ---
export interface Idea extends BankItem {
  ideaType: 'vocabulary' | 'grammar' | 'cultural_note';
  content: string;
}

// --- Path & Unit Structure Types ---
export type BankItemType = 'exercise' | 'text' | 'media' | 'idea';

export interface PathUnitItem {
  bankItemId: string; // The ID of the item in its respective bank
  itemType: BankItemType;
}

export interface PathUnit {
  id: string;
  title: string;
  anchorContent?: PathUnitItem;
  resources: PathUnitItem[]; // for vocab, grammar notes from Idea Bank
  exercises: PathUnitItem[];
}

export interface Path {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  units: PathUnit[];
}
