import React from "react";

function TextInput({ type, name, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="shadow border rounded w-full mb-2 py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  );
}

export default TextInput;
