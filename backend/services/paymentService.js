const axios = require("axios");

const BASE_URL = "https://pos.vizyonmobil.com.tr/api/v2";
const CLIENT_ID = process.env.VIZYONPAY_CLIENT_ID || "rW2tU9aV5cS7oD6o";
const CLIENT_SECRET = process.env.VIZYONPAY_CLIENT_SECRET || "rK4dY3eE4gI2wO8uR6hC0jL8lL3eJ1jQ";

/**
 * Fetch a Bearer token from VizyonPay
 */
async function getToken() {
  try {
    const response = await axios.post(
      `${BASE_URL}/oauth/token`,
      { client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: "client_credentials" },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    throw new Error("Failed to get access token");
  }
}

/**
 * Initialize a payment with VizyonPay
 * @param {Object} paymentData - Payment details
 * @returns {String} paymentPageUrl - The URL to redirect the user to for payment
 */
async function initializePayment(paymentData) {
  try {
    const token = await getToken();

    const response = await axios.post(
      `${BASE_URL}/commonpaymentpage`,
      {
        serviceId: paymentData.serviceId || 331, // Use provided serviceId or default to 331
        product: paymentData.product,
        productImage: paymentData.productImage || "",
        referenceCode: paymentData.referenceCode, // Unique identifier for tracking
        msisdn: paymentData.msisdn || "", // Mobile number, if applicable
        referenceUserId: paymentData.referenceUserId, // Your user ID
        amount: paymentData.amount,
        successUrl: paymentData.successUrl, // Redirect URL on success
        failureUrl: paymentData.failureUrl, // Redirect URL on failure
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.paymentPageUrl; // The URL for the payment page
  } catch (error) {
    console.error("Error initializing payment:", error.response?.data || error.message);
    throw new Error("Failed to initialize payment");
  }
}

module.exports = { getToken, initializePayment };
