import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider"; // Update this

const PaymentPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, authUser, loading } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
    email: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const [depositAmount, setDepositAmount] = useState("");
  const [userLanguage, setUserLanguage] = useState("en");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear the error for the specific field being changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error for this field
    }));
  };

  useEffect(() => {
    if (!loading && isLoggedIn && authUser) {
      setUserLanguage(authUser.language === "Türkçe" ? "tr" : "en");
    }
  }, [loading, isLoggedIn, authUser]);

  useEffect(() => {
    // Retrieve the deposit amount from localStorage
    const storedAmount = localStorage.getItem("depositAmount");
    if (storedAmount) {
      setDepositAmount(storedAmount);
    }
  }, []);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    const cardNumberRegex = /^[0-9]{16}$/; // Example for 16-digit card number
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // MM/YY format
    const cvvRegex = /^[0-9]{3,4}$/; // 3 or 4 digit CVV
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format

    if (!cardDetails.name.trim()) {
      newErrors.name = "Cardholder name is required";
    }
    if (!cardNumberRegex.test(cardDetails.number)) {
      newErrors.number = "Card number must be 16 digits";
    }
    if (!expiryRegex.test(cardDetails.expiry)) {
      newErrors.expiry = "Expiry date must be in MM/YY format";
    }
    if (!cvvRegex.test(cardDetails.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }
    if (!emailRegex.test(cardDetails.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!cardDetails.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const paymentDatas = {
    amount: 23,
    email: "km.habibs@gmail.com",
    country: "Bangladesh",
  };
  const handlePlaceOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/generate-hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDatas),
      });

      if (!response.ok) {
        // Handle non-200 responses
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        console.log("response is: ", data);
      } else {
        console.error("Response is not in JSON format");
      }
    } catch (err) {
      console.log("error is: ", err);
    }
  };
  handlePlaceOrders();

  const handlePlaceOrder = async () => {
    if (!validate()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    const paymentData = {
      amount: depositAmount,
      email: cardDetails.email,
      country: cardDetails.country,
    };

    try {
      const response = await fetch("/api/generate-hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      console.log("data is: ", data);
      debugger;

      const form = document.createElement("form");
      form.method = "POST";
      //   form.action = "https://istest.asseco-see.com.tr/fim/est3Dgate";
      form.action = "https://istest.asseco-see.com.tr/fim/est3Dgate";

      const fields = {
        clientId: "700321123123",
        oid: data.orderId,
        amount: depositAmount,
        currency: "949",
        okUrl: data.okUrl,
        failUrl: data.failUrl,
        rnd: data.rnd,
        hash: data.hash,
        storetype: "3d_pay_hosting",
        lang: userLanguage,
      };

      for (const key in fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      }

      // Append form to the body and submit
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error during payment processing:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 flex flex-col md:flex-row justify-between">
        {/* Left Section: Payment Form */}
        <div className="w-full md:w-3/5 pr-4">
          {/* Secure Checkout Header */}
          <h1 className="text-4xl font-bold mb-4 text-center text-blue-500">
            Omelive.online
          </h1>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Secure Checkout
          </h2>
          <p className="text-center mb-6">
            Choose your preferred payment method
          </p>

          {/* Payment Methods */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => handlePaymentMethodChange("visa")}
              className={`p-4 mx-2 border rounded ${
                paymentMethod === "visa" ? "border-blue-500" : "border-gray-300"
              }`}>
              <img src="/images/visa.png" alt="Visa" className="h-8" />
            </button>
            <button
              onClick={() => handlePaymentMethodChange("paypal")}
              className={`p-4 mx-2 border rounded ${
                paymentMethod === "paypal"
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}>
              <img
                src="/images/mastercard.png"
                alt="mastercard"
                className="h-8"
              />
            </button>
          </div>

          {/* Card Details Form */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Cardholder Name
            </label>
            <input
              type="text"
              name="name"
              value={cardDetails.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Card Number
            </label>
            <input
              type="text"
              name="number"
              value={cardDetails.number}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.number && (
              <p className="text-red-500 text-xs">{errors.number}</p>
            )}
          </div>
          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <label className="block mb-2 text-sm font-medium">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="MM/YY"
              />
              {errors.expiry && (
                <p className="text-red-500 text-xs">{errors.expiry}</p>
              )}
            </div>
            <div className="w-1/2 pl-2">
              <label className="block mb-2 text-sm font-medium">CVV2</label>
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Billing Details */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">E-mail</label>
            <input
              type="email"
              name="email"
              value={cardDetails.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={cardDetails.country}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.country && (
              <p className="text-red-500 text-xs">{errors.country}</p>
            )}
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="bg-green-500 text-white py-3 px-6 rounded w-full font-bold">
            Place Order
          </button>

          {/* Go Back Link */}
          <div className="text-center mt-4">
            <a href="/" className="text-blue-500">
              Go Back
            </a>
          </div>

          {/* Secure Payment Info */}
          <div className="text-center mt-6">
            <img
              src="/images/secure.png"
              alt="Secure Payment"
              className="h-8 mx-auto"
            />
            <p className="text-xs text-gray-500 mt-2">
              We accept all major debit & credit cards
            </p>
          </div>
        </div>

        {/* Right Section: Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-2/5">
          <h3 className="text-xl font-bold mb-4">Your Order</h3>
          <ul className="mb-4">
            <li className="flex justify-between">
              <span>Deposit</span>
              <span>₺{depositAmount}</span>
            </li>
          </ul>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₺{depositAmount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Promo Code Applied</span>
              <span>-₺0.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping & Handling</span>
              <span>₺0.00</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Estimated Tax</span>
              <span>₺0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Deposit Total</span>
              <span>₺{depositAmount}</span>
            </div>
          </div>
        </div>
      </div>
      <footer className=" text-black py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Omolive.online. All rights reserved.</p>
          <p>
            For support, contact us at{" "}
            <a href="mailto:support@omelive.online" className="underline">
              support@omelive.online
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPage;
