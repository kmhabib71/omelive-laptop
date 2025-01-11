import React from "react";

function Checkbox({ checked, onChange, label }) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label className="text-xs text-gray-600">{label}</label>
    </div>
  );
}

export default Checkbox;
