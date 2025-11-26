import { Question, ExcelQuestionRow } from '../types';

// We declare the global variable from the script tag in index.html
declare global {
  interface Window {
    XLSX: any;
  }
}

export const parseExcelFile = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!window.XLSX) {
          reject(new Error("XLSX library not loaded"));
          return;
        }

        const workbook = window.XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData: ExcelQuestionRow[] = window.XLSX.utils.sheet_to_json(worksheet);

        // Transform to our internal format
        const questions: Question[] = jsonData.map((row, index) => {
          // Robust parsing to handle potential data inconsistencies
          const correctAnswerRaw = row['Đáp án đúng'] ? row['Đáp án đúng'].toString().trim().toUpperCase() : 'A';
          // Extract just the letter if the cell contains more text (e.g. "A. Content")
          const correctAnswer = ['A', 'B', 'C', 'D'].includes(correctAnswerRaw) 
            ? correctAnswerRaw as 'A' | 'B' | 'C' | 'D' 
            : 'A'; // Default fallback

          return {
            id: index + 1,
            text: row['Câu hỏi'] || 'Câu hỏi lỗi',
            options: {
              A: row['Đáp án A'] ? row['Đáp án A'].toString() : '',
              B: row['Đáp án B'] ? row['Đáp án B'].toString() : '',
              C: row['Đáp án C'] ? row['Đáp án C'].toString() : '',
              D: row['Đáp án D'] ? row['Đáp án D'].toString() : '',
            },
            correctAnswer: correctAnswer,
            topic: row['Chủ đề'] || 'Chung'
          };
        }).filter(q => q.text !== 'Câu hỏi lỗi'); // Basic filtering

        resolve(questions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const generateSampleData = (): Question[] => {
    return [
        {
            id: 1,
            text: "Thủ đô của Việt Nam là gì?",
            options: { A: "Hồ Chí Minh", B: "Đà Nẵng", C: "Hà Nội", D: "Cần Thơ" },
            correctAnswer: "C",
            topic: "Địa lý"
        },
        {
            id: 2,
            text: "Công thức hóa học của nước là gì?",
            options: { A: "CO2", B: "H2O", C: "O2", D: "NaCl" },
            correctAnswer: "B",
            topic: "Hóa học"
        }
    ];
};