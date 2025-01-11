// CategoryForm.js
import React, { useState } from "react";

const CategoryForm = ({ categories, onSubmit }) => {
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");

  const handleAddCategory = () => {
    onSubmit({
      categoryName,
      subcategoryName,
      selectedParentCategory,
    });
    setCategoryName("");
    setSubcategoryName("");
    setSelectedParentCategory("");
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Category Name
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleAddCategory}>
        Add Category
      </button>
      <div className="my-8">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Parent Category
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedParentCategory}
          onChange={(e) => setSelectedParentCategory(e.target.value)}>
          <option value="">Select Parent Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Subcategory Name
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter subcategory name"
          value={subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleAddCategory}>
        Add Subcategory
      </button>
    </div>
  );
};

export default CategoryForm;
