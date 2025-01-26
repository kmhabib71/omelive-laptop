const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
const socketSetup = require("./socket");
const { Translate } = require("@google-cloud/translate").v2;
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const { getToken, initializePayment } = require("./services/paymentService"); // Import payment functions
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

// Payment Initialization Endpoint
app.post("/api/payments/initialize", async (req, res) => {
  try {
    const paymentData = req.body; // { product, referenceCode, amount, successUrl, failureUrl, ... }

    // Call the initializePayment function
    const paymentPageUrl = await initializePayment(paymentData);

    // Return the payment URL to the frontend
    res.json({ paymentPageUrl });
  } catch (error) {
    console.error("Error initializing payment:", error.message);
    res.status(500).json({ error: "Failed to initialize payment" });
  }
});

// Payment Notification Endpoint (Webhook)
app.post("/api/notifications", (req, res) => {
  try {
    const notification = req.body;

    // Log notification for debugging
    console.log("Received payment notification:", notification);

    // Extract reference code and status
    const { referenceCode, status } = notification.transaction;

    // Handle status updates (e.g., SUCCESS, FAILED, CREATED)
    if (status === "SUCCESS") {
      console.log(`Payment for ${referenceCode} succeeded.`);
      // Update your database to mark the payment as successful
    } else if (status === "FAILED") {
      console.log(`Payment for ${referenceCode} failed.`);
      // Update your database to mark the payment as failed
    } else {
      console.log(`Payment for ${referenceCode} is in status: ${status}`);
    }

    // Respond to VizyonPay with 200 OK
    res.status(200).send("Notification received");
  } catch (error) {
    console.error("Error handling payment notification:", error);
    res.status(500).send("Error processing notification");
  }
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
