import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Question, AnswerOption } from '@/types';

interface QuizCardProps {
  question: Question;
  currentNumber: number;
  totalQuestions: number;
  onAnswer: (answer: AnswerOption) => void;
  selectedAnswer: AnswerOption | undefined;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === question.correctAnswer;

  const getOptionStyle = (optionKey: AnswerOption) => {
    const isSelected = selectedAnswer === optionKey;
    const isThisCorrect = question.correctAnswer === optionKey;

    if (!isAnswered) {
      return 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer';
    }

    if (isThisCorrect) {
      return 'border-success bg-success/10 text-success';
    }

    if (isSelected && !isThisCorrect) {
      return 'border-destructive bg-destructive/10 text-destructive';
    }

    return 'border-border bg-muted/50 opacity-60';
  };

  const getOptionIcon = (optionKey: AnswerOption) => {
    if (!isAnswered) return null;

    const isThisCorrect = question.correctAnswer === optionKey;
    const isSelected = selectedAnswer === optionKey;

    if (isThisCorrect) {
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    }

    if (isSelected && !isThisCorrect) {
      return <XCircle className="w-5 h-5 text-destructive" />;
    }

    return null;
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Header */}
        <div className="gradient-primary px-6 py-4 flex justify-between items-center">
          <span className="text-primary-foreground font-medium opacity-90">{question.topic}</span>
          <span className="bg-primary-foreground/20 px-4 py-1.5 rounded-full text-sm font-semibold text-primary-foreground backdrop-blur-sm">
            Câu {currentNumber} / {totalQuestions}
          </span>
        </div>

        {/* Question Body */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map((optionKey, index) => {
              const optionText = question[`option${optionKey}` as keyof Question] as string;
              
              return (
                <motion.button
                  key={optionKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => !isAnswered && onAnswer(optionKey)}
                  disabled={isAnswered}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left transition-all
                    flex items-center gap-4 group
                    ${getOptionStyle(optionKey)}
                  `}
                >
                  <span className={`
                    w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm
                    transition-all flex-shrink-0
                    ${selectedAnswer === optionKey || (!isAnswered && 'group-hover:bg-primary group-hover:text-primary-foreground')
                      ? question.correctAnswer === optionKey && isAnswered
                        ? 'bg-success text-success-foreground'
                        : selectedAnswer === optionKey && isAnswered
                          ? 'bg-destructive text-destructive-foreground'
                          : 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {optionKey}
                  </span>
                  <span className="flex-1 text-foreground font-medium">{optionText}</span>
                  {getOptionIcon(optionKey)}
                </motion.button>
              );
            })}
          </div>

          {/* Result Feedback */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`
                  mt-6 p-4 rounded-xl flex items-center gap-3
                  ${isCorrect 
                    ? 'bg-success/10 border border-success/20' 
                    : 'bg-destructive/10 border border-destructive/20'
                  }
                `}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-success">Chính xác!</p>
                      <p className="text-sm text-success/80">Bạn đã trả lời đúng câu hỏi này.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-destructive">Chưa đúng</p>
                      <p className="text-sm text-destructive/80">
                        Đáp án đúng là: <strong>{question.correctAnswer}</strong>
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizCard;
