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
        },
        {
            id: 3,
            text: "Sông nào dài nhất Việt Nam?",
            options: { A: "Sông Hồng", B: "Sông Mekong", C: "Sông Đà", D: "Sông Đồng Nai" },
            correctAnswer: "B",
            topic: "Địa lý"
        },
        {
            id: 4,
            text: "1 + 1 bằng bao nhiêu?",
            options: { A: "1", B: "2", C: "3", D: "4" },
            correctAnswer: "B",
            topic: "Toán học"
        },
        {
            id: 5,
            text: "Ai là người phát minh ra bóng đèn điện?",
            options: { A: "Albert Einstein", B: "Isaac Newton", C: "Thomas Edison", D: "Nikola Tesla" },
            correctAnswer: "C",
            topic: "Lịch sử"
        },
        {
            id: 6,
            text: "Nguyên tố hóa học nào có ký hiệu 'Fe'?",
            options: { A: "Vàng", B: "Bạc", C: "Sắt", D: "Đồng" },
            correctAnswer: "C",
            topic: "Hóa học"
        },
        {
            id: 7,
            text: "Việt Nam giành độc lập vào năm nào?",
            options: { A: "1944", B: "1945", C: "1946", D: "1954" },
            correctAnswer: "B",
            topic: "Lịch sử"
        },
        {
            id: 8,
            text: "Diện tích hình vuông cạnh a được tính bằng công thức nào?",
            options: { A: "a + a", B: "4a", C: "a × a", D: "2a" },
            correctAnswer: "C",
            topic: "Toán học"
        },
        {
            id: 9,
            text: "Đỉnh núi cao nhất Việt Nam là gì?",
            options: { A: "Fansipan", B: "Phu Si Lung", C: "Ngọc Linh", D: "Tây Côn Lĩnh" },
            correctAnswer: "A",
            topic: "Địa lý"
        },
        {
            id: 10,
            text: "Khí CO2 có tên gọi là gì?",
            options: { A: "Carbon monoxide", B: "Carbon dioxide", C: "Methane", D: "Oxygen" },
            correctAnswer: "B",
            topic: "Hóa học"
        },
        {
            id: 11,
            text: "JavaScript là ngôn ngữ lập trình thuộc loại nào?",
            options: { A: "Compiled", B: "Interpreted", C: "Assembly", D: "Machine code" },
            correctAnswer: "B",
            topic: "Công nghệ"
        },
        {
            id: 12,
            text: "HTML viết tắt của từ gì?",
            options: { A: "Hyper Text Markup Language", B: "High Tech Modern Language", C: "Home Tool Markup Language", D: "Hyperlinks Text Mark Language" },
            correctAnswer: "A",
            topic: "Công nghệ"
        }
    ];
};