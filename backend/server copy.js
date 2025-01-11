const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
const socketSetup = require("./socket");
const { Translate } = require("@google-cloud/translate").v2;
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());

const server = http.createServer(app);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Connect to MongoDB
connectDB();

app.use(express.json());
const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATION_API_KEY,
});
app.post("/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  try {
    const [translation] = await translate.translate(text, targetLanguage);
    res.json({ translation });
  } catch (error) {
    console.error("Error translating text:", error);
    res.status(500).send("Translation error");
  }
});
// Routes
app.use("/api/match", require("./routes/matchRoutes"));

// Socket setup
socketSetup(server);
const indexRoutes = require("./routes/router");
app.use("/", indexRoutes);

app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

// Handle unknown routes and serve the frontend's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
// const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
