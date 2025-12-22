import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, ArrowLeft, ArrowRight, Home, Flag } from 'lucide-react';
import { Question, QuizState, QuizSettings, AnswerOption } from '@/types';
import HomeView from '@/components/HomeView';
import FileUpload from '@/components/FileUpload';
import QuestionCreator from '@/components/QuestionCreator';
import QuizCard from '@/components/QuizCard';
import ResultView from '@/components/ResultView';
import QuizSettingsComponent from '@/components/QuizSettings';
import QuestionNavigator from '@/components/QuestionNavigator';
import Timer from '@/components/Timer';
import Header from '@/components/Header';
import ExcelTemplateHelper from '@/components/ExcelTemplateHelper';
import ExcelWizard from '@/components/ExcelWizard';
import QuizHistory from '@/components/QuizHistory';
import { generateSampleData } from '@/services/excelService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const defaultSettings: QuizSettings = {
  numberOfQuestions: 10,
  shuffleQuestions: true,
  selectedTopics: [],
  timeLimit: 0,
};

type ViewMode = 'home' | 'upload' | 'create' | 'settings' | 'quiz' | 'result' | 'excel-help' | 'excel-wizard';

const Index: React.FC = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<QuizState>({
    questions: [],
    allQuestions: [],
    currentIndex: 0,
    userAnswers: {},
    score: 0,
    isFinished: false,
    viewMode: 'home',
    settings: defaultSettings,
    startTime: null,
    endTime: null,
  });

  const [showNavigator, setShowNavigator] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('home');

  const handleDataLoaded = (questions: Question[]) => {
    setGameState(prev => ({
      ...prev,
      allQuestions: questions,
      viewMode: 'settings',
      settings: {
        ...prev.settings,
        selectedTopics: [...new Set(questions.map(q => q.topic))],
        numberOfQuestions: Math.min(10, questions.length),
      }
    }));
  };

  const handleStartQuiz = (settings: QuizSettings) => {
    let filteredQuestions = gameState.allQuestions.filter(
      q => settings.selectedTopics.includes(q.topic)
    );

    if (settings.shuffleQuestions) {
      filteredQuestions = shuffleArray(filteredQuestions);
    }

    filteredQuestions = filteredQuestions.slice(0, settings.numberOfQuestions);

    setGameState(prev => ({
      ...prev,
      questions: filteredQuestions,
      currentIndex: 0,
      userAnswers: {},
      score: 0,
      isFinished: false,
      viewMode: 'quiz',
      settings,
      startTime: Date.now(),
      endTime: null,
    }));
  };

  const handleAnswer = useCallback((answer: AnswerOption) => {
    const currentQuestion = gameState.questions[gameState.currentIndex];
    
    setGameState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentQuestion.id]: answer
      },
      score: answer === currentQuestion.correctAnswer ? prev.score + 1 : prev.score
    }));
  }, [gameState.questions, gameState.currentIndex]);

  const handleNext = useCallback(() => {
    if (gameState.currentIndex < gameState.questions.length - 1) {
      setGameState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    }
  }, [gameState.currentIndex, gameState.questions.length]);

  const handlePrevious = useCallback(() => {
    if (gameState.currentIndex > 0) {
      setGameState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  }, [gameState.currentIndex]);

  const handleFinish = useCallback(async () => {
    const endTime = Date.now();
    const startTime = gameState.startTime || endTime;
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    
    // Calculate correct answers
    const correctCount = gameState.questions.filter(
      q => gameState.userAnswers[q.id] === q.correctAnswer
    ).length;

    setGameState(prev => ({
      ...prev,
      isFinished: true,
      viewMode: 'result',
      endTime
    }));

    // Save to database if user is logged in
    if (user) {
      try {
        const { error } = await supabase.from('quiz_history').insert({
          user_id: user.id,
          total_questions: gameState.questions.length,
          correct_answers: correctCount,
          time_spent: timeSpent,
        });

        if (error) {
          console.error('Error saving quiz result:', error);
        } else {
          toast.success('Đã lưu kết quả bài thi!');
        }
      } catch (err) {
        console.error('Error saving quiz result:', err);
      }
    }
  }, [gameState.questions, gameState.userAnswers, gameState.startTime, user]);

  const handleTimeUp = useCallback(() => {
    handleFinish();
  }, [handleFinish]);

  const handleNavigate = useCallback((index: number) => {
    setGameState(prev => ({ ...prev, currentIndex: index }));
  }, []);

  const handleRestart = () => {
    setGameState(prev => ({
      ...prev,
      viewMode: 'settings',
    }));
  };

  const handleHome = () => {
    setGameState({
      questions: [],
      allQuestions: [],
      currentIndex: 0,
      userAnswers: {},
      score: 0,
      isFinished: false,
      viewMode: 'home',
      settings: defaultSettings,
      startTime: null,
      endTime: null,
    });
  };

  const handleUseSample = () => {
    const sampleData = generateSampleData();
    handleDataLoaded(sampleData);
  };

  const currentQuestion = gameState.questions[gameState.currentIndex];
  const isCurrentAnswered = currentQuestion ? gameState.userAnswers[currentQuestion.id] !== undefined : false;
  const allAnswered = gameState.questions.length > 0 && 
    gameState.questions.every(q => gameState.userAnswers[q.id] !== undefined);

  const timeElapsed = gameState.startTime && gameState.endTime
    ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header onShowHistory={() => setShowHistory(true)} />
      
      <AnimatePresence mode="wait">
        {gameState.viewMode === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HomeView
              onUpload={() => setGameState(prev => ({ ...prev, viewMode: 'upload' }))}
              onCreate={() => setGameState(prev => ({ ...prev, viewMode: 'create' }))}
              onUseSample={handleUseSample}
              onShowExcelHelp={() => setGameState(prev => ({ ...prev, viewMode: 'excel-help' as any }))}
              onShowWizard={() => setGameState(prev => ({ ...prev, viewMode: 'excel-wizard' as any }))}
            />
          </motion.div>
        )}

        {gameState.viewMode === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-4xl mx-auto px-4 py-12"
          >
            <Button
              variant="ghost"
              onClick={handleHome}
              className="mb-8 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <FileUpload onDataLoaded={handleDataLoaded} />
          </motion.div>
        )}

        {gameState.viewMode === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-4xl mx-auto px-4 py-12"
          >
            <QuestionCreator
              onQuestionsCreated={handleDataLoaded}
              onBack={handleHome}
            />
          </motion.div>
        )}

        {gameState.viewMode === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-4xl mx-auto px-4 py-12"
          >
            <QuizSettingsComponent
              questions={gameState.allQuestions}
              onStartQuiz={handleStartQuiz}
              onBack={handleHome}
            />
          </motion.div>
        )}

        {gameState.viewMode === 'quiz' && currentQuestion && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            {/* Quiz Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
              <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHome}
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Trang chủ</span>
                </Button>

                <Timer
                  timeLimit={gameState.settings.timeLimit}
                  startTime={gameState.startTime}
                  onTimeUp={handleTimeUp}
                  isRunning={!gameState.isFinished}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNavigator(true)}
                  className="gap-2"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Điều hướng</span>
                </Button>
              </div>

              {/* Progress */}
              <div className="h-1 bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((gameState.currentIndex + 1) / gameState.questions.length) * 100}%` }}
                  className="h-full gradient-primary"
                />
              </div>
            </header>

            {/* Quiz Content */}
            <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
              <QuizCard
                question={currentQuestion}
                currentNumber={gameState.currentIndex + 1}
                totalQuestions={gameState.questions.length}
                onAnswer={handleAnswer}
                selectedAnswer={gameState.userAnswers[currentQuestion.id]}
              />
            </main>

            {/* Quiz Footer */}
            <footer className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border">
              <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={gameState.currentIndex === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Trước</span>
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{gameState.currentIndex + 1}</span>
                  <span>/</span>
                  <span>{gameState.questions.length}</span>
                </div>

                {gameState.currentIndex === gameState.questions.length - 1 || allAnswered ? (
                  <Button
                    onClick={handleFinish}
                    className="gap-2 gradient-success text-success-foreground hover:opacity-90"
                  >
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline">Nộp bài</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!isCurrentAnswered}
                    className="gap-2"
                  >
                    <span className="hidden sm:inline">Tiếp</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </footer>

            {/* Navigator Modal */}
            <AnimatePresence>
              {showNavigator && (
                <QuestionNavigator
                  totalQuestions={gameState.questions.length}
                  currentIndex={gameState.currentIndex}
                  answeredQuestions={gameState.userAnswers}
                  questionIds={gameState.questions.map(q => q.id)}
                  onNavigate={handleNavigate}
                  onClose={() => setShowNavigator(false)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState.viewMode === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-4xl mx-auto px-4 py-12"
          >
            <ResultView
              questions={gameState.questions}
              userAnswers={gameState.userAnswers}
              onRestart={handleRestart}
              onHome={handleHome}
              timeElapsed={timeElapsed}
            />
          </motion.div>
        )}

        {(gameState.viewMode as string) === 'excel-help' && (
          <motion.div
            key="excel-help"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-4xl mx-auto px-4 py-12"
          >
            <Button
              variant="ghost"
              onClick={handleHome}
              className="mb-8 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <ExcelTemplateHelper />
          </motion.div>
        )}

        {(gameState.viewMode as string) === 'excel-wizard' && (
          <motion.div
            key="excel-wizard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-4xl mx-auto px-4 py-12"
          >
            <ExcelWizard
              onComplete={handleDataLoaded}
              onBack={handleHome}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && user && (
          <QuizHistory onClose={() => setShowHistory(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
