// src/components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-0 right-0 m-2">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
