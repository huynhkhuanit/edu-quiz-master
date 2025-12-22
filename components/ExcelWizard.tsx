import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Download, 
  ArrowLeft, 
  ArrowRight,
  FileSpreadsheet,
  CheckCircle,
  BookOpen,
  PenLine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportToExcel } from '@/services/excelService';
import { Question } from '@/types';
import { toast } from 'sonner';

interface ExcelWizardProps {
  onComplete: (questions: Question[]) => void;
  onBack: () => void;
}

interface WizardQuestion {
  topic: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

const emptyQuestion: WizardQuestion = {
  topic: '',
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A',
};

const ExcelWizard: React.FC<ExcelWizardProps> = ({ onComplete, onBack }) => {
  const [questions, setQuestions] = useState<WizardQuestion[]>([{ ...emptyQuestion }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [defaultTopic, setDefaultTopic] = useState('Chung');

  const currentQuestion = questions[currentIndex];

  const updateQuestion = (field: keyof WizardQuestion, value: string) => {
    const updated = [...questions];
    updated[currentIndex] = { ...updated[currentIndex], [field]: value };
    setQuestions(updated);
  };

  const addNewQuestion = () => {
    const newQuestion = { ...emptyQuestion, topic: defaultTopic };
    setQuestions([...questions, newQuestion]);
    setCurrentIndex(questions.length);
  };

  const deleteQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error('Cần có ít nhất 1 câu hỏi');
      return;
    }
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(updated.length - 1);
    }
  };

  const isQuestionValid = (q: WizardQuestion) => {
    return q.text.trim() && 
           q.optionA.trim() && 
           q.optionB.trim() && 
           q.optionC.trim() && 
           q.optionD.trim();
  };

  const getValidQuestions = () => {
    return questions.filter(isQuestionValid);
  };

  const handleExport = () => {
    const validQuestions = getValidQuestions();
    if (validQuestions.length === 0) {
      toast.error('Chưa có câu hỏi hợp lệ để xuất');
      return;
    }

    const formattedQuestions: Question[] = validQuestions.map((q, i) => ({
      id: i + 1,
      topic: q.topic || 'Chung',
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
    }));

    exportToExcel(formattedQuestions, 'cau_hoi_eduquiz.xlsx');
    toast.success(`Đã xuất ${formattedQuestions.length} câu hỏi!`);
  };

  const handleUseDirectly = () => {
    const validQuestions = getValidQuestions();
    if (validQuestions.length === 0) {
      toast.error('Chưa có câu hỏi hợp lệ');
      return;
    }

    const formattedQuestions: Question[] = validQuestions.map((q, i) => ({
      id: i + 1,
      topic: q.topic || 'Chung',
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
    }));

    onComplete(formattedQuestions);
  };

  const validCount = getValidQuestions().length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Tạo file Excel trực tiếp</h2>
          <p className="text-sm text-muted-foreground">
            Thêm câu hỏi rồi xuất file hoặc dùng ngay
          </p>
        </div>
        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Default Topic */}
      <div className="mb-6 p-4 bg-muted/50 rounded-xl">
        <Label className="text-sm font-medium text-foreground">Chủ đề mặc định cho câu hỏi mới</Label>
        <Input
          value={defaultTopic}
          onChange={(e) => setDefaultTopic(e.target.value)}
          placeholder="VD: Toán học, Văn học..."
          className="mt-2"
        />
      </div>

      {/* Question Navigator */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {questions.map((q, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                relative w-10 h-10 rounded-lg font-medium text-sm transition-all
                ${currentIndex === index 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : isQuestionValid(q)
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {index + 1}
              {isQuestionValid(q) && currentIndex !== index && (
                <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-success" />
              )}
            </button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={addNewQuestion}
            className="w-10 h-10"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Question Form */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" />
            Câu hỏi {currentIndex + 1}
          </h3>
          {questions.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteQuestion(currentIndex)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa
            </Button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Chủ đề</Label>
            <Input
              value={currentQuestion.topic}
              onChange={(e) => updateQuestion('topic', e.target.value)}
              placeholder="VD: Toán học"
            />
          </div>
          <div className="space-y-2">
            <Label>Đáp án đúng</Label>
            <Select
              value={currentQuestion.correctAnswer}
              onValueChange={(value) => updateQuestion('correctAnswer', value as 'A' | 'B' | 'C' | 'D')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Nội dung câu hỏi *</Label>
          <Textarea
            value={currentQuestion.text}
            onChange={(e) => updateQuestion('text', e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            rows={3}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {(['A', 'B', 'C', 'D'] as const).map((opt) => (
            <div key={opt} className="space-y-2">
              <Label className={currentQuestion.correctAnswer === opt ? 'text-success font-medium' : ''}>
                Đáp án {opt} {currentQuestion.correctAnswer === opt && '✓'}
              </Label>
              <Input
                value={currentQuestion[`option${opt}` as keyof WizardQuestion] as string}
                onChange={(e) => updateQuestion(`option${opt}` as keyof WizardQuestion, e.target.value)}
                placeholder={`Nhập đáp án ${opt}...`}
                className={currentQuestion.correctAnswer === opt ? 'border-success' : ''}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {currentIndex + 1} / {questions.length}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            disabled={currentIndex === questions.length - 1}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {validCount} câu hỏi hợp lệ
          </span>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={validCount === 0}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </Button>
          <Button
            onClick={handleUseDirectly}
            disabled={validCount === 0}
            className="gap-2 gradient-primary text-primary-foreground hover:opacity-90"
          >
            <BookOpen className="w-4 h-4" />
            Làm bài ngay
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExcelWizard;
