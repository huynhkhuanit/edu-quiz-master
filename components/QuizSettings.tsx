import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Shuffle, Clock, BookOpen, Check } from 'lucide-react';
import { Question, QuizSettings as QuizSettingsType } from '@/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface QuizSettingsProps {
  questions: Question[];
  onStartQuiz: (settings: QuizSettingsType) => void;
  onBack: () => void;
}

const QuizSettings: React.FC<QuizSettingsProps> = ({ questions, onStartQuiz, onBack }) => {
  const topics = useMemo(() => {
    const topicSet = new Set(questions.map(q => q.topic));
    return Array.from(topicSet);
  }, [questions]);

  const [settings, setSettings] = useState<QuizSettingsType>({
    numberOfQuestions: Math.min(10, questions.length),
    shuffleQuestions: true,
    selectedTopics: topics,
    timeLimit: 0,
  });

  const availableQuestions = useMemo(() => {
    return questions.filter(q => settings.selectedTopics.includes(q.topic)).length;
  }, [questions, settings.selectedTopics]);

  const handleTopicToggle = (topic: string) => {
    setSettings(prev => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topic)
        ? prev.selectedTopics.filter(t => t !== topic)
        : [...prev.selectedTopics, topic]
    }));
  };

  const handleSelectAllTopics = () => {
    setSettings(prev => ({ ...prev, selectedTopics: topics }));
  };

  const handleDeselectAllTopics = () => {
    setSettings(prev => ({ ...prev, selectedTopics: [] }));
  };

  const handleStart = () => {
    if (settings.selectedTopics.length === 0) {
      alert('Vui lòng chọn ít nhất một chủ đề');
      return;
    }
    onStartQuiz({
      ...settings,
      numberOfQuestions: Math.min(settings.numberOfQuestions, availableQuestions)
    });
  };

  const timeLimitOptions = [
    { value: 0, label: 'Không giới hạn' },
    { value: 5, label: '5 phút' },
    { value: 10, label: '10 phút' },
    { value: 15, label: '15 phút' },
    { value: 20, label: '20 phút' },
    { value: 30, label: '30 phút' },
    { value: 45, label: '45 phút' },
    { value: 60, label: '60 phút' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Cài đặt bài thi</h1>
        <p className="text-muted-foreground">
          Tùy chỉnh bài thi theo nhu cầu của bạn
        </p>
      </div>

      <div className="space-y-6">
        {/* Topics Selection */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Chủ đề</h3>
                <p className="text-sm text-muted-foreground">Chọn chủ đề bạn muốn ôn tập</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleSelectAllTopics}>
                Tất cả
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeselectAllTopics}>
                Bỏ chọn
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => {
              const count = questions.filter(q => q.topic === topic).length;
              const isSelected = settings.selectedTopics.includes(topic);
              
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                    ${isSelected
                      ? 'gradient-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  {topic}
                  <span className={`
                    px-1.5 py-0.5 rounded text-xs
                    ${isSelected ? 'bg-primary-foreground/20' : 'bg-foreground/10'}
                  `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
              <span className="text-secondary-foreground font-bold">Q</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Số câu hỏi</h3>
              <p className="text-sm text-muted-foreground">
                Có {availableQuestions} câu hỏi khả dụng
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Slider
              value={[settings.numberOfQuestions]}
              min={1}
              max={availableQuestions}
              step={1}
              onValueChange={(value) => setSettings(prev => ({ ...prev, numberOfQuestions: value[0] }))}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">1 câu</span>
              <span className="text-xl font-bold text-primary">{settings.numberOfQuestions} câu</span>
              <span className="text-muted-foreground">{availableQuestions} câu</span>
            </div>
          </div>
        </div>

        {/* Time Limit */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Giới hạn thời gian</h3>
              <p className="text-sm text-muted-foreground">Chọn thời gian làm bài</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {timeLimitOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSettings(prev => ({ ...prev, timeLimit: option.value }))}
                className={`
                  px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${settings.timeLimit === option.value
                    ? 'gradient-accent text-accent-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shuffle Toggle */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <button
            onClick={() => setSettings(prev => ({ ...prev, shuffleQuestions: !prev.shuffleQuestions }))}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all
                ${settings.shuffleQuestions ? 'gradient-primary' : 'bg-muted'}
              `}>
                <Shuffle className={`w-5 h-5 ${settings.shuffleQuestions ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Xáo trộn câu hỏi</h3>
                <p className="text-sm text-muted-foreground">Thứ tự câu hỏi sẽ được ngẫu nhiên</p>
              </div>
            </div>
            <div className={`
              w-14 h-8 rounded-full transition-all relative
              ${settings.shuffleQuestions ? 'bg-primary' : 'bg-muted'}
            `}>
              <div className={`
                w-6 h-6 rounded-full bg-primary-foreground absolute top-1 transition-all shadow-md
                ${settings.shuffleQuestions ? 'right-1' : 'left-1'}
              `} />
            </div>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1 gap-2">
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </Button>
        <Button
          onClick={handleStart}
          disabled={settings.selectedTopics.length === 0}
          className="flex-1 gap-2 gradient-primary text-primary-foreground hover:opacity-90"
        >
          <Play className="w-5 h-5" />
          Bắt đầu ({settings.numberOfQuestions} câu)
        </Button>
      </div>
    </motion.div>
  );
};

export default QuizSettings;
