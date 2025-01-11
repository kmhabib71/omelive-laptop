// ManageTag.js
import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios if not already installed
import TagForm from "./Components/TagFrom";
import { Trash2 } from "react-feather";

const ManageTag = () => {
  const [Tag, setTag] = useState([]);

  const fetchTag = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tags"); // Replace with your API endpoint
      setTag(response.data);
      console.log("tags are :", response.data);
    } catch (error) {
      console.error("Error fetching Tag:", error.message);
    }
  };
  useEffect(() => {
    fetchTag();
  }, []);
  const handleDeleteTag = async (TagId) => {
    console.log("TagId is ", TagId);
    try {
      await axios.delete(`http://localhost:8080/api/deleteTag/${TagId}`); // Replace with your API endpoint
      // Refresh the Tag after deletion
      fetchTag();
    } catch (error) {
      console.error("Error deleting Tag:", error.message);
    }
  };

  const handleAddTag = async ({ TagName }) => {
    console.log({
      name: TagName,
    });
    try {
      await axios.post("http://localhost:8080/api/addTag", {
        name: TagName,
      });

      // Refresh the Tag after addition
      fetchTag();
    } catch (error) {
      console.error("Error adding Tag:", error.message);
    }
  };
  return (
    <div className="mt-24 mx-20 bg-white px-4 rounded-md drop-shadow-md">
      <h1 className="text-2xl font-semibold my-4">Manage Tag</h1>
      <TagForm Tag={Tag} onSubmit={handleAddTag} />
      <ul className="mt-4">
        <h1 className="text-2xl font-semibold my-4">Tag List</h1>
        {Tag.length === 0 ? (
          <p>No Tag found.</p>
        ) : (
          Tag.map((Tag) => (
            <li key={Tag._id} className="mb-4">
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span className="text-lg font-semibold">{Tag.name}</span>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteTag(Tag._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ManageTag;
