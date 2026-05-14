import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiModel = "gemini-3-flash-preview";
export const imageModel = "gemini-2.5-flash-image";

export async function generateArticleImage(prompt: string): Promise<string | null> {
  try {
    // Attempting to use Pollinations as a reliable primary for now since multimodal generation via SDK can be flaky
    // or requires specific model access.
    const seed = Math.floor(Math.random() * 1000000);
    return `https://pollinations.ai/p/${encodeURIComponent(prompt + " tech editorial, high quality, minimalist")}?width=1024&height=576&seed=${seed}&model=flux`;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}

export async function generateArticleIntro(title: string, tags: string[]): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: `Write a brief, engaging 2-paragraph introduction for a blog post titled "${title}" about ${tags.join(', ') || 'AI technology'}. 
      
      Requirements:
      1. Tone: Simple and clear (7th grade level). Easy to read.
      2. Content: Human-like, helpful. Avoid robotic cliches.
      3. Structure: Exactly 2 paragraphs.`,
    });
    return response.text;
  } catch (error) {
    console.error("Intro generation error:", error);
    return null;
  }
}

export async function getSEOInsights(content: string) {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: `Perform an aggressive SEO analysis for the following content.
      
      Requirements:
      1. Generate exactly 30 high-traffic, trending keywords.
      2. Prioritize terms with "Low Competition" that are easier to rank for.
      3. For each keyword, provide a difficulty score (Low, Medium, High).
      4. Provide a focus SEO Title (optimized for CTR) and a Meta Description (under 160 chars).
      5. Suggested 10 tags for internal categorization.
      
      Content to analyze:
      ${content}
      
      Format as JSON according to the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seoTitle: { type: Type.STRING },
            seoDescription: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
                },
                required: ["term", "difficulty"]
              },
              minItems: 30
            },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 10 }
          },
          required: ["seoTitle", "seoDescription", "keywords", "tags"]
        }
      }
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("SEO Insights Error:", error);
    return null;
  }
}

export async function runUIDiagnostics(errorLog: string) {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: `You are an AI diagnostic agent. Analyze this error and suggest a fix: ${errorLog}`,
    });
    return response.text;
  } catch (error) {
    return "Diagnostic system offline.";
  }
}

export async function generateFullArticle(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: `You are a helpful and friendly blog writer for 'Techendy'. 
      Your task is to write a complete, high-quality blog post about: "${topic}".
      
      CRITICAL REQUIREMENTS:
      1. LANGUAGE: Use extremely simple English (Grade 7 level). Use short sentences. Avoid big words. 
      2. TONE: Be helpful and conversational. Speak directly to the reader like a friend. Use a mix of short and medium sentences for rhythm.
      3. STRUCTURE: YOU MUST USE PROPER HTML HEADINGS. 
         - Use <h2> for main section titles (Introduction, Detailed Analysis, Conclusion).
         - Use <h3> for sub-points.
         - Do NOT use markdown (# or ##), ONLY use <h2> and <h3> tags.
      4. SEO: Naturally include exactly 30 keywords that are currently trending, have "Low Competition" but "High Search Volume".
      5. FORMAT: Use <ul> and <li> for lists. Use <p> for paragraphs. Use <strong> for emphasis on key terms.
      6. LENGTH: 700 to 1000 words.
      7. METADATA: Provide an excerpt and 10 relevant tags.
      
      Format your response as a valid JSON object matching the schema below.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 10 },
            categoryRecommendation: { type: Type.STRING }
          },
          required: ["title", "content", "excerpt", "tags", "categoryRecommendation"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Full Article Generation Error:", error);
    return null;
  }
}
