// ManageRole.js
import React, { useState, useEffect } from "react";
import UserTable from "./Components/UserTable";
import axios from "axios";

const ManageRole = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from MongoDB Atlas using axios
    axios
      .get("http://localhost:8080/api/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  useEffect(() => {
    // Fetch available roles
    axios
      .get("http://localhost:8080/api/getRoles")
      .then((response) => setRoles(response.data))
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  const handleAssignRole = (userId, selectedRole) => {
    // Send a POST request to the server endpoint
    console.log("role userid: ", userId);
    console.log("role selectedRole: ", selectedRole);
    axios
      .post(`http://localhost:8080/api/assignRole/${userId}`, {
        role: selectedRole,
      })
      .then((response) => {
        console.log(response.data); // Log the server response
        // Handle success, e.g., update the state or show a success message
      })
      .catch((error) => {
        console.error("Error assigning role:", error.message);
        // Handle errors, e.g., show an error message to the user
      });
  };

  return (
    <div className="mt-24 p-6">
      <h1 className="text-xl font-bold mb-4">User Role Management </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <UserTable
          users={users}
          roles={roles}
          onAssignRole={handleAssignRole}
        />
      )}
    </div>
  );
};

export default ManageRole;
