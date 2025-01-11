// ReportForm.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = "http://localhost:5000";
const ReportForm = ({ reporterId, reportedUserId, socket }) => {
  const [description, setDescription] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${backendUrl}/api/items/Report`,
        {
          reporter: reporterId,
          reportedUser: reportedUserId,
          description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Report submitted successfully.");
      setIsReporting(false);
      setDescription("");
    } catch (error) {
      toast.error("Failed to submit the report.");
    }

    // try {
    //   await axios.post("http://localhost:5000/api/reports", {
    //     reporter: reporterId,
    //     reportedUser: reportedUserId,
    //     description,
    //   });
    //   toast.success("Report submitted successfully.");
    //   setIsReporting(false);
    //   setDescription("");
    // } catch (error) {
    //   toast.error("Failed to submit the report.");
    // }
  };

  return (
    <div className="absolute left-2 bottom-0 z-20">
      {isReporting && (
        <form onSubmit={handleReportSubmit} className="mt-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full p-2 border rounded"
            required></textarea>
          <button
            type="submit"
            className="mt-2 p-2 bg-red-600 text-white rounded">
            Submit Report
          </button>
        </form>
      )}
      <button
        onClick={() => setIsReporting(!isReporting)}
        className="text-red-600 hover:text-red-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default ReportForm;
