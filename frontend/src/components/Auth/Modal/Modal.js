import React, { useRef } from "react";

const AuthModal = ({ isVisible, onClose, children }) => {
  const modalRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOutsideClick} // Attach the click handler to the overlay
    >
      <div
        ref={modalRef} // Reference to the modal content
        className="p-4 rounded  relative">
        {/* <button onClick={onClose} className="absolute top-0 right-0 m-2">
          &times;
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default AuthModal;
