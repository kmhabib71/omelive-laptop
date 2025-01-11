import React, { useEffect, useState } from "react";
import axios from "axios";

const UserInformation = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "userAge",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/items/User"
        );
        console.log("response data: ", response.data);
        setUsers(response.data.items);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = sortConfig.key.split(".").reduce((obj, key) => obj[key], a);
    const bValue = sortConfig.key.split(".").reduce((obj, key) => obj[key], b);

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Information</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => handleSort("email")}>
              Email
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => handleSort("name")}>
              Name
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => handleSort("userGender")}>
              Gender
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => handleSort("userAge")}>
              Age
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => handleSort("userCountry")}>
              Country
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => handleSort("isPremium")}>
              Premium
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => handleSort("filters.gender")}>
              Filters
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => handleSort("connectionAttempts.dailyAttempts")}>
              Connection Attempts
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => handleSort("chatTimeLimit")}>
              Chat Time Limit
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.userGender}</td>
              <td className="py-2 px-4 border-b">{user.userAge}</td>
              <td className="py-2 px-4 border-b">{user.userCountry}</td>
              <td className="py-2 px-4 border-b">
                {user.isPremium ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b">
                {user.filters.gender}, {user.filters.ageRange.min}-
                {user.filters.ageRange.max}, {user.filters.location},{" "}
                {user.filters.interests.join(", ")}
              </td>
              <td className="py-2 px-4 border-b">
                {user.connectionAttempts.dailyAttempts} attempts on{" "}
                {new Date(
                  user.connectionAttempts.lastAttemptDate
                ).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">{user.chatTimeLimit} mins</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 p-2 rounded">
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 p-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default UserInformation;
