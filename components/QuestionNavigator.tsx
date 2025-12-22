import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  answeredQuestions: Record<number, string>;
  questionIds: number[];
  onNavigate: (index: number) => void;
  onClose: () => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  questionIds,
  onNavigate,
  onClose
}) => {
  const getButtonStyle = (index: number) => {
    const questionId = questionIds[index];
    const isAnswered = answeredQuestions[questionId] !== undefined;
    const isCurrent = index === currentIndex;

    if (isCurrent) {
      return 'gradient-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background';
    }
    if (isAnswered) {
      return 'gradient-success text-success-foreground';
    }
    return 'bg-muted text-muted-foreground hover:bg-muted/80';
  };

  const answeredCount = questionIds.filter(id => answeredQuestions[id] !== undefined).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden border border-border"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gradient-primary p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-primary-foreground">Điều hướng câu hỏi</h3>
            <p className="text-primary-foreground/80 text-sm">
              Đã trả lời {answeredCount}/{totalQuestions} câu
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Progress Legend */}
        <div className="px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded gradient-success"></span>
              <span className="text-muted-foreground">Đã trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-muted border border-border"></span>
              <span className="text-muted-foreground">Chưa trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded gradient-primary ring-2 ring-primary/30"></span>
              <span className="text-muted-foreground">Hiện tại</span>
            </div>
          </div>
        </div>

        {/* Question Grid */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalQuestions }, (_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onNavigate(index);
                  onClose();
                }}
                className={`
                  aspect-square rounded-lg font-semibold text-sm
                  transition-all ${getButtonStyle(index)}
                `}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Tiến độ</span>
            <span className="font-semibold text-foreground">
              {Math.round((answeredCount / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full gradient-success rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuestionNavigator;
