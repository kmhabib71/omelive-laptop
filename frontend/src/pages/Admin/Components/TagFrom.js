// TagForm.js
import React, { useState } from "react";

const TagForm = ({ Tags, onSubmit }) => {
  const [TagName, setTagName] = useState("");

  const handleAddTag = () => {
    onSubmit({
      TagName,
    });
    setTagName("");
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tag Name
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter Tag name"
          value={TagName}
          onChange={(e) => setTagName(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleAddTag}>
        Add Tag
      </button>
    </div>
  );
};

export default TagForm;
