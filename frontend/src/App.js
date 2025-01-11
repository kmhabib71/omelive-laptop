import react from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Auth/Register";
import SignIn from "./pages/Auth/SignIn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AuthProvider from "./pages/Auth/AuthProvider";
import Logout from "./pages/Auth/Logout";
import Admin from "./pages/Admin/Admin";
import DepositPage from "./pages/Home/DepositPage";
import PaymentPage from "./pages/Home/PaymentPage";
import About from "./pages/Home/About";
import PrivacyPolicy from "./pages/Home/PrivacyPolicy";
import DistanceSalesAgreement from "./pages/Home/DistanceSalesAgreement";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:callerSocketId" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route
            path="/distanceSalesAgreement"
            element={<DistanceSalesAgreement />}
          />
          <Route path="/Admin/*" element={<Admin />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
