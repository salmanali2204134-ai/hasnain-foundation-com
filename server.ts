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

  // ==========================================
  // IN-MEMORY DATABASE FOR HASNAIN FOUNDATION
  // ==========================================
  
  interface PatientRecord {
    id: string;
    name: string;
    fatherName?: string;
    age: number;
    gender: string;
    phone: string;
    whatsapp: string;
    email: string;
    country: string;
    city: string;
    reason: string;
    description: string;
    appointmentDate: string;
    appointmentTime: string;
    status: 'pending' | 'completed' | 'cancelled' | 'follow-up';
    treatmentNotes: string;
    followUpNotes: string;
    registeredAt: string;
    files?: string[];
    photo?: string;
  }

  interface SubscriberRecord {
    id: string;
    name: string;
    email: string;
    whatsapp: string;
    country: string;
    city: string;
    subscribedAt: string;
  }

  interface DonationReceipt {
    id: string;
    donorName: string;
    email: string;
    whatsapp: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    receiptUrl?: string;
    donationDate: string;
    status: 'pending' | 'verified' | 'rejected';
  }

  let appointments: PatientRecord[] = [
    {
      id: "HF-APT-1001",
      name: "Muhammad Ali",
      fatherName: "Ali Ahmed",
      age: 34,
      gender: "Male",
      phone: "03152204134",
      whatsapp: "03152204134",
      email: "m.ali@gmail.com",
      country: "Pakistan",
      city: "Karachi",
      reason: "Evil Eye Guidance",
      description: "Experiencing continuous physical fatigue, severe anxiety and sudden failure in business. Symptoms started 3 months ago.",
      appointmentDate: "2026-07-22",
      appointmentTime: "11:30 AM",
      status: "pending",
      treatmentNotes: "Pending initial spiritual examination.",
      followUpNotes: "",
      registeredAt: "2026-07-16 02:40 PM",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      files: []
    },
    {
      id: "HF-APT-1002",
      name: "Amina Begum",
      fatherName: "Muhammad Hanif",
      age: 28,
      gender: "Female",
      phone: "03215556789",
      whatsapp: "03215556789",
      email: "amina.b@yahoo.com",
      country: "Pakistan",
      city: "Lahore",
      reason: "Marriage Problems",
      description: "Extreme, unexplained anger issues and misunderstandings between couple. Medical treatments show no psychological issues.",
      appointmentDate: "2026-07-20",
      appointmentTime: "04:00 PM",
      status: "follow-up",
      treatmentNotes: "Diagnosed with heavy negative blockages (Bandish). Performed Ruqyah over water. Recommended daily recitation of Surah Al-Baqarah (verse 102) and morning-evening protection Adhkar.",
      followUpNotes: "Follow up scheduled in 1 week to observe psychological and spiritual improvement.",
      registeredAt: "2026-07-15 10:15 AM",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      files: []
    },
    {
      id: "HF-APT-1003",
      name: "Zainab Fatimah",
      fatherName: "Khurram Shahzad",
      age: 12,
      gender: "Female",
      phone: "03338881234",
      whatsapp: "03338881234",
      email: "khurram.s@gmail.com",
      country: "Pakistan",
      city: "Karachi",
      reason: "Jinn Related Guidance",
      description: "Child gets violent nightmares and speaks in strange, unrecognized voices during sleep. Shows sudden, unnatural physical strength.",
      appointmentDate: "2026-07-17",
      appointmentTime: "02:30 PM",
      status: "completed",
      treatmentNotes: "Performed deep Islamic Ruqyah Ash-Shar'eeyah. Prescribed specific protective prayers, pure olive oil (recited upon) for rubbing, and drinking Ruqyah water.",
      followUpNotes: "Alhamdulillah, the parents report the nightmares have stopped entirely and the child slept peacefully. Recommended keeping house clean of non-Islamic figures and playing Surah Al-Baqarah daily.",
      registeredAt: "2026-07-14 09:30 AM",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
      files: ["https://images.unsplash.com/photo-1584515901407-d8f4e35557aa?auto=format&fit=crop&q=80&w=1200"]
    },
    {
      id: "HF-APT-1004",
      name: "Kamran Khan",
      fatherName: "Saeed Khan",
      age: 45,
      gender: "Male",
      phone: "03457778899",
      whatsapp: "03457778899",
      email: "kamran.khan@gmail.com",
      country: "United Kingdom",
      city: "London",
      reason: "Online Istikhara",
      description: "Seeking spiritual guidance and Istikhara for a major new business partnership and investment overseas.",
      appointmentDate: "2026-07-25",
      appointmentTime: "08:00 PM",
      status: "pending",
      treatmentNotes: "Istikhara prayer to be performed tonight by Khalifa Salman Ali. Online WhatsApp consultation scheduled to discuss results.",
      followUpNotes: "",
      registeredAt: "2026-07-16 11:20 PM",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      files: []
    }
  ];

  let subscribers: SubscriberRecord[] = [
    { id: "SUB-101", name: "Muhammad Salman", email: "salmanali2204134@gmail.com", whatsapp: "03152204134", country: "Pakistan", city: "Karachi", subscribedAt: "2026-07-16" },
    { id: "SUB-102", name: "Ayesha Ahmed", email: "ayesha@yahoo.com", whatsapp: "03180202424", country: "Pakistan", city: "Karachi", subscribedAt: "2026-07-15" },
    { id: "SUB-103", name: "Sajid Mahmood", email: "sajid.m@gmail.com", whatsapp: "03001234567", country: "United Kingdom", city: "Birmingham", subscribedAt: "2026-07-14" }
  ];

  let donations: DonationReceipt[] = [
    { id: "DON-201", donorName: "Aftab Ahmed", email: "aftab@gmail.com", whatsapp: "03009998877", amount: 25000, paymentMethod: "United Bank Limited (UBL)", transactionId: "TXN98231221", donationDate: "2026-07-15", status: "verified" },
    { id: "DON-202", donorName: "Farhan Qadri", email: "farhan.q@gmail.com", whatsapp: "03203456789", amount: 150000, paymentMethod: "EasyPaisa", transactionId: "EP-4421590", donationDate: "2026-07-16", status: "verified" },
    { id: "DON-203", donorName: "Siddique Shah", email: "siddique@live.com", whatsapp: "03152204134", amount: 50000, paymentMethod: "SadaPay", transactionId: "SP-8832910", donationDate: "2026-07-17", status: "pending" }
  ];

  // -------------------------
  // APPOINTMENT CRUD ROUTES
  // -------------------------

  // Get all patients/appointments
  app.get("/api/appointments", (req, res) => {
    res.json({ success: true, appointments });
  });

  // Create a new appointment
  app.post("/api/appointments", (req, res) => {
    try {
      const { 
        name, fatherName, age, gender, phone, whatsapp, email, 
        country, city, reason, description, appointmentDate, appointmentTime, files
      } = req.body;

      if (!name || !age || !gender || !phone || !whatsapp || !email || !reason || !description || !appointmentDate || !appointmentTime) {
        return res.status(400).json({ success: false, error: "Please fill in all required fields." });
      }

      const nextIdNum = appointments.length > 0 
        ? Math.max(...appointments.map(a => parseInt(a.id.split('-').pop() || "1000"))) + 1 
        : 1001;
      const nextId = `HF-APT-${nextIdNum}`;

      const newApt: PatientRecord = {
        id: nextId,
        name,
        fatherName,
        age: Number(age),
        gender,
        phone,
        whatsapp,
        email,
        country,
        city,
        reason,
        description,
        appointmentDate,
        appointmentTime,
        status: 'pending',
        treatmentNotes: "Pending initial spiritual examination.",
        followUpNotes: "",
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        files: files || [],
        photo: gender === "Female" 
          ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
          : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
      };

      appointments.unshift(newApt);

      // Simulate sending notifications (these would be sent in production via SMTP and WhatsApp API)
      const simulatedEmailText = `Assalam-o-Alaikum ${name}, your spiritual healing appointment at Hasnain Foundation has been booked! Your Appointment ID is ${nextId}. Preferred Date: ${appointmentDate} at ${appointmentTime}. A spiritual consultant will reach out via WhatsApp soon.`;
      const simulatedWhatsAppText = `*HASNAIN FOUNDATION SPIRITUAL HEALING CENTER*\n\nDear ${name},\nYour appointment for *${reason}* is registered successfully.\n\n*ID:* ${nextId}\n*Date:* ${appointmentDate}\n*Time:* ${appointmentTime}\n\nOur spiritual consultant Khalifa Salman Ali / Allama Shayan Ali will contact you shortly. JazakAllah Khair!`;

      res.status(201).json({ 
        success: true, 
        appointment: newApt,
        notifications: {
          emailSent: true,
          emailText: simulatedEmailText,
          whatsAppSent: true,
          whatsAppText: simulatedWhatsAppText
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update appointment (treatment notes, status, follow-up notes, etc.)
  app.put("/api/appointments/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status, treatmentNotes, followUpNotes, appointmentDate, appointmentTime } = req.body;

      const idx = appointments.findIndex(a => a.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: "Patient/Appointment record not found." });
      }

      appointments[idx] = {
        ...appointments[idx],
        status: status || appointments[idx].status,
        treatmentNotes: treatmentNotes !== undefined ? treatmentNotes : appointments[idx].treatmentNotes,
        followUpNotes: followUpNotes !== undefined ? followUpNotes : appointments[idx].followUpNotes,
        appointmentDate: appointmentDate || appointments[idx].appointmentDate,
        appointmentTime: appointmentTime || appointments[idx].appointmentTime,
      };

      res.json({ success: true, appointment: appointments[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete appointment
  app.delete("/api/appointments/:id", (req, res) => {
    try {
      const { id } = req.params;
      const idx = appointments.findIndex(a => a.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: "Patient record not found." });
      }
      appointments.splice(idx, 1);
      res.json({ success: true, message: "Record deleted successfully." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------
  // SUBSCRIPTION & BROADCAST ROUTES
  // -------------------------

  // Subscribe visitor
  app.post("/api/subscriptions", (req, res) => {
    try {
      const { name, email, whatsapp, country, city } = req.body;
      if (!name || !email || !whatsapp) {
        return res.status(400).json({ success: false, error: "Name, Email, and WhatsApp are required." });
      }

      const emailExists = subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return res.json({ success: true, message: "You are already subscribed!", alreadyExists: true });
      }

      const nextSub: SubscriberRecord = {
        id: `SUB-${101 + subscribers.length}`,
        name,
        email,
        whatsapp,
        country: country || "Pakistan",
        city: city || "Karachi",
        subscribedAt: new Date().toISOString().substring(0, 10)
      };

      subscribers.push(nextSub);
      res.status(201).json({ success: true, subscriber: nextSub, message: "Subscription successful!" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get subscribers list
  app.get("/api/subscriptions", (req, res) => {
    res.json({ success: true, subscribers });
  });

  // Trigger admin broadcast to subscribers
  app.post("/api/subscriptions/broadcast", (req, res) => {
    try {
      const { type, title, content } = req.body;
      if (!type || !title || !content) {
        return res.status(400).json({ success: false, error: "Missing type, title or content for broadcast." });
      }

      // Simulate sending WhatsApp / Email to all subscribers
      const logs = subscribers.map(sub => {
        return {
          subscriberId: sub.id,
          name: sub.name,
          email: sub.email,
          whatsapp: sub.whatsapp,
          status: 'delivered',
          medium: type.includes('Email') ? 'email' : 'whatsapp',
          timestamp: new Date().toISOString()
        };
      });

      res.json({ 
        success: true, 
        broadcast: {
          title,
          type,
          recipientsCount: subscribers.length,
          deliveredCount: subscribers.length,
          timestamp: new Date().toISOString()
        },
        logs 
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------
  // DONATION ROUTES
  // -------------------------

  // Submit donation receipt
  app.post("/api/donations", (req, res) => {
    try {
      const { donorName, email, whatsapp, amount, paymentMethod, transactionId, receiptUrl } = req.body;
      if (!donorName || !amount || !paymentMethod || !transactionId) {
        return res.status(400).json({ success: false, error: "Donor Name, Amount, Payment Method, and Transaction ID are required." });
      }

      const nextId = `DON-${201 + donations.length}`;
      const newDonation: DonationReceipt = {
        id: nextId,
        donorName,
        email: email || "anonymous@donor.com",
        whatsapp: whatsapp || "",
        amount: Number(amount),
        paymentMethod,
        transactionId,
        receiptUrl: receiptUrl || "",
        donationDate: new Date().toISOString().substring(0, 10),
        status: 'pending' // verified by admin inside CRM
      };

      donations.unshift(newDonation);
      res.status(201).json({ success: true, donation: newDonation, message: "Donation receipt submitted successfully!" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get all donations
  app.get("/api/donations", (req, res) => {
    res.json({ success: true, donations });
  });

  // Verify/reject donation status
  app.put("/api/donations/:id/status", (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'verified' | 'rejected' | 'pending'
      
      const idx = donations.findIndex(d => d.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: "Donation record not found." });
      }

      donations[idx].status = status;

      res.json({ success: true, donation: donations[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
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
