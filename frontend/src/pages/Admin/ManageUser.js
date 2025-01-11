import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
// ... (previous imports)

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", password: "" });

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/deleteUsersManually/${userId}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mt-24 p-4">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-start">Email</th>
            <th className="py-2 px-4 text-start">Role</th>
            {/* <th className="py-2 px-4 text-start">Article Count</th> */}
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-2 px-4">
                <Link
                  to={`/admin/news-management/NewsList/user/${user._id}`}
                  className="text-blue-500">
                  {user.email}
                </Link>
              </td>
              <td className="py-2 px-4">{user.role}</td>

              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-500 ">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUser;
