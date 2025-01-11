import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000";

// Translation object
const translations = {
  en: {
    balanceTitle: "Your Balance",
    balanceLow: "Your balance is low. Please add more funds.",
    depositFunds: "Deposit Funds",
    upgradeTitle: "Upgrade to Premium",
    upgradeInfo:
      "Upgrade to premium for ${amount} and enjoy additional features!",
    upgradeButton: "Upgrade to Premium",
    premiumStatus: "You are a premium member. Enjoy your benefits!",
    transactionHistory: "Transaction History",
    insufficientBalance: "Insufficient balance to upgrade to premium.",
    membershipUpgraded: "Membership upgraded to premium successfully!",
    upgradeFailed: "Failed to upgrade membership. Please try again.",
    loadingError: "Failed to load financial data.",
  },
  tr: {
    balanceTitle: "Bakiyeniz",
    balanceLow: "Bakiyeniz düşük. Lütfen daha fazla fon ekleyin.",
    depositFunds: "Para Yatır",
    upgradeTitle: "Premium Üyeliğe Geçin",
    upgradeInfo:
      "Premium üyelik için ${amount} ödeyin ve ek özelliklerin keyfini çıkarın!",
    upgradeButton: "Premium Üyeliğe Geç",
    premiumStatus: "Bir premium üyesiniz. Avantajlarınızın tadını çıkarın!",
    transactionHistory: "İşlem Geçmişi",
    insufficientBalance: "Premium üyeliğe geçmek için yetersiz bakiye.",
    membershipUpgraded: "Üyelik başarıyla premium'a yükseltildi!",
    upgradeFailed: "Üyelik yükseltme başarısız. Lütfen tekrar deneyin.",
    loadingError: "Finansal veriler yüklenemedi.",
  },
};

const MoneyPanel = ({
  userId,
  isVisible,
  onClose,
  moneyModalMessage,
  userLanguage,
}) => {
  const [balance, setBalance] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [premiumCost, setPremiumCost] = useState(19); // Example premium membership cost
  const t = translations[userLanguage === "Türkçe" ? "tr" : "en"];

  useEffect(() => {
    // Fetch the user's current balance, membership status, and transaction history
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `${backendUrl}/api/users/${userId}`
        );
        const user = userResponse.data;
        setBalance(user.amountBalance);
        setIsPremium(user.isPremium);

        const transactionResponse = await axios.get(
          `${backendUrl}/api/users/${userId}/transactions`
        );
        setTransactions(transactionResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error(t.loadingError);
      }
    };

    if (isVisible) {
      fetchUserData();
    }
  }, [userId, isVisible, t.loadingError]);

  const handleDepositClick = () => {
    // Redirect to deposit page or open deposit modal
    console.log("Redirecting to deposit page...");
  };

  const handleUpgradeClick = async () => {
    // Check if the user has enough balance to upgrade to premium
    if (balance < premiumCost) {
      toast.error(t.insufficientBalance);
      return;
    }

    try {
      // Deduct the premium cost from the user's balance
      const updatedBalance = balance - premiumCost;

      // Update the user's balance and membership status in the database
      await axios.put(
        `${backendUrl}/api/users/${userId}/upgrade`,
        { amountBalance: updatedBalance, isPremium: true },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setBalance(updatedBalance);
      setIsPremium(true);
      toast.success(t.membershipUpgraded);
    } catch (error) {
      console.error("Error upgrading membership:", error);
      toast.error(t.upgradeFailed);
    }
  };

  // Close the modal when clicking outside of it
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return isVisible ? (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOutsideClick}>
      <div className="money-panel bg-white p-6 rounded-lg shadow-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}>
          &times; {/* This is the cross icon */}
        </button>
        {moneyModalMessage && (
          <div className=" bg-red-500 text-white p-2 mb-2">
            {moneyModalMessage}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">{t.balanceTitle}</h2>
        <div className="balance-display text-3xl mb-4">
          ${balance.toFixed(2)}
        </div>
        {balance < 10 && (
          <div className="balance-warning text-red-500 mb-4">
            {t.balanceLow}
          </div>
        )}
        <button
          onClick={handleDepositClick}
          className="deposit-button bg-blue-500 text-white py-2 px-4 rounded mb-4">
          {t.depositFunds}
        </button>

        {!isPremium && (
          <div className="upgrade-section mb-4">
            <h3 className="text-xl font-bold mb-2">{t.upgradeTitle}</h3>
            <div className="premium-info mb-2">
              {t.upgradeInfo.replace("${amount}", premiumCost.toFixed(2))}
            </div>
            <button
              onClick={handleUpgradeClick}
              className="upgrade-button bg-green-500 text-white py-2 px-4 rounded">
              {t.upgradeButton}
            </button>
          </div>
        )}

        {isPremium && (
          <div className="premium-status text-green-500 mb-4">
            {t.premiumStatus}
          </div>
        )}

        <h3 className="text-xl font-bold mb-2">{t.transactionHistory}</h3>
        <ul
          className={`transaction-list ${
            transactions.length > 0 ? "h-[25vh] overflow-y-scroll" : ""
          }`}>
          {transactions.map((transaction) => (
            <li key={transaction._id} className="transaction-item mb-2">
              <div>{transaction.description}</div>
              <div>{new Date(transaction.createdAt).toLocaleString()}</div>
              <div
                className={`${
                  transaction.amount >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                {transaction.amount >= 0 ? `+` : ``}$
                {transaction.amount.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : null;
};

export default MoneyPanel;
