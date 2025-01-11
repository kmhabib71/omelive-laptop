// src/components/ModalOne.js
import React from "react";

const ModalOne = ({ isOpen, onClose, content, onProceed }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
      onClick={onClose}>
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {content}
        <button
          onClick={onProceed}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Start
        </button>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded ml-2">
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalOne;
