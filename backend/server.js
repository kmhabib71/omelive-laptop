const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
const socketSetup = require("./socket");
const { Translate } = require("@google-cloud/translate").v2;
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

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

// Payment system (Nestpay) route for generating hash
app.post("/api/generate-hash", (req, res) => {
  const { amount, email, country } = req.body;

  // Define the required parameters for the hash
  const params = {
    clientId: "700321123123", // Example Client ID from Nestpay
    orderId: Date.now().toString(),
    amount: amount,
    currency: "949", // Currency code (for TL, it's 949)
    okUrl: "https://yourwebsite.com/success", // Update with your success URL
    failUrl: "https://yourwebsite.com/fail", // Update with your failure URL
    rnd: Math.random().toString(),
    storeKey: "TEST1234", // Store Key from Nestpay
  };

  // Create the hash for the payment
  const hashString = `${params.clientId}|${params.orderId}|${params.amount}|${params.currency}|${params.okUrl}|${params.failUrl}|${params.rnd}|${params.storeKey}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("base64");
  console.log("hash is: ", hash);
  // Return the necessary data to the frontend
  res.json({
    hash,
    orderId: params.orderId,
    rnd: params.rnd,
    okUrl: params.okUrl,
    failUrl: params.failUrl,
  });
});


// Routes
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/match", require("./routes/matchRoutes"));
app.use("/api/chat", require("./routes/chatRoutes")); // Assuming the route is saved in `routes/chatRoutes.js`

// Socket setup
socketSetup(server);
const indexRoutes = require("./routes/router");
app.use("/", indexRoutes);

app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Handle unknown routes and serve the frontend's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
