import React from 'react';
import { motion } from 'framer-motion';
import { Upload, PenLine, BookOpen, Sparkles, ArrowRight, GraduationCap, HelpCircle, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomeViewProps {
  onUpload: () => void;
  onCreate: () => void;
  onUseSample: () => void;
  onShowExcelHelp: () => void;
  onShowWizard: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onUpload, onCreate, onUseSample, onShowExcelHelp, onShowWizard }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
          >
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">EduQuiz</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Nền tảng ôn tập trắc nghiệm thông minh
            <br />
            <span className="text-foreground font-medium">Tự tạo hoặc upload câu hỏi của bạn</span>
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onUpload}
            className="group cursor-pointer bg-card rounded-2xl border border-border p-8 shadow-card hover:shadow-xl hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Upload File Excel</h3>
            <p className="text-muted-foreground mb-6">Tải lên file Excel chứa bộ câu hỏi có sẵn</p>
            <div className="flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all">
              <span>Bắt đầu</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={onCreate}
            className="group cursor-pointer bg-card rounded-2xl border border-border p-8 shadow-card hover:shadow-xl hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PenLine className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Tự Tạo Câu Hỏi</h3>
            <p className="text-muted-foreground mb-6">Tạo bộ câu hỏi trắc nghiệm của riêng bạn</p>
            <div className="flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all">
              <span>Bắt đầu</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>

        {/* Helper Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <Button variant="outline" onClick={onShowExcelHelp} className="gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Hướng dẫn tạo Excel
          </Button>
          <Button variant="outline" onClick={onShowWizard} className="gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Tạo Excel trực tiếp
          </Button>
          <Button variant="outline" onClick={onUseSample} className="gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Dùng dữ liệu mẫu
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl"
        >
          {[
            { icon: BookOpen, label: 'Đa dạng chủ đề' },
            { icon: Sparkles, label: 'Trộn câu hỏi' },
            { icon: Upload, label: 'Import Excel' },
            { icon: PenLine, label: 'Tự tạo câu hỏi' },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2024 EduQuiz - Được xây dựng bởi Huynh Khuan</p>
      </footer>
    </div>
  );
};

export default HomeView;
