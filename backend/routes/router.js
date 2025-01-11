const express = require("express");
const router = express.Router();
const {
  checkAuthStatus,
  logout,
  signin,
  register,
  updateUserProfile,
} = require("../controllers/AuthController");
const CrudController = require("../controllers/CrudController");
const crudRoutes = require("./crudRoutes");
router.post("/api/auth/register", register);
router.post("/api/auth/signin", signin);
router.get("/api/auth/logout", logout);
router.get("/api/auth/status", checkAuthStatus);
const User = require("../model/User");
const Gift = require("../model/Gift");
const Payment = require("../model/Payment");
// router.put("/api/language/:userid", updateUserLanguage);
// router.put("/api/gender/:userid", updateUserGender);
// router.put("/api/country/:userid", updateUserCountry);
router.put("/api/update_profile/:userid", updateUserProfile);
router.use("/api/items", crudRoutes);

router.get("/api/users/active-daily", async (req, res) => {
  try {
    const Model = require(`../model/User`);
    await CrudController.getActiveDailyUsers(Model, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// .......Payment...........

// Send Gift and Update Payment
router.post("/api/send-gift", async (req, res) => {
  const { senderId, receiverId, giftData } = req.body;
  console.log("Received gift request:", { senderId, receiverId, giftData });

  try {
    // Step 1: Find the sender and check balance
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
    console.log("Sender found:", sender);

    // Ensure the gift value is a valid number
    const giftValue = Number(giftData.value);
    if (isNaN(giftValue) || giftValue <= 0) {
      return res.status(400).json({ message: "Invalid gift value" });
    }

    // Check balance only for non-premium users
    console.log("Sender's balance before deduction:", sender.amountBalance);
    if (!sender.isPremium && sender.amountBalance < giftValue) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct the gift value from the sender's balance if not premium
    if (!sender.isPremium) {
      return res
        .status(400)
        .json({ message: "Please upgrade to Premium membership" });
    }
    sender.amountBalance -= giftValue;
    await sender.save();
    console.log("Sender's balance after deduction:", sender.amountBalance);
    // Step 3: Create the payment record
    const payment = new Payment({
      user: senderId,
      amount: giftValue,
      paymentMethod: "virtual_balance",
      paymentStatus: "completed",
      transactionId: `TXN_${Date.now()}`, // Generate a unique transaction ID
      description: `Gift to user ${receiverId}`,
    });
    await payment.save();
    console.log("Payment record saved:", payment);

    // Step 4: Save the gift in the database
    const gift = new Gift({
      ...giftData,
      sender: senderId,
      receiver: receiverId,
    });
    await gift.save();
    console.log("Gift saved:", gift);

    // Step 5: Update the receiver's balance and virtual gifts array
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Add the gift value to the receiver's balance
    receiver.amountBalance += giftValue;
    receiver.virtualGifts.push(gift._id);
    await receiver.save();
    console.log(
      "Receiver's balance and virtual gifts updated:",
      receiver.amountBalance,
      receiver.virtualGifts
    );

    // Step 6: Respond with success
    res.status(200).json({ message: "Gift sent successfully", gift });
    console.log("Gift sent successfully");
  } catch (error) {
    console.error("Error sending gift:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("amountBalance isPremium");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/users/:userId/transactions
router.get("/api/users/:userId/transactions", async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Payment.find({ user: userId }).sort({
      createdAt: -1,
    });
    if (!transactions) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// .......connected user history...........
router.get("/connection-history/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate(
        "connectionHistory.connectedUserId",
        "_id name email userCountry socketID"
      )
      .exec();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.connectionHistory);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// console.log("from router");
module.exports = router;
