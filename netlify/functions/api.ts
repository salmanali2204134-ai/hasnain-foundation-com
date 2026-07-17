import { GoogleGenAI, Type } from "@google/genai";

export default async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Set CORS / JSON headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // Safe Gemini Client fetcher
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please define it in your Netlify site settings.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-netlify',
        }
      }
    });
  };

  try {
    if (path.endsWith("/gemini/translate")) {
      if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
      }

      const { text, targetLang } = await req.json();
      if (!text || !targetLang) {
        return new Response(JSON.stringify({ error: "Missing text or targetLang parameters." }), { status: 400, headers });
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
      return new Response(JSON.stringify({ success: true, translation: translatedText.trim() }), { status: 200, headers });
    }

    if (path.endsWith("/gemini/generate-story")) {
      if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
      }

      const { category, tone } = await req.json();
      if (!category || !tone) {
        return new Response(JSON.stringify({ error: "Missing category or tone parameters." }), { status: 400, headers });
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
      return new Response(JSON.stringify({ success: true, story: storyObj }), { status: 200, headers });
    }

    if (path.endsWith("/social/feed")) {
      if (req.method !== "GET") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
      }

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
      return new Response(JSON.stringify({ success: true, posts: feedObj.posts }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: `Not found: ${path}` }), { status: 404, headers });
  } catch (error: any) {
    console.error("Netlify Function Gemini Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers });
  }
};

export const config = {
  path: "/api/*",
};
