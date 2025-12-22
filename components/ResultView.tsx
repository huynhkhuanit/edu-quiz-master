import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  ThumbsUp, 
  Frown, 
  RefreshCcw, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  BarChart3,
  CheckCircle2,
  XCircle,
  Home
} from 'lucide-react';
import { Question, AnswerOption } from '@/types';
import { Button } from '@/components/ui/button';

interface ResultViewProps {
  questions: Question[];
  userAnswers: Record<number, AnswerOption>;
  onRestart: () => void;
  onHome: () => void;
  timeElapsed?: number;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  questions, 
  userAnswers, 
  onRestart, 
  onHome,
  timeElapsed 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [filterTopic, setFilterTopic] = useState<string | null>(null);

  const correctCount = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
  const score = Math.round((correctCount / questions.length) * 10);
  
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const displayedQuestions = filterTopic 
    ? questions.filter(q => q.topic === filterTopic)
    : questions;

  let message = "Cần cố gắng hơn!";
  let gradientClass = "from-destructive to-destructive/80";
  let ScoreIcon = Frown;
  
  if (score >= 8) {
    message = "Xuất sắc!";
    gradientClass = "from-success to-secondary";
    ScoreIcon = Trophy;
  } else if (score >= 5) {
    message = "Khá tốt!";
    gradientClass = "from-primary to-secondary";
    ScoreIcon = ThumbsUp;
  }

  const exportResults = () => {
    let content = `KẾT QUẢ BÀI THI - EduQuiz\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `📊 TỔNG QUAN\n`;
    content += `-`.repeat(30) + '\n';
    content += `Điểm số: ${score}/10\n`;
    content += `Số câu đúng: ${correctCount}/${questions.length}\n`;
    if (timeElapsed) content += `Thời gian: ${formatTime(timeElapsed)}\n`;
    content += `\n`;
    
    content += `📋 THỐNG KÊ THEO CHỦ ĐỀ\n`;
    content += `-`.repeat(30) + '\n';
    topics.forEach(topic => {
      const stats = topicStats[topic];
      const percentage = Math.round((stats.correct / stats.total) * 100);
      content += `${topic}: ${stats.correct}/${stats.total} (${percentage}%)\n`;
    });
    content += `\n`;

    content += `📝 CHI TIẾT CÂU TRẢ LỜI\n`;
    content += `-`.repeat(30) + '\n';
    questions.forEach((q, index) => {
      const userAnswer = userAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      content += `\nCâu ${index + 1}: ${isCorrect ? '✓' : '✗'}\n`;
      content += `${q.text}\n`;
      content += `Đáp án của bạn: ${userAnswer || 'Chưa trả lời'}\n`;
      if (!isCorrect) content += `Đáp án đúng: ${q.correctAnswer}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ket-qua-bai-thi-${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Score Card */}
      <div className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-8 text-center shadow-xl mb-8`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mx-auto bg-primary-foreground/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm"
        >
          <ScoreIcon className="w-12 h-12 text-primary-foreground" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2"
        >
          {score}/10
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-primary-foreground/90 font-medium mb-4"
        >
          {message}
        </motion.p>
        
        <div className="flex flex-wrap justify-center gap-4 text-primary-foreground/80 text-sm">
          <span className="bg-primary-foreground/20 px-4 py-2 rounded-full backdrop-blur-sm">
            {correctCount}/{questions.length} câu đúng
          </span>
          {timeElapsed && (
            <span className="bg-primary-foreground/20 px-4 py-2 rounded-full backdrop-blur-sm">
              ⏱️ {formatTime(timeElapsed)}
            </span>
          )}
        </div>
      </div>

      {/* Topic Stats */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Thống kê theo chủ đề</h2>
        </div>

        <div className="space-y-4">
          {topics.map((topic) => {
            const stats = topicStats[topic];
            const percentage = Math.round((stats.correct / stats.total) * 100);
            
            return (
              <div key={topic} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{topic}</span>
                  <span className="text-muted-foreground">
                    {stats.correct}/{stats.total} ({percentage}%)
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className={`h-full rounded-full ${
                      percentage >= 80 ? 'gradient-success' :
                      percentage >= 50 ? 'gradient-primary' :
                      'bg-destructive'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Toggle */}
      <Button
        variant="outline"
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mb-4 justify-between"
      >
        <span>Xem chi tiết câu trả lời</span>
        {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </Button>

      {/* Detailed Results */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-8"
        >
          {/* Filter */}
          <div className="p-4 bg-muted/50 border-b border-border">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTopic(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterTopic === null ? 'gradient-primary text-primary-foreground' : 'bg-card text-muted-foreground'
                }`}
              >
                Tất cả
              </button>
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setFilterTopic(topic)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterTopic === topic ? 'gradient-primary text-primary-foreground' : 'bg-card text-muted-foreground'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {displayedQuestions.map((q, index) => {
              const userAnswer = userAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              
              return (
                <div key={q.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}
                    `}>
                      {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-2">{q.text}</p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className={`px-2 py-1 rounded ${
                          isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}>
                          Bạn chọn: {userAnswer || '-'}
                        </span>
                        {!isCorrect && (
                          <span className="px-2 py-1 rounded bg-success/10 text-success">
                            Đáp án: {q.correctAnswer}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={onHome} className="flex-1 gap-2">
          <Home className="w-5 h-5" />
          Về trang chủ
        </Button>
        <Button variant="outline" onClick={exportResults} className="flex-1 gap-2">
          <Download className="w-5 h-5" />
          Tải kết quả
        </Button>
        <Button onClick={onRestart} className="flex-1 gap-2 gradient-primary text-primary-foreground hover:opacity-90">
          <RefreshCcw className="w-5 h-5" />
          Làm lại
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultView;
