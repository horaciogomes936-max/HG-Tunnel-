import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  // In a real app, ensure API_KEY is present.
  // For this demo, if process.env.API_KEY is missing, it will fail gracefully in the UI.
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const sendSupportMessage = async (message: string, context: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: `You are HG Bot, a helpful technical support assistant for the VPN app "HG Tunnel". 
        Context: ${context}.
        Guidelines:
        1. Be concise and helpful.
        2. Support languages: Portuguese and English.
        3. If asked about connection issues, suggest changing servers (Unitel, Africell, Movicel).
        4. Explain that watching ads adds time to the VPN connection.
        5. Keep responses under 50 words.`,
      }
    });
    
    return response.text || "Sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System Error: Please check your internet connection or API Key configuration.";
  }
};