import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  HelpCircle, 
  FileSpreadsheet, 
  ChevronRight, 
  ChevronDown,
  CheckCircle,
  Info,
  BookOpen,
  Table,
  Columns,
  Type,
  ListOrdered
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToExcel, generateSampleData } from '@/services/excelService';

interface ExcelTemplateHelperProps {
  onClose?: () => void;
}

const ExcelTemplateHelper: React.FC<ExcelTemplateHelperProps> = ({ onClose }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const handleDownloadTemplate = () => {
    const sampleQuestions = generateSampleData();
    exportToExcel(sampleQuestions, 'mau_cau_hoi_eduquiz.xlsx');
  };

  const steps = [
    {
      id: 1,
      title: 'Cấu trúc file Excel',
      icon: Table,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            File Excel của bạn cần có <strong>7 cột</strong> theo thứ tự:
          </p>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {['Chủ đề', 'Câu hỏi', 'A', 'B', 'C', 'D', 'Đáp án'].map((col, i) => (
              <div key={i} className="bg-primary/10 text-primary font-medium py-2 px-1 rounded-lg">
                {col}
              </div>
            ))}
          </div>
          <div className="p-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground">
              <Info className="w-4 h-4 inline mr-2 text-primary" />
              Hàng đầu tiên có thể là tiêu đề (sẽ được bỏ qua tự động)
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Giải thích từng cột',
      icon: Columns,
      content: (
        <div className="space-y-3">
          {[
            { name: 'Chủ đề', desc: 'Phân loại câu hỏi (VD: Toán, Văn, Lịch sử)', example: 'Toán học' },
            { name: 'Câu hỏi', desc: 'Nội dung câu hỏi', example: '2 + 2 bằng bao nhiêu?' },
            { name: 'A, B, C, D', desc: '4 đáp án để lựa chọn', example: '3, 4, 5, 6' },
            { name: 'Đáp án', desc: 'Đáp án đúng (chỉ ghi A, B, C hoặc D)', example: 'B' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <p className="text-sm text-primary mt-1">Ví dụ: {item.example}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 3,
      title: 'Ví dụ hoàn chỉnh',
      icon: BookOpen,
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary/10">
                {['Chủ đề', 'Câu hỏi', 'A', 'B', 'C', 'D', 'Đáp án'].map((h, i) => (
                  <th key={i} className="py-2 px-3 text-left font-medium text-primary border border-border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-3 border border-border">Toán</td>
                <td className="py-2 px-3 border border-border">2+2=?</td>
                <td className="py-2 px-3 border border-border">3</td>
                <td className="py-2 px-3 border border-border">4</td>
                <td className="py-2 px-3 border border-border">5</td>
                <td className="py-2 px-3 border border-border">6</td>
                <td className="py-2 px-3 border border-border font-bold text-primary">B</td>
              </tr>
              <tr className="bg-muted/30">
                <td className="py-2 px-3 border border-border">Văn</td>
                <td className="py-2 px-3 border border-border">Tác giả Truyện Kiều?</td>
                <td className="py-2 px-3 border border-border">Nguyễn Du</td>
                <td className="py-2 px-3 border border-border">Hồ Xuân Hương</td>
                <td className="py-2 px-3 border border-border">Xuân Diệu</td>
                <td className="py-2 px-3 border border-border">Nguyễn Trãi</td>
                <td className="py-2 px-3 border border-border font-bold text-primary">A</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 4,
      title: 'Lưu ý quan trọng',
      icon: ListOrdered,
      content: (
        <div className="space-y-3">
          {[
            'Đáp án đúng chỉ được phép là A, B, C hoặc D (viết hoa hoặc thường đều được)',
            'Mỗi câu hỏi phải có đủ 4 đáp án A, B, C, D',
            'Nếu bỏ trống cột Chủ đề, hệ thống sẽ tự động gán là "Chung"',
            'Lưu file dạng .xlsx hoặc .xls trước khi upload',
          ].map((note, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 gradient-accent rounded-2xl flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Hướng dẫn tạo file Excel
        </h2>
        <p className="text-muted-foreground">
          Làm theo các bước dưới đây để tạo file câu hỏi đúng định dạng
        </p>
      </div>

      {/* Download Template Button */}
      <div className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-foreground mb-1">
              Tải file mẫu có sẵn
            </h3>
            <p className="text-sm text-muted-foreground">
              Đơn giản nhất là tải file mẫu, sửa nội dung và upload lại
            </p>
          </div>
          <Button
            onClick={handleDownloadTemplate}
            className="gap-2 gradient-primary text-primary-foreground hover:opacity-90"
          >
            <Download className="w-5 h-5" />
            Tải file mẫu
          </Button>
        </div>
      </div>

      {/* Steps Accordion */}
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className="border border-border rounded-xl overflow-hidden bg-card"
          >
            <button
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">
                Bước {step.id}: {step.title}
              </span>
              {expandedStep === step.id ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedStep === step.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 border-t border-border bg-muted/20">
                    {step.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-xl">
        <p className="text-sm text-success flex items-start gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Mẹo:</strong> Bạn có thể tạo câu hỏi ngay trên website bằng tính năng "Tự tạo câu hỏi" 
            nếu không muốn làm việc với Excel!
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default ExcelTemplateHelper;
