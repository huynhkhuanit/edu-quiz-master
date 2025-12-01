import React from 'react';
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
      return 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2';
    }
    if (isAnswered) {
      return 'bg-green-500 text-white hover:bg-green-600';
    }
    return 'bg-slate-100 text-slate-600 hover:bg-slate-200';
  };

  const answeredCount = questionIds.filter(id => answeredQuestions[id] !== undefined).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Điều hướng câu hỏi</h3>
            <p className="text-indigo-200 text-sm">
              Đã trả lời {answeredCount}/{totalQuestions} câu
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 py-3 bg-slate-50 border-b">
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded bg-green-500"></span>
              <span className="text-slate-600">Đã trả lời</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded bg-slate-200"></span>
              <span className="text-slate-600">Chưa trả lời</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded bg-indigo-600 ring-2 ring-indigo-300"></span>
              <span className="text-slate-600">Đang làm</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  onNavigate(index);
                  onClose();
                }}
                className={`w-full aspect-square rounded-lg font-semibold text-sm transition-all ${getButtonStyle(index)}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;
