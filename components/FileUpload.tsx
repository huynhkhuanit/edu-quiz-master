import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, AlertCircle, Loader2, Upload, CheckCircle } from 'lucide-react';
import { parseExcelFile } from '@/services/excelService';
import { Question } from '@/types';

interface FileUploadProps {
  onDataLoaded: (questions: Question[]) => void;
}

const ACCEPTED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/excel',
  'application/x-excel',
  'application/x-msexcel',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  'text/csv',
  'application/csv',
  'text/comma-separated-values',
  'application/octet-stream',
];

const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.xlsm', '.xlsb', '.csv'];

const getAcceptString = (): string => {
  return [...ACCEPTED_MIME_TYPES, ...ACCEPTED_EXTENSIONS].join(',');
};

const isValidFile = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  return hasValidExtension;
};

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!isValidFile(file)) {
      setError("Vui lòng chọn file Excel (.xlsx, .xls, .xlsm, .xlsb) hoặc CSV (.csv)");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const questions = await parseExcelFile(file);
      if (questions.length === 0) {
        setError("File không chứa câu hỏi hợp lệ hoặc sai định dạng.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          onDataLoaded(questions);
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi khi đọc file. Vui lòng kiểm tra định dạng Excel.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto"
    >
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-12
          transition-all duration-300 ease-out
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
          ${loading ? 'pointer-events-none' : ''}
          ${success ? 'border-success bg-success/5' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div 
            className={`
              w-20 h-20 rounded-2xl flex items-center justify-center
              ${success ? 'gradient-success' : 'gradient-primary'}
              shadow-lg
            `}
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
          >
            {loading ? (
              <Loader2 className="w-10 h-10 text-primary-foreground" />
            ) : success ? (
              <CheckCircle className="w-10 h-10 text-success-foreground" />
            ) : (
              <FileSpreadsheet className="w-10 h-10 text-primary-foreground" />
            )}
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {loading ? 'Đang xử lý...' : success ? 'Tải lên thành công!' : 'Tải lên file Excel hoặc CSV'}
            </h3>
            <p className="text-muted-foreground">
              {loading 
                ? 'Vui lòng đợi trong giây lát'
                : success 
                  ? 'Đang chuyển đến cài đặt...'
                  : 'Kéo thả hoặc click để chọn file Excel (.xlsx, .xls, .xlsm, .xlsb) hoặc CSV'
              }
            </p>
          </div>

          {!loading && !success && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="w-4 h-4" />
              <span>Hỗ trợ: Excel (.xlsx, .xls, .xlsm, .xlsb) và CSV (.csv)</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border">
        <h4 className="font-semibold text-foreground mb-3">📋 Định dạng file Excel:</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-3 text-left text-muted-foreground font-medium">Chủ đề</th>
                <th className="py-2 px-3 text-left text-muted-foreground font-medium">Câu hỏi</th>
                <th className="py-2 px-3 text-left text-muted-foreground font-medium">A</th>
                <th className="py-2 px-3 text-left text-muted-foreground font-medium">B</th>
                <th className="py-2 px-3 text-left text-muted-foreground font-medium">C</th>
                <th className="py-2 px-3 text-left text-muted-foreground font-medium">D</th>
                <th className="py-2 px-3 text-left text-muted-foreground font-medium">Đáp án</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-foreground">
                <td className="py-2 px-3">Toán</td>
                <td className="py-2 px-3">2+2=?</td>
                <td className="py-2 px-3">3</td>
                <td className="py-2 px-3">4</td>
                <td className="py-2 px-3">5</td>
                <td className="py-2 px-3">6</td>
                <td className="py-2 px-3 font-semibold text-primary">B</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default FileUpload;
