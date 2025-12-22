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
            optionA: String(optionA || '').trim(),
            optionB: String(optionB || '').trim(),
            optionC: String(optionC || '').trim(),
            optionD: String(optionD || '').trim(),
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
      optionA: '3',
      optionB: '4',
      optionC: '5',
      optionD: '6',
      correctAnswer: 'B',
    },
    {
      id: 2,
      topic: 'Toán học',
      text: 'Căn bậc hai của 16 là?',
      optionA: '2',
      optionB: '3',
      optionC: '4',
      optionD: '5',
      correctAnswer: 'C',
    },
    {
      id: 3,
      topic: 'Văn học',
      text: 'Tác giả của "Truyện Kiều" là ai?',
      optionA: 'Nguyễn Du',
      optionB: 'Hồ Xuân Hương',
      optionC: 'Xuân Diệu',
      optionD: 'Nguyễn Trãi',
      correctAnswer: 'A',
    },
    {
      id: 4,
      topic: 'Lịch sử',
      text: 'Việt Nam thống nhất đất nước năm nào?',
      optionA: '1954',
      optionB: '1968',
      optionC: '1975',
      optionD: '1986',
      correctAnswer: 'C',
    },
    {
      id: 5,
      topic: 'Địa lý',
      text: 'Thủ đô của Việt Nam là?',
      optionA: 'Hồ Chí Minh',
      optionB: 'Hà Nội',
      optionC: 'Đà Nẵng',
      optionD: 'Huế',
      correctAnswer: 'B',
    },
  ];
};

export const exportToExcel = (questions: Question[], filename: string = 'questions.xlsx') => {
  const data = questions.map(q => ({
    'Chủ đề': q.topic,
    'Câu hỏi': q.text,
    'Đáp án A': q.optionA,
    'Đáp án B': q.optionB,
    'Đáp án C': q.optionC,
    'Đáp án D': q.optionD,
    'Đáp án đúng': q.correctAnswer,
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
  XLSX.writeFile(workbook, filename);
};
