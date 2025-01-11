import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "./Modal";

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/items/User/${userId}`
        );
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTitle("");
    setModalContent(null);
  };

  const handleUpdate = async (field, value) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/items/User/${userId}`,
        {
          [field]: value,
        }
      );
      setUser(response.data);
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/items/User/${userId}`);
      navigate("/admin/user");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      {user && (
        <div className="bg-white shadow-md rounded p-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Field</th>
                <th className="py-2 px-4 border-b">Value</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Email</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "Edit Email",
                        <EmailForm
                          onSubmit={(value) => handleUpdate("email", value)}
                          initialValue={user.email}
                        />
                      )
                    }>
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Premium</td>
                <td className="py-2 px-4 border-b">
                  {user.isPremium ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() => handleUpdate("isPremium", !user.isPremium)}>
                    Toggle
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Chat Time Limit</td>
                <td className="py-2 px-4 border-b">
                  {user.chatTimeLimit} mins
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "Edit Chat Time Limit",
                        <ChatTimeLimitForm
                          onSubmit={(value) =>
                            handleUpdate("chatTimeLimit", value)
                          }
                          initialValue={user.chatTimeLimit}
                        />
                      )
                    }>
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  Daily Connection Attempts
                </td>
                <td className="py-2 px-4 border-b">
                  {user.connectionAttempts.dailyAttempts}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "Edit Daily Connection Attempts",
                        <DailyAttemptsForm
                          onSubmit={(value) =>
                            handleUpdate(
                              "connectionAttempts.dailyAttempts",
                              value
                            )
                          }
                          initialValue={user.connectionAttempts.dailyAttempts}
                        />
                      )
                    }>
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  Last Connection Attempt Date
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(
                    user.connectionAttempts.lastAttemptDate
                  ).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "Edit Last Connection Attempt Date",
                        <LastAttemptDateForm
                          onSubmit={(value) =>
                            handleUpdate(
                              "connectionAttempts.lastAttemptDate",
                              value
                            )
                          }
                          initialValue={user.connectionAttempts.lastAttemptDate}
                        />
                      )
                    }>
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Gender Filter</td>
                <td className="py-2 px-4 border-b">{user.filters.gender}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "Edit Gender Filter",
                        <GenderFilterForm
                          onSubmit={(value) =>
                            handleUpdate("filters.gender", value)
                          }
                          initialValue={user.filters.gender}
                        />
                      )
                    }>
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Age Range Filter</td>
                <td className="py-2 px-4 border-b">
                  {user.filters.ageRange.min} - {user.filters.ageRange.max}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "Edit Age Range Filter",
                        <AgeRangeFilterForm
                          onSubmit={(value) =>
                            handleUpdate("filters.ageRange", value)
                          }
                          initialValue={user.filters.ageRange}
                        />
                      )
                    }>
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Location Filter</td>
                <td className="py-2 px-4 border-b">{user.filters.location}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "Edit Location Filter",
                        <LocationFilterForm
                          onSubmit={(value) =>
                            handleUpdate("filters.location", value)
                          }
                          initialValue={user.filters.location}
                        />
                      )
                    }>
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Interests Filter</td>
                <td className="py-2 px-4 border-b">
                  {user.filters.interests.join(", ")}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "Edit Interests Filter",
                        <InterestsFilterForm
                          onSubmit={(value) =>
                            handleUpdate("filters.interests", value)
                          }
                          initialValue={user.filters.interests}
                        />
                      )
                    }>
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Virtual Gifts</td>
                <td className="py-2 px-4 border-b">
                  {user.virtualGifts.length}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "View Virtual Gifts",
                        <VirtualGiftsForm gifts={user.virtualGifts} />
                      )
                    }>
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Admin</td>
                <td className="py-2 px-4 border-b">
                  {user.isAdmin ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() => handleUpdate("isAdmin", !user.isAdmin)}>
                    Toggle
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Chat History</td>
                <td className="py-2 px-4 border-b">
                  {user.chatHistory.length} records
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      openModal(
                        "View Chat History",
                        <ChatHistoryForm history={user.chatHistory} />
                      )
                    }>
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Delete User</td>
                <td className="py-2 px-4 border-b"></td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={handleDelete}>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
    </div>
  );
};

const EmailForm = ({ onSubmit, initialValue }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2">
        Email:
        <input
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded">
        Save
      </button>
    </form>
  );
};

const ChatTimeLimitForm = ({ onSubmit, initialValue }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2">
        Chat Time Limit:
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded">
        Save
      </button>
    </form>
  );
};

const DailyAttemptsForm = ({ onSubmit, initialValue }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2">
        Daily Attempts:
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded">
        Save
      </button>
    </form>
  );
};

const LastAttemptDateForm = ({ onSubmit, initialValue }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2">
        Last Attempt Date:
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded">
        Save
      </button>
    </form>
  );
};

const GenderFilterForm = ({ onSubmit, initialValue }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2">
        Gender:
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full mt-1 p-2 border rounded">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded">
        Save
      </button>
    </form>
  );
};

const AgeRangeFilterForm = ({ onSubmit, initialValue }) => {
  const [min, setMin] = useState(initialValue.min);
  const [max, setMax] = useState(initialValue.max);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ min, max });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2">
        Min Age:
        <input
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
          required
        />
      </label>
      <label className="block mb-2">
        Max Age:
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded">
        Save
      </button>
    </form>
  );
};

const LocationFilterForm = ({ onSubmit, initialValue }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2">
        Location:
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded">
        Save
      </button>
    </form>
  );
};

const InterestsFilterForm = ({ onSubmit, initialValue }) => {
  const [value, setValue] = useState(initialValue.join(", "));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value.split(",").map((interest) => interest.trim()));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2">
        Interests:
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded">
        Save
      </button>
    </form>
  );
};

const VirtualGiftsForm = ({ gifts }) => (
  <div>
    {gifts.length === 0 ? (
      <p>No virtual gifts</p>
    ) : (
      <ul>
        {gifts.map((gift) => (
          <li key={gift._id}>{gift.name}</li>
        ))}
      </ul>
    )}
  </div>
);

const ChatHistoryForm = ({ history }) => (
  <div>
    {history.length === 0 ? (
      <p>No chat history</p>
    ) : (
      <ul>
        {history.map((record, index) => (
          <li key={index}>{new Date(record.endedAt).toLocaleString()}</li>
        ))}
      </ul>
    )}
  </div>
);

export default UserDetails;
