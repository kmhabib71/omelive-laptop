import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const userCountRef = useRef(userCount); // Ref to store the latest user count
  const [userCounts, setUserCounts] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCountResponse = await axios.get(
          "http://localhost:5000/api/items/User"
        );
        console.log("userCountResponse: ", userCountResponse);
        setTotalUser(userCountResponse.data.totalItems);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Listen for user count updates and set the user count state
    socket.on("current-users", (currentUsers) => {
      setUserCount(currentUsers.length);
      userCountRef.current = currentUsers.length; // Update the ref with the latest user count
    });

    return () => {
      socket.off("current-users");
    };
  }, []);

  useEffect(() => {
    // Function to update the chart
    const updateChart = () => {
      setUserCounts((prevCounts) => [...prevCounts, userCountRef.current]); // Use ref value
      const currentTime = new Date().toLocaleTimeString();
      setTimeLabels((prevLabels) => [...prevLabels, currentTime]);
    };

    // Set interval to update the chart every 60 seconds
    const interval = setInterval(updateChart, 6000); // 60,000 ms = 1 minute

    // Initial chart update
    updateChart();

    return () => {
      clearInterval(interval);
    };
  }, []); // Empty dependency array to ensure this effect runs only once

  const latestValuePlugin = {
    id: "latestValuePlugin",
    afterDatasetsDraw: (chart) => {
      const {
        ctx,
        chartArea: { left, right, top },
        scales: { x, y },
      } = chart;
      ctx.save();
      const latestIndex = chart.data.labels.length - 1;
      const latestValue = chart.data.datasets[0].data[latestIndex];
      const xPos = x.getPixelForValue(latestIndex);
      const yPos = y.getPixelForValue(latestValue);

      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "rgba(75,192,192,1)";
      ctx.textAlign = "center";
      ctx.fillText(latestValue, xPos, yPos - 10);
      ctx.restore();
    },
  };

  return (
    <div className="p-6 bg-gray-100 mt-20">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Total Users</h2>
        <p className="text-3xl">{totalUser}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold mb-2">Current Active Users</h2>
        <div style={{ height: "400px" }}>
          <Line
            data={{
              labels: timeLabels,
              datasets: [
                {
                  label: "Number of Users",
                  data: userCounts,
                  fill: false,
                  backgroundColor: "rgba(75,192,192,1)",
                  borderColor: "rgba(75,192,192,1)",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                latestValuePlugin: {},
              },
            }}
            plugins={[latestValuePlugin]}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
