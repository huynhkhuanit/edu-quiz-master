import React, { useState, useCallback } from 'react';
import { LayoutGrid, ArrowLeft, ArrowRight } from 'lucide-react';
import { Question, QuizState, QuizSettings } from './types';
import FileUpload from './components/FileUpload';
import QuizCard from './components/QuizCard';
import ResultView from './components/ResultView';
import QuizSettingsComponent from './components/QuizSettings';
import QuestionNavigator from './components/QuestionNavigator';
import Timer from './components/Timer';
import { generateSampleData } from './services/excelService';

// Utility function to shuffle array
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

const App: React.FC = () => {
  const [gameState, setGameState] = useState<QuizState>({
    questions: [],
    allQuestions: [],
    currentIndex: 0,
    userAnswers: {},
    score: 0,
    isFinished: false,
    viewMode: 'upload',
    settings: defaultSettings,
    startTime: null,
    endTime: null,
  });

  const [showNavigator, setShowNavigator] = useState(false);

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
    // Filter questions by selected topics
    let filteredQuestions = gameState.allQuestions.filter(
      q => settings.selectedTopics.includes(q.topic)
    );

    // Shuffle if needed
    if (settings.shuffleQuestions) {
      filteredQuestions = shuffleArray(filteredQuestions);
    }

    // Limit number of questions
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

  const handleBackToUpload = () => {
    setGameState(prev => ({
      ...prev,
      viewMode: 'upload',
      allQuestions: [],
      questions: [],
    }));
  };

  const handleAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    const currentQuestion = gameState.questions[gameState.currentIndex];
    
    setGameState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentQuestion.id]: answer
      }
    }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < gameState.questions.length) {
      setGameState(prev => ({
        ...prev,
        currentIndex: index
      }));
    }
  };

  const nextQuestion = () => {
    if (gameState.currentIndex < gameState.questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
    } else {
      finishQuiz();
    }
  };

  const prevQuestion = () => {
    if (gameState.currentIndex > 0) {
      setGameState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      }));
    }
  };

  const finishQuiz = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isFinished: true,
      viewMode: 'results',
      endTime: Date.now(),
    }));
    setShowNavigator(false);
  }, []);

  const restartQuiz = () => {
    setGameState({
      questions: [],
      allQuestions: [],
      currentIndex: 0,
      userAnswers: {},
      score: 0,
      isFinished: false,
      viewMode: 'upload',
      settings: defaultSettings,
      startTime: null,
      endTime: null,
    });
  };

  const loadSample = () => {
    handleDataLoaded(generateSampleData());
  };

  // Progress calculation
  const progress = gameState.questions.length > 0 
    ? ((gameState.currentIndex + 1) / gameState.questions.length) * 100 
    : 0;

  // Answered count
  const answeredCount = Object.keys(gameState.userAnswers).length;

  // Time elapsed calculation
  const timeElapsed = gameState.startTime && gameState.endTime
    ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-20">
      {/* Navbar / Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">EduQuiz</span>
          </div>

          {/* Quiz Mode Controls */}
          {gameState.viewMode === 'quiz' && (
            <div className="flex items-center space-x-3">
              {/* Timer */}
              <Timer
                timeLimit={gameState.settings.timeLimit}
                startTime={gameState.startTime}
                onTimeUp={finishQuiz}
                isRunning={!gameState.isFinished}
              />

              {/* Question Navigator Button */}
              <button
                onClick={() => setShowNavigator(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-medium text-slate-600 transition-colors"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">{answeredCount}/{gameState.questions.length}</span>
              </button>

              {/* Finish Button */}
              <button 
                onClick={finishQuiz} 
                className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
              >
                Kết thúc
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {gameState.viewMode === 'quiz' && (
          <div className="w-full bg-slate-100 h-1.5">
            <div 
              className="bg-indigo-600 h-1.5 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Upload View */}
        {gameState.viewMode === 'upload' && (
          <div className="space-y-8">
            <FileUpload onDataLoaded={handleDataLoaded} />
            <div className="text-center">
              <button 
                onClick={loadSample}
                className="text-sm text-slate-500 underline hover:text-indigo-600"
              >
                Sử dụng dữ liệu mẫu (Thử nghiệm)
              </button>
            </div>
          </div>
        )}

        {/* Settings View */}
        {gameState.viewMode === 'settings' && (
          <QuizSettingsComponent
            questions={gameState.allQuestions}
            onStartQuiz={handleStartQuiz}
            onBack={handleBackToUpload}
          />
        )}

        {/* Quiz View */}
        {gameState.viewMode === 'quiz' && (
          <div className="space-y-6">
            <QuizCard
              question={gameState.questions[gameState.currentIndex]}
              currentNumber={gameState.currentIndex + 1}
              totalQuestions={gameState.questions.length}
              onAnswer={handleAnswer}
              selectedAnswer={gameState.userAnswers[gameState.questions[gameState.currentIndex].id]}
            />
            
            {/* Navigation Buttons */}
            <div className="flex justify-center items-center space-x-4 pt-4">
              {/* Previous Button */}
              <button
                onClick={prevQuestion}
                disabled={gameState.currentIndex === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Câu trước</span>
              </button>

              {/* Next/Finish Button */}
              <button
                onClick={nextQuestion}
                disabled={gameState.userAnswers[gameState.questions[gameState.currentIndex].id] === undefined}
                className="flex items-center space-x-2 bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>{gameState.currentIndex === gameState.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Navigation Info */}
            <div className="text-center text-sm text-slate-400">
              Nhấn vào nút điều hướng trên navbar để nhảy tới câu bất kỳ
            </div>
          </div>
        )}

        {/* Results View */}
        {gameState.viewMode === 'results' && (
          <ResultView 
            questions={gameState.questions}
            userAnswers={gameState.userAnswers}
            onRestart={restartQuiz}
            timeElapsed={timeElapsed}
          />
        )}
      </main>

      {/* Question Navigator Modal */}
      {showNavigator && gameState.viewMode === 'quiz' && (
        <QuestionNavigator
          totalQuestions={gameState.questions.length}
          currentIndex={gameState.currentIndex}
          answeredQuestions={gameState.userAnswers}
          questionIds={gameState.questions.map(q => q.id)}
          onNavigate={goToQuestion}
          onClose={() => setShowNavigator(false)}
        />
      )}
    </div>
  );
};

export default App;