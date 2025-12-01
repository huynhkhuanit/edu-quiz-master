import React, { useMemo, useState } from 'react';
import { 
  Trophy, 
  ThumbsUp, 
  Frown, 
  RefreshCcw, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  BarChart3, 
  FileText,
  CheckCircle2,
  XCircle,
  Check,
  X
} from 'lucide-react';
import { Question } from '../types';

interface ResultViewProps {
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  onRestart: () => void;
  timeElapsed?: number; // in seconds
}

const ResultView: React.FC<ResultViewProps> = ({ questions, userAnswers, onRestart, timeElapsed }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [filterTopic, setFilterTopic] = useState<string | null>(null);

  const correctCount = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
  const score = Math.round((correctCount / questions.length) * 10);
  
  // Statistics by topic
  const topicStats = useMemo(() => {
    const stats: Record<string, { total: number; correct: number }> = {};
    questions.forEach(q => {
      if (!stats[q.topic]) {
        stats[q.topic] = { total: 0, correct: 0 };
      }
      stats[q.topic].total++;
      if (userAnswers[q.id] === q.correctAnswer) {
        stats[q.topic].correct++;
      }
    });
    return stats;
  }, [questions, userAnswers]);

  const topics = Object.keys(topicStats);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  // Filter questions by topic
  const displayedQuestions = filterTopic 
    ? questions.filter(q => q.topic === filterTopic)
    : questions;

  let message = "Cần cố gắng hơn!";
  let color = "text-red-600";
  let bgColor = "bg-red-50";
  let ScoreIcon = Frown;
  if (score >= 8) {
      message = "Xuất sắc!";
      color = "text-green-600";
      bgColor = "bg-green-50";
      ScoreIcon = Trophy;
  } else if (score >= 5) {
      message = "Khá tốt!";
      color = "text-blue-600";
      bgColor = "bg-blue-50";
      ScoreIcon = ThumbsUp;
  }

  // Export results to text
  const exportResults = () => {
    let content = `KẾT QUẢ BÀI THI - EduQuiz Master\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `📊 TỔNG QUAN\n`;
    content += `-`.repeat(30) + '\n';
    content += `Điểm số: ${score}/10\n`;
    content += `Số câu đúng: ${correctCount}/${questions.length}\n`;
    if (timeElapsed) content += `Thời gian: ${formatTime(timeElapsed)}\n`;
    content += `\n`;
    
    content += `📈 THỐNG KÊ THEO CHỦ ĐỀ\n`;
    content += `-`.repeat(30) + '\n';
    Object.entries(topicStats).forEach(([topic, stats]) => {
      const percent = Math.round((stats.correct / stats.total) * 100);
      content += `${topic}: ${stats.correct}/${stats.total} (${percent}%)\n`;
    });
    content += `\n`;

    content += `📝 CHI TIẾT ĐÁP ÁN\n`;
    content += `-`.repeat(30) + '\n';
    questions.forEach((q, idx) => {
      const userAnswer = userAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      content += `\nCâu ${idx + 1}: ${isCorrect ? '✓ Đúng' : '✗ Sai'}\n`;
      content += `Câu hỏi: ${q.text}\n`;
      content += `Bạn chọn: ${userAnswer || 'Không trả lời'}\n`;
      if (!isCorrect) content += `Đáp án đúng: ${q.correctAnswer}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ket-qua-bai-thi-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Score Card */}
      <div className={`bg-white rounded-3xl shadow-xl overflow-hidden`}>
        <div className={`${bgColor} p-8 text-center border-b`}>
          <div className="flex justify-center mb-4">
            <ScoreIcon className={`w-16 h-16 ${color}`} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Kết quả bài thi</h2>
          <div className={`text-6xl font-extrabold ${color} mb-4`}>{score}/10</div>
          <p className={`text-xl font-medium ${color}`}>{message}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-b">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{correctCount}</div>
            <div className="text-sm text-slate-500">Câu đúng</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{questions.length - correctCount}</div>
            <div className="text-sm text-slate-500">Câu sai</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-700">{questions.length}</div>
            <div className="text-sm text-slate-500">Tổng câu</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {timeElapsed ? formatTime(timeElapsed) : '--:--'}
            </div>
            <div className="text-sm text-slate-500">Thời gian</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-transform transform active:scale-95 shadow-lg shadow-indigo-200"
          >
            <RefreshCcw className="w-4 h-4" /> Làm bài mới
          </button>
          <button
            onClick={exportResults}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-transform transform active:scale-95"
          >
            <Download className="w-4 h-4" /> Xuất kết quả
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-transform transform active:scale-95"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
          </button>
        </div>
      </div>

      {/* Topic Statistics */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" /> Thống kê theo chủ đề
        </h3>
        <div className="space-y-3">
          {Object.entries(topicStats).map(([topic, stats]) => {
            const percent = Math.round((stats.correct / stats.total) * 100);
            let barColor = 'bg-red-500';
            if (percent >= 80) barColor = 'bg-green-500';
            else if (percent >= 50) barColor = 'bg-yellow-500';
            
            return (
              <div key={topic} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700">{topic}</span>
                  <span className="text-sm text-slate-500">
                    {stats.correct}/{stats.total} ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Review */}
      {showDetails && (
        <div className="bg-white rounded-3xl shadow-xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Chi tiết đáp án
            </h3>
            
            {/* Topic Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">Lọc:</span>
              <select
                value={filterTopic || ''}
                onChange={(e) => setFilterTopic(e.target.value || null)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tất cả chủ đề</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {displayedQuestions.map((q, idx) => {
              const userAnswer = userAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              const originalIndex = questions.findIndex(oq => oq.id === q.id);
              
              return (
                <div 
                  key={q.id} 
                  className={`p-4 rounded-xl border-l-4 transition-all ${
                    isCorrect 
                      ? 'border-green-500 bg-green-50/50' 
                      : 'border-red-500 bg-red-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-700">Câu {originalIndex + 1}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">
                        {q.topic}
                      </span>
                    </div>
                    <span className={`text-sm font-bold flex items-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Đúng
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Sai
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-slate-800 mb-3 font-medium">{q.text}</p>
                  
                  {/* Options Review */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {(['A', 'B', 'C', 'D'] as const).map(opt => {
                      const isUserAnswer = userAnswer === opt;
                      const isCorrectAnswer = q.correctAnswer === opt;
                      
                      let optStyle = 'bg-white border-slate-200';
                      if (isCorrectAnswer) optStyle = 'bg-green-100 border-green-300 text-green-700';
                      if (isUserAnswer && !isCorrectAnswer) optStyle = 'bg-red-100 border-red-300 text-red-700';
                      
                      return (
                        <div 
                          key={opt}
                          className={`px-3 py-2 rounded-lg border ${optStyle} flex items-center`}
                        >
                          <span className="font-bold mr-2">{opt}.</span>
                          <span className="flex-1">{q.options[opt]}</span>
                          {isCorrectAnswer && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;