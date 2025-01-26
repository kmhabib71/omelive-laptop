const COMMON_PAYMENT_URL = "https://pos.vizyonmobil.com.tr/api/v2/commonpaymentpage";

async function initializePayment(data) {
  try {
    const token = await getToken();

    const response = await axios.post(
      COMMON_PAYMENT_URL,
      {
        serviceId: 331, // Replace with actual service ID
        product: data.product,
        productImage: data.productImage || "",
        referenceCode: data.referenceCode, // Unique for tracking
        msisdn: data.msisdn || "", // Mobile number, if needed
        referenceUserId: data.referenceUserId, // Your user ID
        amount: data.amount,
        successUrl: data.successUrl, // URL to redirect on success
        failureUrl: data.failureUrl, // URL to redirect on failure
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.paymentPageUrl; // Payment URL for redirection
  } catch (error) {
    console.error("Error initializing payment:", error.response.data);
    throw new Error("Failed to initialize payment");
  }
}

module.exports = { initializePayment };
