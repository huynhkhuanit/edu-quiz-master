import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Question } from '../types';
import { explainAnswer } from '../services/geminiService';

interface QuizCardProps {
  question: Question;
  currentNumber: number;
  totalQuestions: number;
  onAnswer: (answer: 'A' | 'B' | 'C' | 'D') => void;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | undefined;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer
}) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  // Reset explanation when question changes
  useEffect(() => {
    setExplanation(null);
    setLoadingExplanation(false);
  }, [question.id]);

  const handleExplain = async () => {
    setLoadingExplanation(true);
    // Pass the selectedAnswer to the service for context-aware explanation
    const text = await explainAnswer(question, selectedAnswer);
    setExplanation(text);
    setLoadingExplanation(false);
  };

  const isAnswered = selectedAnswer !== undefined;
  // If answered, we still highlight if it's correct/wrong
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
        <span className="font-bold text-lg opacity-90">{question.topic}</span>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          Câu {currentNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question Body */}
      <div className="p-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
          {question.text}
        </h2>

        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as const).map((optionKey) => {
            const isSelected = selectedAnswer === optionKey;
            const isThisCorrect = question.correctAnswer === optionKey;
            
            // Logic for styling based on state (answered, correct/incorrect)
            let buttonStyle = "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700";
            
            if (isAnswered) {
              if (isSelected && isThisCorrect) {
                // Correct selected: Green border + Green bg
                buttonStyle = "border-green-500 bg-green-50 text-green-700 font-medium";
              } else if (isSelected && !isThisCorrect) {
                // Wrong selected: Single Red border + Red bg (Removed ring-2 for cleaner look)
                buttonStyle = "border-red-500 bg-red-50 text-red-700 font-medium";
              } else if (isThisCorrect) {
                 // Reveal correct answer if user was wrong: Green border
                buttonStyle = "border-green-500 bg-green-50 text-green-700";
              } else {
                // Other options: Dimmed
                buttonStyle = "border-slate-100 text-slate-400 opacity-60";
              }
            } else if (isSelected) {
               // Pre-submission selection
               buttonStyle = "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500";
            }

            return (
              <button
                key={optionKey}
                onClick={() => !isAnswered && onAnswer(optionKey)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start group ${buttonStyle}`}
              >
                <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg mr-4 font-bold text-sm border ${
                    isSelected || (isAnswered && isThisCorrect) ? 'border-current' : 'border-slate-300 group-hover:border-indigo-400'
                }`}>
                  {optionKey}
                </span>
                <span className="font-medium text-lg pt-0.5">{question.options[optionKey]}</span>
                
                {isAnswered && isThisCorrect && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-auto text-green-600">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                )}
                 {isAnswered && isSelected && !isThisCorrect && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-auto text-red-600">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Area */}
        {isAnswered && (
            <div className="mt-6 pt-6 border-t border-slate-100 animate-fade-in">
                 {/* AI Explanation Button */}
                 {!explanation && !loadingExplanation && (
                    <button 
                        onClick={handleExplain}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors mb-4 p-2 hover:bg-indigo-50 rounded-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                        Phân tích chuyên sâu (Hỏi AI)
                    </button>
                 )}

                 {loadingExplanation && (
                     <div className="flex items-center text-slate-500 text-sm mb-4">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        AI đang phân tích câu trả lời...
                     </div>
                 )}

                 {explanation && (
                     <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-4 text-slate-800 text-sm leading-relaxed shadow-sm">
                         <div className="flex items-center mb-3 font-bold text-indigo-700 border-b border-indigo-100 pb-2">
                             <span className="mr-2 text-xl">✨</span> Phân tích chuyên gia:
                         </div>
                         <div className="markdown-body">
                             <Markdown>{explanation}</Markdown>
                         </div>
                     </div>
                 )}
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;