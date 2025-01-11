import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider"; // Update this import based on where AuthProvider is located

const backendUrl = "https://omelive.online";

const DepositPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, authUser, loading } = useContext(AuthContext);
  const [depositAmount, setDepositAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [userLanguage, setUserLanguage] = useState("en");

  useEffect(() => {
    if (!loading && isLoggedIn && authUser) {
      setUserLanguage(authUser.language === "Türkçe" ? "tr" : "en");
    }
  }, [loading, isLoggedIn, authUser]);

  const t = {
    en: {
      depositTitle: "Deposit Funds",
      amountPlaceholder: "Enter amount",
      depositButton: "Deposit",
      depositSuccess: "Funds deposited successfully!",
      depositFailed: "Failed to deposit funds. Please try again.",
      depositMinimum: "Minimum deposit amount is $1.",
      depositInfo:
        "Please ensure that the deposit amount is correct. Funds will be credited to your account instantly after successful payment. If you face any issues, feel free to contact our support team.",
    },
    tr: {
      depositTitle: "Para Yatır",
      amountPlaceholder: "Tutarı girin",
      depositButton: "Yatır",
      depositSuccess: "Fonlar başarıyla yatırıldı!",
      depositFailed: "Fonlar yatırılırken hata oluştu. Lütfen tekrar deneyin.",
      depositMinimum: "Minimum para yatırma tutarı 1$'dır.",
      depositInfo:
        "Lütfen yatırılacak tutarın doğru olduğundan emin olun. Başarılı bir ödemeden sonra fonlar hesabınıza anında aktarılacaktır. Herhangi bir sorunla karşılaşırsanız, lütfen destek ekibimizle iletişime geçin.",
    },
  }[userLanguage];

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 1) {
      toast.error(t.depositMinimum);
      return;
    }

    // Save the deposit amount to localStorage
    localStorage.setItem("depositAmount", depositAmount);

    // Navigate to the payment page
    navigate("/payment");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    navigate("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Omolive.online</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center bg-gray-100 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">{t.depositTitle}</h2>
          <p className="text-gray-700 mb-4">{t.depositInfo}</p>
          <input
            type="number"
            placeholder={t.amountPlaceholder}
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={handleDeposit}
            disabled={isProcessing}
            className={`bg-blue-500 text-white py-2 px-4 rounded w-full ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            {isProcessing ? "Processing..." : t.depositButton}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4">
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

export default DepositPage;

// import React, { useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
// import { AuthContext } from "../Auth/AuthProvider"; // Update this import based on where AuthProvider is located

// const backendUrl = "https://omelive.online";

// const DepositPage = () => {
//     const navigate = useNavigate();
//   const { isLoggedIn, authUser, loading } = useContext(AuthContext);
//   const [depositAmount, setDepositAmount] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [userLanguage, setUserLanguage] = useState("en");

//   useEffect(() => {
//     if (!loading && isLoggedIn && authUser) {
//       setUserLanguage(authUser.language === "Türkçe" ? "tr" : "en");
//     }
//   }, [loading, isLoggedIn, authUser]);

//   const t = {
//     en: {
//       depositTitle: "Deposit Funds",
//       amountPlaceholder: "Enter amount",
//       depositButton: "Deposit",
//       depositSuccess: "Funds deposited successfully!",
//       depositFailed: "Failed to deposit funds. Please try again.",
//       depositMinimum: "Minimum deposit amount is $1.",
//       depositInfo: "Please ensure that the deposit amount is correct. Funds will be credited to your account instantly after successful payment. If you face any issues, feel free to contact our support team.",
//     },
//     tr: {
//       depositTitle: "Para Yatır",
//       amountPlaceholder: "Tutarı girin",
//       depositButton: "Yatır",
//       depositSuccess: "Fonlar başarıyla yatırıldı!",
//       depositFailed: "Fonlar yatırılırken hata oluştu. Lütfen tekrar deneyin.",
//       depositMinimum: "Minimum para yatırma tutarı 1$'dır.",
//       depositInfo: "Lütfen yatırılacak tutarın doğru olduğundan emin olun. Başarılı bir ödemeden sonra fonlar hesabınıza anında aktarılacaktır. Herhangi bir sorunla karşılaşırsanız, lütfen destek ekibimizle iletişime geçin.",
//     },
//   }[userLanguage];

//   const handleDeposit = async () => {
//     const amount = parseFloat(depositAmount);
//     if (isNaN(amount) || amount < 1) {
//       toast.error(t.depositMinimum);
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/users/${authUser.id}/deposit`,
//         { amount },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200) {
//         toast.success(t.depositSuccess);
//         setDepositAmount(""); // Clear the input field after a successful deposit
//       } else {
//         toast.error(t.depositFailed);
//       }
//     } catch (error) {
//       console.error("Error processing deposit:", error);
//       toast.error(t.depositFailed);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isLoggedIn) {
//     navigate("/"); ;
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header */}
//       <header className="bg-blue-600 text-white py-4 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-3xl font-bold">Omolive.online</h1>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow flex justify-center items-center bg-gray-100 py-8">
//         <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-2xl font-bold mb-4">{t.depositTitle}</h2>
//           <p className="text-gray-700 mb-4">{t.depositInfo}</p>
//           <input
//             type="number"
//             placeholder={t.amountPlaceholder}
//             value={depositAmount}
//             onChange={(e) => setDepositAmount(e.target.value)}
//             className="w-full p-2 mb-4 border rounded"
//           />
//           <button
//             onClick={handleDeposit}
//             disabled={isProcessing}
//             className={`bg-blue-500 text-white py-2 px-4 rounded w-full ${
//               isProcessing ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {isProcessing ? "Processing..." : t.depositButton}
//           </button>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-blue-600 text-white py-4">
//         <div className="container mx-auto text-center">
//           <p>&copy; 2024 Omolive.online. All rights reserved.</p>
//           <p>
//             For support, contact us at{" "}
//             <a href="mailto:support@omelive.online" className="underline">
//               support@omelive.online
//             </a>
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default DepositPage;
