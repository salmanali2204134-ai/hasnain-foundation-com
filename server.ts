import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please define it in your Secrets/Environment variables.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route for Translation
  app.post("/api/gemini/translate", async (req, res) => {
    try {
      const { text, targetLang } = req.body;
      if (!text || !targetLang) {
        return res.status(400).json({ error: "Missing text or targetLang parameters." });
      }

      const ai = getGeminiClient();
      const languageName = targetLang === "ur" ? "Urdu" : "English";

      const prompt = `Translate the following text into highly fluent, culturally appropriate, and natural ${languageName}.
Ensure the translation maintains the original warmth, dignity, and emotion, which is related to welfare/charity work in Karachi, Pakistan.
If translating to Urdu, use standard elegant Urdu script.

Text to translate:
"${text}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert bilingual English-Urdu translator specializing in non-profit, welfare, and community stories in Pakistan.",
        }
      });

      const translatedText = response.text || "";
      res.json({ success: true, translation: translatedText.trim() });
    } catch (error: any) {
      console.error("Gemini Translation Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API Route for Success Story Generation
  app.post("/api/gemini/generate-story", async (req, res) => {
    try {
      const { category, tone } = req.body;
      if (!category || !tone) {
        return res.status(400).json({ error: "Missing category or tone parameters." });
      }

      const ai = getGeminiClient();

      const prompt = `Generate a highly inspirational, realistic success story/testimonial of a beneficiary who has been helped by the Hasnain Foundation in Karachi, Pakistan.
The story must be relevant to the welfare category: "${category}".
The story must convey a tone of: "${tone}".

You MUST return a JSON object with the following fields:
1. "titleEn": A short, impactful title in English.
2. "titleUr": A short, impactful title in Urdu.
3. "beneficiaryName": The name of the beneficiary (e.g. Muhammad Hanif, Amina Bibi) and their location in Karachi (e.g., Orangi Town, Surjani Town, Lyari).
4. "project": The specific project name (e.g., "Daily Food Drive", "Amina Water RO Plant", "Educational Sponsorship").
5. "storyEn": The full success story written in inspiring, heartfelt English (approx 80-120 words).
6. "storyUr": The full success story written in beautiful, poetic, and respectful Urdu script (approx 80-120 words).

Ensure that the stories are respectful, highlight dignity and empowerment rather than helplessness, and are culturally resonant for a Karachi welfare audience.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an inspiring storyteller for Hasnain Foundation, writing uplifting true-to-life success stories in English and Urdu. Always return valid, well-structured JSON matching the requested schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titleEn: { type: Type.STRING },
              titleUr: { type: Type.STRING },
              beneficiaryName: { type: Type.STRING },
              project: { type: Type.STRING },
              storyEn: { type: Type.STRING },
              storyUr: { type: Type.STRING },
            },
            required: ["titleEn", "titleUr", "beneficiaryName", "project", "storyEn", "storyUr"],
          }
        }
      });

      const storyJsonStr = response.text || "{}";
      const storyObj = JSON.parse(storyJsonStr);
      res.json({ success: true, story: storyObj });
    } catch (error: any) {
      console.error("Gemini Story Generation Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API Route for Social Feed with Google Search Grounding
  app.get("/api/social/feed", async (req, res) => {
    try {
      const ai = getGeminiClient();

      const prompt = `Search for any recent news, announcements, activities, water plant projects, or food distribution events related to 'Hasnain Foundation Karachi Pakistan' or other major welfare activities happening in Karachi in 2026.
Based on the found information, synthesize 3 fresh, highly realistic, and inspiring social media posts from the Hasnain Foundation official social accounts (Facebook, YouTube, Instagram).
If no specific recent online news is found, synthesize 3 beautiful updates reflecting their core projects (Masjid Abdul Qadir Jilani Surjani, Amina Water RO Filtration, Orphan Education, Daily Food Drive) as of July 2026.

You MUST return a JSON object with a single "posts" array containing 3 objects with the following structure:
1. "platform": strictly "facebook", "youtube", or "instagram"
2. "author": the page/channel name (e.g., "Hasnain Foundation", "Hasnain Foundation Official", or "hasnain.foundation")
3. "date": e.g., "July 16, 2026" (or relative recent date)
4. "contentEn": post content written in professional, inspiring English (approx 60-80 words).
5. "contentUr": post content written in fluent, beautiful Urdu script (approx 60-80 words) matching the English content.
6. "likes": a realistic number of likes (e.g., 100-600)
7. "shares": a realistic number of shares/retweets (e.g., 10-80)
8. "comments": a realistic comment count (e.g., 5-50)
9. "videoDuration": (only for YouTube platform) e.g., "3:15" or "5:40" (optional/string)

Make sure the tone is full of empathy, community service, transparency, and progress in Karachi's welfare sectors.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert content creator and social media manager for Hasnain Foundation, crafting beautiful, real-time social feeds in English and Urdu.",
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              posts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform: { type: Type.STRING },
                    author: { type: Type.STRING },
                    date: { type: Type.STRING },
                    contentEn: { type: Type.STRING },
                    contentUr: { type: Type.STRING },
                    likes: { type: Type.INTEGER },
                    shares: { type: Type.INTEGER },
                    comments: { type: Type.INTEGER },
                    videoDuration: { type: Type.STRING },
                  },
                  required: ["platform", "author", "date", "contentEn", "contentUr", "likes", "shares", "comments"]
                }
              }
            },
            required: ["posts"]
          }
        }
      });

      const feedJsonStr = response.text || "{\"posts\": []}";
      const feedObj = JSON.parse(feedJsonStr);
      res.json({ success: true, posts: feedObj.posts });
    } catch (error: any) {
      console.error("Gemini Social Feed Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
