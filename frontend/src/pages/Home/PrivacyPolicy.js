import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <header className="flex justify-center items-center py-4 bg-blue-600 text-white text-2xl">
        omelive.online
      </header>
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p>
          Welcome to Omelive. Your privacy is important to us, and this Privacy
          Policy explains how we collect, use, and protect your information when
          you use Omelive.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h2>
        <p>
          <strong>Personal Information:</strong> This may include your email
          address, IP address, and other details necessary for account
          management.
        </p>
        <p>
          <strong>Usage Data:</strong> We collect information on how you
          interact with the Service to enhance user experience and maintain
          security.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          2. How We Use Your Information
        </h2>
        <p>
          <strong>To Operate the Service:</strong> We use your information to
          provide and improve our services.
        </p>
        <p>
          <strong>Security and Compliance:</strong> Your information helps us
          prevent fraud and ensure compliance with our terms.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
        <p>
          We do not sell or share your personal data with third parties without
          your consent unless required by law or as outlined in this policy.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Security</h2>
        <p>
          We use various security measures to protect your data, but no online
          system is 100% secure.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your data. Contact us
          at{" "}
          <a href="mailto:info@omelive.com" className="text-blue-500">
            info@omelive.com
          </a>{" "}
          for any requests.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Contact Us</h2>
        <p>
          For questions about this policy, please reach us at{" "}
          <a href="mailto:info@omelive.com" className="text-blue-500">
            info@omelive.com
          </a>
          .
        </p>
      </main>
      <footer className="flex justify-center items-center py-4 bg-gray-700 text-white text-sm">
        © 2024 omelive.online. All rights reserved.
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
