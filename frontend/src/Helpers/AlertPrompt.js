import React, { useState, useEffect, useRef } from "react";

const AlertPrompt = ({
  message,
  onConfirm,
  onCancel,
  isAsking,
  isSuccess,
  onClose,
}) => {
  const promptRef = useRef(null);

  const handleClickOutside = (event) => {
    if (promptRef.current && !promptRef.current.contains(event.target)) {
      // Click occurred outside the prompt, trigger close action
      onCancel();
      onClose();
    }
  };

  useEffect(() => {
    // Add event listener when component mounts
    window.addEventListener("click", handleClickOutside);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (isSuccess) {
      // Automatically close the success prompt after 10 seconds
      const timeoutId = setTimeout(() => {
        onClose();
      }, 10000);

      // Clear the timeout if the component unmounts or is closed manually
      return () => clearTimeout(timeoutId);
    }
  }, [isSuccess, onClose]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 ${
        isAsking ? "bg-blue-500" : isSuccess ? "bg-green-500" : "bg-red-500"
      }`}>
      <div ref={promptRef} className="bg-white p-8 rounded-md shadow-md ">
        <p
          className={`mb-4 text-${
            isAsking ? "blue" : isSuccess ? "green" : "red"
          }-600`}>
          {message}
        </p>
        {isAsking ? (
          <div className="flex justify-center">
            <button
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={onConfirm}>
              Confirm
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={onCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              className={`px-4 py-2 flex justify-center bg-${
                isSuccess ? "green" : "red"
              }-500 text-white rounded-md hover:bg-${
                isSuccess ? "green" : "red"
              }-600`}
              onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertPrompt;
