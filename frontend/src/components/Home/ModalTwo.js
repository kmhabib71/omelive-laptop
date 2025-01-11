// src/components/ModalTwo.js
import React from "react";

const ModalTwo = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}>
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-xl font-bold mb-4">Premium Membership Required</h2>
        <p>
          To select a gender or country, please purchase a premium membership.
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalTwo;
