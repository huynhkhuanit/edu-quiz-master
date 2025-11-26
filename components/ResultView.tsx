import React from 'react';
import { Question } from '../types';

interface ResultViewProps {
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ questions, userAnswers, onRestart }) => {
  const correctCount = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
  const score = Math.round((correctCount / questions.length) * 10);
  
  let message = "Cần cố gắng hơn!";
  let color = "text-red-600";
  if (score >= 8) {
      message = "Xuất sắc!";
      color = "text-green-600";
  } else if (score >= 5) {
      message = "Khá tốt!";
      color = "text-blue-600";
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Kết quả bài thi</h2>
        <div className={`text-5xl font-extrabold ${color} mb-4`}>{score}/10</div>
        <p className="text-xl text-slate-600 font-medium">{message}</p>
        <p className="text-slate-400 mt-2">Bạn trả lời đúng {correctCount} trên {questions.length} câu hỏi.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10 text-left">
        {/* Simple breakdown could go here, but sticking to summary for cleaner UI */}
      </div>

      <div className="space-y-4">
        <button
            onClick={onRestart}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-transform transform active:scale-95 shadow-lg shadow-indigo-200"
        >
            Làm bài mới
        </button>
      </div>

      {/* Detailed Review List */}
      <div className="mt-12 text-left">
          <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Chi tiết đáp án</h3>
          <div className="space-y-6">
              {questions.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                      <div key={q.id} className={`p-4 rounded-xl border-l-4 ${isCorrect ? 'border-green-500 bg-green-50/50' : 'border-red-500 bg-red-50/50'}`}>
                          <div className="flex justify-between mb-2">
                              <span className="font-bold text-slate-700">Câu {idx + 1}</span>
                              <span className={`text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  {isCorrect ? 'Đúng' : 'Sai'}
                              </span>
                          </div>
                          <p className="text-slate-800 mb-2">{q.text}</p>
                          <div className="text-sm text-slate-600 grid grid-cols-2 gap-2">
                                <div>
                                    <span className="font-semibold">Bạn chọn: </span> 
                                    {userAnswer ? `${userAnswer}. ${q.options[userAnswer]}` : 'Chưa trả lời'}
                                </div>
                                {!isCorrect && (
                                    <div className="text-green-700">
                                        <span className="font-semibold">Đáp án đúng: </span>
                                        {q.correctAnswer}. {q.options[q.correctAnswer]}
                                    </div>
                                )}
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>
    </div>
  );
};

export default ResultView;