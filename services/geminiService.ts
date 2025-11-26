import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const explainAnswer = async (question: Question, userAnswer?: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Vui lòng cấu hình API Key để sử dụng tính năng giải thích AI.";

  const prompt = `
    Bạn là một chuyên gia kỹ thuật cao cấp (Senior Engineer/Architect).
    Hãy đóng vai trò là người hướng dẫn trong một "Database Design Challenge" (hoặc thử thách kỹ thuật tương đương tùy theo chủ đề).
    
    Nhiệm vụ: Giải thích câu hỏi trắc nghiệm dưới đây một cách **ngắn gọn, súc tích** nhưng phải đi sâu vào bản chất vấn đề.

    Thông tin:
    - Câu hỏi: "${question.text}"
    - Các lựa chọn: [A: ${question.options.A}], [B: ${question.options.B}], [C: ${question.options.C}], [D: ${question.options.D}]
    - Đáp án đúng: ${question.correctAnswer}
    - Người dùng chọn: ${userAnswer || 'Chưa chọn'}

    Yêu cầu định dạng Output (Markdown):
    1. **Phân tích cốt lõi** (Ngắn gọn): Tại sao đáp án ${question.correctAnswer} là chính xác về mặt nguyên lý/kỹ thuật? (In đậm các keyword quan trọng).
    2. **Tại sao sai?**: 
       - Nếu người dùng chọn sai (${userAnswer}): Hãy chỉ ra lỗ hổng tư duy (mental model gap) hoặc bẫy logic mà họ mắc phải.
       - Tại sao các phương án còn lại không tối ưu hoặc sai hoàn toàn trong ngữ cảnh này.

    Văn phong: Chuyên nghiệp, trực diện, không lan man. Dùng Markdown để làm nổi bật ý chính.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Không thể tạo lời giải thích lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Đã xảy ra lỗi khi kết nối với gia sư AI.";
  }
};