import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { CheckCircle2, XCircle, Sparkles, Loader2 } from 'lucide-react';
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
                  <CheckCircle2 className="w-6 h-6 ml-auto text-green-600" />
                )}
                 {isAnswered && isSelected && !isThisCorrect && (
                  <XCircle className="w-6 h-6 ml-auto text-red-600" />
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
                        <Sparkles className="w-5 h-5 mr-2" />
                        Phân tích chuyên sâu (Hỏi AI)
                    </button>
                 )}

                 {loadingExplanation && (
                     <div className="flex items-center text-slate-500 text-sm mb-4">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        AI đang phân tích câu trả lời...
                     </div>
                 )}

                 {explanation && (
                     <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-4 text-slate-800 text-sm leading-relaxed shadow-sm">
                         <div className="flex items-center mb-3 font-bold text-indigo-700 border-b border-indigo-100 pb-2">
                             <Sparkles className="w-5 h-5 mr-2" /> Phân tích chuyên gia:
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