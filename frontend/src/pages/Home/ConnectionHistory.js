import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5000";

// Translation object
const translations = {
  en: {
    connectionHistoryTitle: "Connection History",
    noHistoryMessage: "No connection history found.",
    callButton: "Call",
    upgradeMessage: "Upgrade to premium to call user.",
  },
  tr: {
    connectionHistoryTitle: "Bağlantı Geçmişi",
    noHistoryMessage: "Bağlantı geçmişi bulunamadı.",
    callButton: "Ara",
    upgradeMessage: "Kullanıcıyı aramak için premium üyeliğe geçin.",
  },
};

const ConnectionHistory = ({
  userId,
  isVisible,
  onClose,
  onSelectUser,
  isPremium,
  handleOpenMoneyPanel,
  userLanguage, // Default language is English
}) => {
  const [history, setHistory] = useState([]);
  const t = translations[userLanguage === "Türkçe" ? "tr" : "en"];

  useEffect(() => {
    const fetchConnectionHistory = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/connection-history/${userId}`
        );
        const uniqueHistory = getUniqueConnections(response.data);
        setHistory(uniqueHistory);
      } catch (error) {
        console.error("Error fetching connection history:", error);
      }
    };

    if (isVisible) {
      fetchConnectionHistory();
    }
  }, [userId, isVisible]);

  const getUniqueConnections = (connections) => {
    const uniqueConnections = [];
    const userIds = new Set();

    connections.forEach((connection) => {
      const userId = connection.connectedUserId._id;
      if (!userIds.has(userId)) {
        userIds.add(userId);
        uniqueConnections.push(connection);
      }
    });

    return uniqueConnections;
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const handleCallClick = (connection) => {
    if (isPremium) {
      window.location.href = `http://localhost:3000/${connection.connectedUserId.socketID}`;
    } else {
      handleOpenMoneyPanel(t.upgradeMessage);
      onClose();
      return;
    }
  };

  return isVisible ? (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOutsideClick}>
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}>
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {t.connectionHistoryTitle}
        </h2>
        <ul className="space-y-4">
          {history.map((connection, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div>
                <div className="text-lg font-semibold">
                  {connection.connectedUserId.name}
                </div>
                <div className="text-sm text-gray-500">
                  {connection.connectedUserId.email} -{" "}
                  {connection.connectedUserId.userCountry}
                </div>
              </div>
              <button
                onClick={() => handleCallClick(connection)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                {t.callButton}
              </button>
            </li>
          ))}
        </ul>
        {history.length === 0 && (
          <p className="text-center text-gray-500 mt-4">{t.noHistoryMessage}</p>
        )}
      </div>
    </div>
  ) : null;
};

export default ConnectionHistory;
