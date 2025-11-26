import React, { useState } from 'react';
import { Question, QuizState } from './types';
import FileUpload from './components/FileUpload';
import QuizCard from './components/QuizCard';
import ResultView from './components/ResultView';
import { generateSampleData } from './services/excelService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    userAnswers: {},
    score: 0,
    isFinished: false,
    viewMode: 'upload'
  });

  const handleDataLoaded = (questions: Question[]) => {
    setGameState({
      questions,
      currentIndex: 0,
      userAnswers: {},
      score: 0,
      isFinished: false,
      viewMode: 'quiz'
    });
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

  const finishQuiz = () => {
    setGameState(prev => ({
      ...prev,
      isFinished: true,
      viewMode: 'results'
    }));
  };

  const restartQuiz = () => {
    setGameState({
      questions: [],
      currentIndex: 0,
      userAnswers: {},
      score: 0,
      isFinished: false,
      viewMode: 'upload'
    });
  };

  const loadSample = () => {
      handleDataLoaded(generateSampleData());
  }

  // Progress calculation
  const progress = gameState.questions.length > 0 
    ? ((gameState.currentIndex + 1) / gameState.questions.length) * 100 
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
          {gameState.viewMode === 'quiz' && (
             <button onClick={finishQuiz} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
                 Kết thúc bài thi
             </button>
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

        {gameState.viewMode === 'quiz' && (
          <div className="space-y-6">
            <QuizCard
              question={gameState.questions[gameState.currentIndex]}
              currentNumber={gameState.currentIndex + 1}
              totalQuestions={gameState.questions.length}
              onAnswer={handleAnswer}
              selectedAnswer={gameState.userAnswers[gameState.questions[gameState.currentIndex].id]}
            />
            
            <div className="flex justify-center pt-4">
                <button
                    onClick={nextQuestion}
                    disabled={gameState.userAnswers[gameState.questions[gameState.currentIndex].id] === undefined}
                    className="flex items-center space-x-2 bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <span>{gameState.currentIndex === gameState.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>
          </div>
        )}

        {gameState.viewMode === 'results' && (
          <ResultView 
            questions={gameState.questions}
            userAnswers={gameState.userAnswers}
            onRestart={restartQuiz}
          />
        )}
      </main>
    </div>
  );
};

export default App;