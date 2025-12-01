import React, { useCallback, useState, useRef } from 'react';
import { parseExcelFile } from '../services/excelService';
import { Question } from '../types';

interface FileUploadProps {
  onDataLoaded: (questions: Question[]) => void;
}

// Danh sách MIME types và extensions được hỗ trợ
// Sử dụng nhiều MIME types để tương thích tốt với các thiết bị mobile
const ACCEPTED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'application/excel',
  'application/x-excel',
  'application/x-msexcel',
  'application/octet-stream', // Một số thiết bị mobile gửi file Excel với MIME type này
];

const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls'];

// Tạo accept string tương thích đa nền tảng
// Kết hợp cả MIME types và extensions để đảm bảo hoạt động trên mọi thiết bị
const getAcceptString = (): string => {
  return [
    ...ACCEPTED_MIME_TYPES,
    ...ACCEPTED_EXTENSIONS,
  ].join(',');
};

// Kiểm tra file có hợp lệ không (dựa vào extension vì MIME type có thể không chính xác trên mobile)
const isValidFile = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  const hasValidMimeType = ACCEPTED_MIME_TYPES.includes(file.type) || file.type === '';
  
  // Ưu tiên kiểm tra extension vì MIME type không đáng tin cậy trên mobile
  return hasValidExtension || (hasValidMimeType && fileName.includes('.'));
};

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    // Kiểm tra file hợp lệ trước khi xử lý
    if (!isValidFile(file)) {
      setError("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const questions = await parseExcelFile(file);
      if (questions.length === 0) {
        setError("File không chứa câu hỏi hợp lệ hoặc sai định dạng.");
      } else {
        onDataLoaded(questions);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    // Reset input để có thể chọn lại cùng file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Xử lý click button để mở file picker (tương thích tốt hơn trên mobile)
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">EduQuiz Master</h1>
        <p className="text-slate-500 text-lg">Tải lên ngân hàng câu hỏi của bạn và bắt đầu luyện tập</p>
      </div>

      <div
        className={`w-full p-10 bg-white rounded-3xl border-4 border-dashed transition-all duration-300 shadow-sm
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}
          ${loading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-indigo-100 rounded-full text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">
              Kéo thả file Excel vào đây
            </p>
            <p className="text-sm text-slate-500 mt-1">hoặc</p>
          </div>

          <button 
            type="button"
            onClick={handleButtonClick}
            className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition active:transform active:scale-95"
          >
            Chọn file từ máy
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept={getAcceptString()}
            onChange={handleFileChange}
            // Các thuộc tính để tương thích tốt hơn trên mobile
            multiple={false}
          />
          
          <p className="text-xs text-slate-400 mt-4">Hỗ trợ định dạng .xlsx, .xls với các cột: STT, Câu hỏi, Đáp án A-D, Đáp án đúng, Chủ đề</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-6 flex items-center space-x-2 text-indigo-600">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Đang xử lý dữ liệu...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;