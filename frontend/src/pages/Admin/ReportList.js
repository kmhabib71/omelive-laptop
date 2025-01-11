import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportResponse = await axios.get(
          "http://localhost:5000/api/items/Report"
        );
        const reportsWithUsers = await Promise.all(
          reportResponse.data.items.map(async (report) => {
            const reporterResponse = await axios.get(
              `http://localhost:5000/api/items/User/${report.reporter}`
            );
            const reportedUserResponse = await axios.get(
              `http://localhost:5000/api/items/User/${report.reportedUser}`
            );
            return {
              ...report,
              reporter: reporterResponse.data,
              reportedUser: reportedUserResponse.data,
            };
          })
        );
        setReports(reportsWithUsers);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleConnect = (socketId) => {
    navigate(`/${socketId}`);
  };

  const handleBlock = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/items/User/${userId}`, {
        isBlocked: true,
      });
      alert("User has been blocked.");
      // Optionally, refresh the reports list
      setReports(
        reports.filter((report) => report.reportedUser._id !== userId)
      );
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user.");
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
      <h1 className="text-2xl font-bold mb-4">Reported Users</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Reporter</th>
            <th className="py-2 px-4 border-b">Reported User</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td className="py-2 px-4 border-b">{report.reporter.email}</td>
              <td className="py-2 px-4 border-b">
                {report.reportedUser.email}
              </td>
              <td className="py-2 px-4 border-b">{report.description}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  onClick={() => handleConnect(report.reportedUser.socketID)}>
                  Connect
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={() => handleBlock(report.reportedUser._id)}>
                  Block
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportList;
