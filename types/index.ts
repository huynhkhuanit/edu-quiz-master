export interface Question {
  id: number;
  topic: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizSettings {
  numberOfQuestions: number;
  shuffleQuestions: boolean;
  selectedTopics: string[];
  timeLimit: number; // in minutes, 0 = no limit
}

export interface QuizState {
  questions: Question[];
  allQuestions: Question[];
  currentIndex: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  isFinished: boolean;
  viewMode: 'home' | 'upload' | 'create' | 'settings' | 'quiz' | 'result';
  settings: QuizSettings;
  startTime: number | null;
  endTime: number | null;
}

export type AnswerOption = 'A' | 'B' | 'C' | 'D';
