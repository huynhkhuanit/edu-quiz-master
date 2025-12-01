import React, { useState, useMemo } from 'react';
import { Question, QuizSettings as QuizSettingsType } from '../types';

interface QuizSettingsProps {
  questions: Question[];
  onStartQuiz: (settings: QuizSettingsType) => void;
  onBack: () => void;
}

const QuizSettings: React.FC<QuizSettingsProps> = ({ questions, onStartQuiz, onBack }) => {
  // Extract unique topics
  const topics = useMemo(() => {
    const topicSet = new Set(questions.map(q => q.topic));
    return Array.from(topicSet);
  }, [questions]);

  const [settings, setSettings] = useState<QuizSettingsType>({
    numberOfQuestions: Math.min(10, questions.length),
    shuffleQuestions: true,
    selectedTopics: topics,
    timeLimit: 0, // 0 = no limit
  });

  // Calculate available questions based on selected topics
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
    setSettings(prev => ({
      ...prev,
      selectedTopics: topics
    }));
  };

  const handleDeselectAllTopics = () => {
    setSettings(prev => ({
      ...prev,
      selectedTopics: []
    }));
  };

  const handleStart = () => {
    if (settings.selectedTopics.length === 0) {
      alert('Vui lòng chọn ít nhất một chủ đề');
      return;
    }
    if (settings.numberOfQuestions <= 0) {
      alert('Số câu hỏi phải lớn hơn 0');
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
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Cài đặt bài thi</h1>
        <p className="text-slate-500">Tùy chỉnh bài thi theo ý muốn của bạn</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
        {/* Question Count */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Số câu hỏi
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max={availableQuestions}
              value={Math.min(settings.numberOfQuestions, availableQuestions)}
              onChange={(e) => setSettings(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value) }))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="w-20">
              <input
                type="number"
                min="1"
                max={availableQuestions}
                value={Math.min(settings.numberOfQuestions, availableQuestions)}
                onChange={(e) => setSettings(prev => ({ ...prev, numberOfQuestions: Math.min(parseInt(e.target.value) || 1, availableQuestions) }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Có {availableQuestions} câu hỏi khả dụng từ các chủ đề đã chọn
          </p>
        </div>

        {/* Time Limit */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Giới hạn thời gian
          </label>
          <div className="grid grid-cols-4 gap-2">
            {timeLimitOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSettings(prev => ({ ...prev, timeLimit: option.value }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  settings.timeLimit === option.value
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shuffle Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <h3 className="font-semibold text-slate-700">Xáo trộn câu hỏi</h3>
            <p className="text-sm text-slate-500">Hiển thị câu hỏi theo thứ tự ngẫu nhiên</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, shuffleQuestions: !prev.shuffleQuestions }))}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.shuffleQuestions ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                settings.shuffleQuestions ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Topic Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">
              Chủ đề ({settings.selectedTopics.length}/{topics.length})
            </label>
            <div className="space-x-2">
              <button
                onClick={handleSelectAllTopics}
                className="text-xs text-indigo-600 hover:underline"
              >
                Chọn tất cả
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={handleDeselectAllTopics}
                className="text-xs text-slate-500 hover:underline"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl">
            {topics.map(topic => {
              const count = questions.filter(q => q.topic === topic).length;
              const isSelected = settings.selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  <span>{topic}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20' : 'bg-slate-100'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <h3 className="font-semibold text-indigo-700 mb-2">📋 Tóm tắt</h3>
          <ul className="text-sm text-indigo-600 space-y-1">
            <li>• {Math.min(settings.numberOfQuestions, availableQuestions)} câu hỏi</li>
            <li>• {settings.timeLimit === 0 ? 'Không giới hạn thời gian' : `${settings.timeLimit} phút`}</li>
            <li>• {settings.shuffleQuestions ? 'Xáo trộn ngẫu nhiên' : 'Theo thứ tự gốc'}</li>
            <li>• {settings.selectedTopics.length} chủ đề được chọn</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            ← Quay lại
          </button>
          <button
            onClick={handleStart}
            disabled={settings.selectedTopics.length === 0 || availableQuestions === 0}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Bắt đầu làm bài →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSettings;
