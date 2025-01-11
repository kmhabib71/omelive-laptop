// ManageCategories.js
import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios if not already installed
import CategoryForm from "./Components/CategoryForm";
import { Trash2 } from "react-feather";
// import "./ManageCategories.css";
const ManageCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/AllCategoriesWithSubCategory"
      ); // Replace with your API endpoint
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const handleDeleteCategory = async (categoryId) => {
    console.log("categoryId is ", categoryId);
    try {
      await axios.delete(
        `http://localhost:8080/api/deleteCategories/${categoryId}`
      ); // Replace with your API endpoint
      // Refresh the categories after deletion
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/categories/${categoryId}/subcategories/${subcategoryId}`
      ); // Replace with your API endpoint
      // Refresh the categories after deletion
      fetchCategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error.message);
    }
  };
  const handleAddCategory = async ({
    categoryName,
    subcategoryName,
    selectedParentCategory,
  }) => {
    console.log({
      name: categoryName,
      subcategories: subcategoryName,
      parentCategory: selectedParentCategory,
    });
    try {
      await axios.post("http://localhost:8080/api/addCategories", {
        name: categoryName,
        subcategories: subcategoryName,
        parentCategory: selectedParentCategory,
      });

      // Refresh the categories after addition
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error.message);
    }
  };
  return (
    <div className="mt-24 mx-20 bg-white px-4 rounded-md drop-shadow-md">
      <h1 className="text-2xl font-semibold my-4">Manage Categories</h1>
      <CategoryForm categories={categories} onSubmit={handleAddCategory} />
      <ul className="mt-4">
        <h1 className="text-2xl font-semibold my-4">Category List</h1>
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          categories.map((category) => (
            <li key={category._id} className="mb-4">
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span className="text-lg font-semibold">{category.title}</span>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteCategory(category._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <ul className="ml-4">
                {category.items.map((subcategory) => (
                  <li
                    key={subcategory._id}
                    className="flex items-center text-gray-600">
                    <span>{subcategory.name}</span>
                    <button
                      className="text-red-500 ml-2 bg-none"
                      onClick={() =>
                        handleDeleteSubcategory(category._id, subcategory._id)
                      }>
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ManageCategories;
