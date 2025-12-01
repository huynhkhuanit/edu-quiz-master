export interface ExcelQuestionRow {
  STT: number;
  'Câu hỏi': string;
  'Đáp án A': string;
  'Đáp án B': string;
  'Đáp án C': string;
  'Đáp án D': string;
  'Đáp án đúng': string;
  'Chủ đề': string;
}

export interface Question {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  topic: string;
}

export interface QuizSettings {
  numberOfQuestions: number;
  shuffleQuestions: boolean;
  selectedTopics: string[];
  timeLimit: number; // in minutes, 0 = no limit
}

export interface QuizState {
  questions: Question[];
  allQuestions: Question[]; // Store all questions for settings
  currentIndex: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>; // Map question ID to answer
  score: number;
  isFinished: boolean;
  viewMode: 'upload' | 'settings' | 'quiz' | 'results';
  settings: QuizSettings;
  startTime: number | null; // timestamp when quiz started
  endTime: number | null; // timestamp when quiz ended
}

export enum AnswerStatus {
  Unanswered = 'unanswered',
  Correct = 'correct',
  Incorrect = 'incorrect',
}