import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuestionCreatorProps {
  onQuestionsCreated: (questions: Question[]) => void;
  onBack: () => void;
}

interface QuestionForm {
  id: number;
  topic: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

const emptyQuestion = (id: number): QuestionForm => ({
  id,
  topic: '',
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A',
});

const QuestionCreator: React.FC<QuestionCreatorProps> = ({ onQuestionsCreated, onBack }) => {
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion(1)]);
  const [errors, setErrors] = useState<Record<number, string[]>>({});

  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id)) + 1;
    setQuestions([...questions, emptyQuestion(newId)]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, field: keyof QuestionForm, value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
    // Clear errors for this question when user types
    if (errors[id]) {
      setErrors({ ...errors, [id]: [] });
    }
  };

  const validateQuestions = (): boolean => {
    const newErrors: Record<number, string[]> = {};
    let isValid = true;

    questions.forEach(q => {
      const questionErrors: string[] = [];
      
      if (!q.text.trim()) questionErrors.push('Câu hỏi không được để trống');
      if (!q.optionA.trim()) questionErrors.push('Đáp án A không được để trống');
      if (!q.optionB.trim()) questionErrors.push('Đáp án B không được để trống');
      if (!q.optionC.trim()) questionErrors.push('Đáp án C không được để trống');
      if (!q.optionD.trim()) questionErrors.push('Đáp án D không được để trống');
      
      if (questionErrors.length > 0) {
        newErrors[q.id] = questionErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateQuestions()) return;

    const validQuestions: Question[] = questions.map((q, index) => ({
      ...q,
      id: index + 1,
      topic: q.topic.trim() || 'Chung',
    }));

    onQuestionsCreated(validQuestions);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tạo câu hỏi mới</h1>
          <p className="text-muted-foreground mt-1">Tạo bộ câu hỏi trắc nghiệm của riêng bạn</p>
        </div>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-foreground">Câu hỏi {index + 1}</h3>
              </div>
              {questions.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>

            {errors[question.id] && errors[question.id].length > 0 && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                  <ul className="text-sm text-destructive space-y-1">
                    {errors[question.id].map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {/* Topic */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`topic-${question.id}`}>Chủ đề (tùy chọn)</Label>
                  <Input
                    id={`topic-${question.id}`}
                    placeholder="VD: Toán học, Lịch sử..."
                    value={question.topic}
                    onChange={(e) => updateQuestion(question.id, 'topic', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`answer-${question.id}`}>Đáp án đúng</Label>
                  <div className="flex gap-2">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateQuestion(question.id, 'correctAnswer', opt)}
                        className={`
                          flex-1 py-2.5 rounded-lg font-semibold transition-all
                          ${question.correctAnswer === opt
                            ? 'gradient-success text-success-foreground shadow-md'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }
                        `}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <Label htmlFor={`text-${question.id}`}>Nội dung câu hỏi *</Label>
                <Textarea
                  id={`text-${question.id}`}
                  placeholder="Nhập nội dung câu hỏi..."
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Options */}
              <div className="grid md:grid-cols-2 gap-4">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <div key={opt} className="space-y-2">
                    <Label htmlFor={`option${opt}-${question.id}`} className="flex items-center gap-2">
                      <span className={`
                        w-6 h-6 rounded text-xs flex items-center justify-center font-semibold
                        ${question.correctAnswer === opt 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {opt}
                      </span>
                      Đáp án {opt} *
                    </Label>
                    <Input
                      id={`option${opt}-${question.id}`}
                      placeholder={`Nhập đáp án ${opt}...`}
                      value={question[`option${opt}` as keyof QuestionForm] as string}
                      onChange={(e) => updateQuestion(question.id, `option${opt}` as keyof QuestionForm, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <Button
          variant="outline"
          onClick={addQuestion}
          className="w-full sm:w-auto gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm câu hỏi
        </Button>

        <Button
          onClick={handleSubmit}
          className="w-full sm:w-auto gap-2 gradient-primary text-primary-foreground hover:opacity-90"
        >
          <Save className="w-5 h-5" />
          Lưu và tiếp tục ({questions.length} câu)
        </Button>
      </div>
    </motion.div>
  );
};

export default QuestionCreator;
