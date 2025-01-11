// components/UserTable.js
import React, { useState, useEffect } from "react";

const UserTable = ({ users, roles, onAssignRole }) => {
  console.log("users is:", users);

  // State for sorting
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // State for searching
  const [searchTerm, setSearchTerm] = useState("");

  // State for displayed users
  const [displayedUsers, setDisplayedUsers] = useState([]);

  // State for selected roles
  const [selectedRoles, setSelectedRoles] = useState({});

  // useEffect to update displayedUsers based on sorting and searching
  useEffect(() => {
    // Filter and sort users based on searchTerm and sortBy
    const filteredUsers = users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = filteredUsers.sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      return a[sortBy] > b[sortBy] ? order : -order;
    });

    setDisplayedUsers(sortedUsers);
  }, [users, searchTerm, sortBy, sortOrder]);

  // Function to handle role selection
  const handleRoleSelect = (userId, role) => {
    setSelectedRoles((prevRoles) => ({ ...prevRoles, [userId]: role }));
  };

  return (
    <div className="overflow-x-auto">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 border rounded w-full focus:outline-none hidden"
      />

      {/* User table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th
              onClick={() => setSortBy("email")}
              className="py-2 px-4 border-b cursor-pointer">
              Email
            </th>
            <th className="py-2 px-4 border-b">Role</th>
            {/* Add more columns as needed */}
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                {/* Dropdown for selecting roles */}
                <select
                  value={selectedRoles[user._id] || ""}
                  onChange={(e) => handleRoleSelect(user._id, e.target.value)}
                  className="block w-full p-2 border rounded focus:outline-none">
                  <option value="" className="text-gray">
                    {user.role ? user.role : "Select Role"}
                  </option>
                  {roles.map((role) => (
                    <option key={role._id} value={role.name}>
                      {role.name} -{" "}
                      <span>
                        {role.permissions
                          .map((permission) => permission.toLowerCase())
                          .join(", ")}
                      </span>
                    </option>
                  ))}
                </select>
              </td>
              {/* Add more cells as needed */}
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() =>
                    onAssignRole(user._id, selectedRoles[user._id])
                  }
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 focus:outline-none">
                  Assign Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
