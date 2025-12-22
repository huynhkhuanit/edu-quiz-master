import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, Trophy, Clock, Target, TrendingUp, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface QuizHistoryRecord {
  id: string;
  total_questions: number;
  correct_answers: number;
  time_spent: number;
  completed_at: string;
}

interface QuizHistoryProps {
  onClose: () => void;
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ onClose }) => {
  const [history, setHistory] = useState<QuizHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setHistory(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (correct: number, total: number) => {
    const percentage = (correct / total) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const totalQuizzes = history.length;
  const avgScore = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.correct_answers / h.total_questions) * 100, 0) / history.length)
    : 0;
  const bestScore = history.length > 0
    ? Math.round(Math.max(...history.map(h => (h.correct_answers / h.total_questions) * 100)))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[85vh] bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <History className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Lịch sử làm bài</h2>
              <p className="text-sm text-muted-foreground">Xem lại kết quả các bài thi trước</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-border bg-muted/30">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                <Target className="w-5 h-5 text-primary" />
                {totalQuizzes}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Bài đã làm</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                <TrendingUp className="w-5 h-5 text-secondary" />
                {avgScore}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Điểm TB</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-success">
                <Trophy className="w-5 h-5" />
                {bestScore}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Điểm cao nhất</p>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Chưa có lịch sử làm bài</p>
              <p className="text-sm text-muted-foreground mt-1">Hoàn thành bài thi đầu tiên để xem kết quả!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getScoreColor(record.correct_answers, record.total_questions)}`}>
                        {record.correct_answers}/{record.total_questions}
                      </span>
                      <span className="text-muted-foreground">câu đúng</span>
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {Math.round((record.correct_answers / record.total_questions) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(record.time_spent)}
                      </span>
                      <span>{formatDate(record.completed_at)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizHistory;
