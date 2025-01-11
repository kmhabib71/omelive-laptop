import React, { useState, useEffect } from "react";
import giftData from "../../Data/gift.json"; // Assuming gift.json is in the same directory
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000";

// Translation object
const translations = {
  en: {
    giftSent: "Gift Sent Successfully",
    description: "Hurray! You Received a Gift",
  },
  tr: {
    giftSent: "Hediye Başarıyla Gönderildi",
    description: "Yaşasın! Bir Hediye Aldınız",
  },
};

const GiftPanel = ({
  isGiftPanelVisible,
  socket,
  senderId,
  receiverSocket,
  receiverId,
  userLanguage, // Assuming userLanguage is passed as a prop
  handleOpenMoneyPanel,
  isPremium,
}) => {
  const [gifts, setGifts] = useState([]);
  const t = translations[userLanguage === "Türkçe" ? "tr" : "en"];

  useEffect(() => {
    // Load gifts data from JSON file
    setGifts(giftData);
  }, []);

  // const handleGiftClick = async (gift) => {
  //   const giftData = {
  //     name: gift.name,
  //     description: t.description,
  //     value: gift.value,
  //     imageUrl: gift.imageUrl,
  //     senderSocket: socket.id,
  //     sender: senderId,
  //     receiverSocket: receiverSocket,
  //     receiver: receiverId,
  //   };

  //   // Send gift data via Socket.io
  //   socket.emit("send-gift", giftData);

  //   // Save gift data in the database
  //   try {
  //     const response = await axios.post(
  //       `${backendUrl}/api/items/Gift`,
  //       giftData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     console.log("Gift saved: ", response.data);
  //     toast.success(t.giftSent);
  //   } catch (error) {
  //     console.error("Error sending gift:", error);
  //     throw error;
  //   }
  // };
  const handleGiftClick = async (gift) => {
    if (!isPremium) {
      handleOpenMoneyPanel("Upgrade to premium to sent Gift.");
      return;
    }
    const giftData = {
      name: gift.name,
      description: t.description,
      value: gift.value,
      imageUrl: gift.imageUrl,
      senderSocket: socket.id,
      receiverSocket: receiverSocket,
      sender: senderId,
      receiver: receiverId,
    };
    console.log("gift data: ", giftData);
    socket.emit("send-gift", giftData);
    try {
      // Send gift data and update payment balance via the new API
      const response = await axios.post(
        `${backendUrl}/api/send-gift`,
        { senderId, receiverId, giftData },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Gift transaction successful: ", response.data);
      toast.success(t.giftSent);
    } catch (error) {
      console.error("Error sending gift:", error);
      handleOpenMoneyPanel(error.response.data.message);

      // toast.error("Failed to send gift, please try again.");
    }
  };

  return (
    <div
      className={`
        gift-panel
        absolute right-2 bottom-12
         p-6 rounded-lg shadow-2xl
        transition-all duration-500 ease-in-out transform z-20   
        ${
          isGiftPanelVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
      `}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' %3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%2380F'/%3E%3Cstop offset='1' stop-color='%23f40'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='24' height='24' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='%23ffffff' cx='12' cy='12' r='12'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23b)' fill-opacity='0.1'/%3E%3C/svg%3E%0A\")",
      }}>
      <div className="grid grid-cols-5 gap-4">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="relative gift-item cursor-pointer p-2 px-4 bg-sky-100 rounded-lg hover:bg-gray-200 transition duration-200 ease-in-out flex flex-col items-center justify-center transform hover:scale-105 shadow-md"
            onClick={() => handleGiftClick(gift)}>
            <img
              src={gift.imageUrl}
              alt={gift.name}
              className="max-h-12 max-w-12 object-contain  basis-[90%]"
            />
            <div className="basis-[10%] text-sm text-pink-600 mb-[-0.1rem]">
              ${gift.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftPanel;
