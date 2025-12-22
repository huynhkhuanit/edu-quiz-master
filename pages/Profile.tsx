import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  ArrowLeft,
  Edit2,
  Save,
  X,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuizStats {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  averageScore: number;
  bestScore: number;
}

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    totalTime: 0,
    averageScore: 0,
    bestScore: 0
  });
  const [profile, setProfile] = useState<Profile>({ display_name: null, avatar_url: null });
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setNewDisplayName(profileData.display_name || '');
      }

      // Fetch quiz history stats
      const { data: historyData } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('user_id', user.id);

      if (historyData && historyData.length > 0) {
        const totalQuizzes = historyData.length;
        const totalQuestions = historyData.reduce((sum, h) => sum + h.total_questions, 0);
        const correctAnswers = historyData.reduce((sum, h) => sum + h.correct_answers, 0);
        const totalTime = historyData.reduce((sum, h) => sum + h.time_spent, 0);
        const averageScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const bestScore = Math.max(...historyData.map(h => (h.correct_answers / h.total_questions) * 100));

        setStats({
          totalQuizzes,
          totalQuestions,
          correctAnswers,
          totalTime,
          averageScore,
          bestScore
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: newDisplayName.trim() || null })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, display_name: newDisplayName.trim() || null }));
      setIsEditing(false);
      toast.success('Đã cập nhật thông tin');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} phút`;
  };

  const statCards = [
    {
      icon: BookOpen,
      label: 'Tổng bài thi',
      value: stats.totalQuizzes.toString(),
      color: 'text-primary'
    },
    {
      icon: Target,
      label: 'Tổng câu hỏi',
      value: stats.totalQuestions.toString(),
      color: 'text-primary'
    },
    {
      icon: Trophy,
      label: 'Trả lời đúng',
      value: stats.correctAnswers.toString(),
      color: 'text-success'
    },
    {
      icon: TrendingUp,
      label: 'Điểm TB',
      value: `${stats.averageScore.toFixed(1)}%`,
      color: 'text-primary'
    },
    {
      icon: BarChart3,
      label: 'Điểm cao nhất',
      value: stats.bestScore > 0 ? `${stats.bestScore.toFixed(1)}%` : '--',
      color: 'text-success'
    },
    {
      icon: Clock,
      label: 'Tổng thời gian',
      value: formatTime(stats.totalTime),
      color: 'text-primary'
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/quiz')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <h1 className="text-lg font-bold">Trang cá nhân</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-6">
            <div className="h-48 bg-muted rounded-2xl animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="overflow-hidden">
                <div className="h-24 gradient-primary" />
                <CardContent className="relative pt-0 -mt-12 pb-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-6">
                    <div className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      {isEditing ? (
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <Input
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            placeholder="Nhập tên hiển thị"
                            className="max-w-xs"
                          />
                          <Button size="icon" variant="ghost" onClick={handleSaveProfile} disabled={saving}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <h2 className="text-2xl font-bold text-foreground">
                            {profile.display_name || user.email?.split('@')[0]}
                          </h2>
                          <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Tham gia: {new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Thống kê học tập</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-foreground">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Performance Chart Placeholder */}
            {stats.totalQuizzes > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tiến độ học tập</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Tỷ lệ đúng</span>
                          <span className="font-medium">{stats.averageScore.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.averageScore}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full gradient-primary rounded-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div className="text-center p-4 bg-success/10 rounded-xl">
                          <div className="text-2xl font-bold text-success">{stats.correctAnswers}</div>
                          <div className="text-xs text-muted-foreground">Câu đúng</div>
                        </div>
                        <div className="text-center p-4 bg-destructive/10 rounded-xl">
                          <div className="text-2xl font-bold text-destructive">
                            {stats.totalQuestions - stats.correctAnswers}
                          </div>
                          <div className="text-xs text-muted-foreground">Câu sai</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Empty State */}
            {stats.totalQuizzes === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Chưa có dữ liệu</h3>
                <p className="text-muted-foreground mb-6">
                  Bắt đầu làm bài thi để xem thống kê của bạn
                </p>
                <Button onClick={() => navigate('/quiz')} className="gap-2">
                  Bắt đầu làm bài
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;