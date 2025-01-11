import React from "react";

const DistanceSalesAgreement = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <header className="flex justify-center items-center py-4 bg-blue-600 text-white text-2xl">
        omelive.online
      </header>
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-4">Distance Sales Agreement</h1>
        <p>
          This Distance Sales Agreement governs the sale of products/services
          from Omelive (“Seller”) to you (“Buyer”). By placing an order, you
          agree to the terms in this Agreement.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          1. Product Information
        </h2>
        <p>
          The characteristics and prices of the goods are provided on our
          website, and may be updated periodically.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          2. Order and Payment Terms
        </h2>
        <p>
          Orders are placed via the website. Upon completing your order, you
          agree to pay the displayed price. Payments can be made through the
          methods indicated during checkout.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          3. Return and Cancellation Policy
        </h2>
        <p>
          Returns: You may return the product within 1 day of receipt if it
          meets return eligibility conditions. Contact{" "}
          <a href="mailto:info@omelive.com" className="text-blue-500">
            info@omelive.com
          </a>{" "}
          for cancellation.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          4. Limitation of Liability
        </h2>
        <p>
          The merchant is not responsible for actions or issues beyond its
          control, including account theft or third-party transactions.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Delivery Terms</h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">
          5.1 Service Delivery
        </h3>
        <p>
          Our platform offers instant messaging and video chat services. These
          services are delivered digitally and do not require physical delivery.
          Users can start using our services immediately after completing their
          registration process.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">5.2 Access and Use</h3>
        <p>
          Users gain instant access to the platform once their membership is
          activated. For any access issues during the platform’s technical
          support hours, please contact our support team.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Return Terms</h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">6.1 Service Returns</h3>
        <p>
          Since our platform provides digital content and services, no refunds
          are available for purchased memberships or other digital services.
          However, if there is a significant technical issue that renders the
          service unusable, a user’s request will prompt an investigation, and a
          refund may be issued if deemed appropriate.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">
          6.2 Cancellation Terms
        </h3>
        <p>
          Users who do not wish to continue their membership can cancel their
          subscription. The cancellation will take effect at the end of the
          current billing period, and no refunds will be provided.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">
          6.3 Exceptional Circumstances
        </h3>
        <p>
          In the event that the service provided by the platform becomes
          inaccessible due to a provider-related issue, alternative solutions
          may be offered to users, or free access may be granted until service
          is restored.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          7. Complaints and Support
        </h2>
        <p>
          Users can submit any support or complaint requests through the
          communication channels within the platform or by contacting our
          support team. Your feedback is valuable to us in improving service
          quality.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">8. Right to Modify</h2>
        <p>
          Our platform reserves the right to modify the Delivery and Return
          Terms. Updated terms will be communicated to our users via the
          platform.
        </p>
      </main>
      <footer className="flex justify-center items-center py-4 bg-gray-700 text-white text-sm">
        © 2024 omelive.online. All rights reserved.
      </footer>
    </div>
  );
};

export default DistanceSalesAgreement;
