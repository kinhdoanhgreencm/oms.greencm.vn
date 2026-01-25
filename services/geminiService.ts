
import { GoogleGenAI, Type } from "@google/genai";
import { Customer } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTechnicalAdvice = async (customer: Customer) => {
  try {
    const prompt = `Hãy đóng vai một chuyên gia tư vấn kỹ thuật trạm sạc VinFast. 
    Khách hàng: ${customer.name}
    Địa chỉ: ${customer.address}
    Loại trạm: ${customer.chargerType}
    Loại khách hàng: ${customer.type}

    Hãy cung cấp một bản tư vấn kỹ thuật ngắn gọn bao gồm:
    1. Đề xuất vị trí lắp đặt tối ưu.
    2. Yêu cầu về hạ tầng điện (CB, tiết diện dây dẫn).
    3. Ước tính thời gian thi công.
    4. Các lưu ý về an toàn PCCC.
    
    Trả về định dạng JSON chuyên nghiệp.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            installationSpot: { type: Type.STRING },
            electricalRequirements: { type: Type.STRING },
            estimatedTime: { type: Type.STRING },
            safetyNotes: { type: Type.STRING },
            estimatedCostRange: { type: Type.STRING }
          },
          required: ["installationSpot", "electricalRequirements", "estimatedTime", "safetyNotes"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
};
