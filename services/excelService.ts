import * as XLSX from 'xlsx';
import { Question } from '../types';

export const parseExcelFile = async (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        // Skip header row if exists
        const startRow = jsonData[0]?.some(cell => 
          typeof cell === 'string' && 
          (cell.toLowerCase().includes('câu hỏi') || 
           cell.toLowerCase().includes('question') ||
           cell.toLowerCase().includes('chủ đề') ||
           cell.toLowerCase().includes('topic'))
        ) ? 1 : 0;
        
        const questions: Question[] = [];
        
        for (let i = startRow; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length < 7) continue;
          
          // Expected format: Topic, Question, A, B, C, D, Answer
          const [topic, text, optionA, optionB, optionC, optionD, correctAnswer] = row;
          
          if (!text || !correctAnswer) continue;
          
          const answer = String(correctAnswer).toUpperCase().trim();
          if (!['A', 'B', 'C', 'D'].includes(answer)) continue;
          
          questions.push({
            id: i,
            topic: String(topic || 'Chung').trim(),
            text: String(text).trim(),
            options: {
              A: String(optionA || '').trim(),
              B: String(optionB || '').trim(),
              C: String(optionC || '').trim(),
              D: String(optionD || '').trim(),
            },
            correctAnswer: answer as 'A' | 'B' | 'C' | 'D',
          });
        }
        
        resolve(questions);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.readAsBinaryString(file);
  });
};

export const generateSampleData = (): Question[] => {
  return [
    {
      id: 1,
      topic: 'Toán học',
      text: '2 + 2 bằng bao nhiêu?',
      options: {
        A: '3',
        B: '4',
        C: '5',
        D: '6',
      },
      correctAnswer: 'B',
    },
    {
      id: 2,
      topic: 'Toán học',
      text: 'Căn bậc hai của 16 là?',
      options: {
        A: '2',
        B: '3',
        C: '4',
        D: '5',
      },
      correctAnswer: 'C',
    },
    {
      id: 3,
      topic: 'Văn học',
      text: 'Tác giả của "Truyện Kiều" là ai?',
      options: {
        A: 'Nguyễn Du',
        B: 'Hồ Xuân Hương',
        C: 'Xuân Diệu',
        D: 'Nguyễn Trãi',
      },
      correctAnswer: 'A',
    },
    {
      id: 4,
      topic: 'Lịch sử',
      text: 'Việt Nam thống nhất đất nước năm nào?',
      options: {
        A: '1954',
        B: '1968',
        C: '1975',
        D: '1986',
      },
      correctAnswer: 'C',
    },
    {
      id: 5,
      topic: 'Địa lý',
      text: 'Thủ đô của Việt Nam là?',
      options: {
        A: 'Hồ Chí Minh',
        B: 'Hà Nội',
        C: 'Đà Nẵng',
        D: 'Huế',
      },
      correctAnswer: 'B',
    },
  ];
};

export const exportToExcel = (questions: Question[], filename: string = 'questions.xlsx') => {
  const data = questions.map(q => ({
    'Chủ đề': q.topic,
    'Câu hỏi': q.text,
    'Đáp án A': q.options.A,
    'Đáp án B': q.options.B,
    'Đáp án C': q.options.C,
    'Đáp án D': q.options.D,
    'Đáp án đúng': q.correctAnswer,
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
  XLSX.writeFile(workbook, filename);
};
