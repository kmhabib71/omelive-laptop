// src/components/GenderSelection.js
import React from "react";

const GenderSelection = () => {
  return (
    <div>
      <h2 className="bg-green-400">Select Gender</h2>
      <button onClick={() => alert("Male is selected")}>Male</button>
      <button>Female</button>
      <button>Other</button>
    </div>
  );
};

export default GenderSelection;
