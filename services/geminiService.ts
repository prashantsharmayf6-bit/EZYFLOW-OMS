import { GoogleGenAI } from "@google/genai";

// Safely initialize the client only when needed to prevent crashes if key is missing initially in some envs
const getClient = () => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateProductDescription = async (productName: string, category: string, features: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Error: API Key missing.";

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Write a compelling, SEO-friendly product description (approx 50-80 words) for a product named "${productName}" in the category "${category}". Key features/keywords: ${features}. Return only the description text.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description. Please try again.";
  }
};

export const generateCustomerEmail = async (customerName: string, orderId: string, status: string, context: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Error: API Key missing.";

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Write a professional and polite customer service email to ${customerName} regarding Order ${orderId}.
      The current order status is: ${status}.
      Context/Reason for email: ${context}.
      Keep it concise, empathetic, and professional. Return only the email body text (no subject line).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No email generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate email. Please try again.";
  }
};