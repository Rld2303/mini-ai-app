import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
console.log("MONGO_URI value:", process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ Mongo error:", err));

// Schema & Model
const RequirementSchema = new mongoose.Schema({
  description: String,
  result: Object,
  createdAt: { type: Date, default: Date.now }
});
const Requirement = mongoose.model("Requirement", RequirementSchema);

// POST route to capture requirements
app.post("/api/requirements", async (req, res) => {
  const { description } = req.body;
  const apiKey = process.env.API_KEY || "";

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Extract the following properties from this app idea and return as a single JSON object. If a property is not present, use a reasonable default.

App Idea: ${description}

Properties:
- AppName: The name of the app.
- Entities: An array of primary nouns/objects the app will manage.
- Roles: An array of user types or roles.
- Features: An array of key actions or capabilities.`
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          AppName: { type: "STRING" },
          Entities: { type: "ARRAY", items: { type: "STRING" } },
          Roles: { type: "ARRAY", items: { type: "STRING" } },
          Features: { type: "ARRAY", items: { type: "STRING" } },
        },
      },
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      return res.status(response.status).json({ error: "AI extraction failed" });
    }

    const data = await response.json();
    const parsed = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (parsed) {
      try {
        const jsonResult = JSON.parse(parsed);

        // ✅ Save to MongoDB
        const entry = new Requirement({
          description,
          result: jsonResult,
        });
        await entry.save();

        // Send back to frontend
        return res.json(jsonResult);

      } catch (parseError) {
        console.error("Failed to parse JSON from AI response:", parseError);
        return res.status(500).json({ error: "AI response was not valid JSON" });
      }
    } else {
      console.error("No content found in AI response.");
      return res.status(500).json({ error: "No content found in AI response" });
    }

    } catch (err) {
    console.error("Request failed:", err);
    res.status(500).json({ error: "AI extraction failed" });
  }
});


app.get("/api/history", async (req, res) => {
  try {
    const items = await Requirement.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
