import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AlertPrompt from "../../Helpers/AlertPrompt";
import LoadingSpinner from "../../Helpers/LoadingSpinner";
function Settings({ USERID }) {
  const [userid, setuserid] = useState(USERID);

  //   console.log("Settings userid is :", userid);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    role: "",
  });
  const [file, setFile] = useState(null);
  //   .............Prompt.........../////

  const [showPrompt, setShowPrompt] = useState(false);
  const [isAsking, setIsAsking] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessage, setIsMessage] = useState("Do you want to save change?");

  const handleConfirm = async () => {
    // Perform your confirmation logic here
    // Set showPrompt to false to close the prompt
    try {
      // Set isLoading to true to show the loading spinner
      setShowPrompt(false);
      setIsLoading(true);

      const response = await axios.post(
        `http://localhost:8080/api/updateUserData/${userid}`,
        formData
      );

      if (response.status === 200) {
        // Data submitted successfully
        console.log("Data submitted successfully:", response.data);

        // Show success prompt
        setShowPrompt(true);
        setIsAsking(false);
        setIsSuccess(true);
        setIsMessage("Profile Updated Successfully");
      } else {
        // Handle other HTTP status codes if needed
        console.error("Unexpected response status:", response.status);

        // Show error prompt
        setShowPrompt(true);
        setIsAsking(false);
        setIsSuccess(false);
        setIsMessage("Profile Updated failed");
      }
    } catch (error) {
      console.error("Error submitting data:", error.message);

      // Show error prompt
      setShowPrompt(true);
      setIsAsking(false);
      setIsSuccess(false);
      setIsMessage("Error submitting data");
    } finally {
      // Set isLoading to false regardless of success or failure
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Perform your cancellation logic here
    // Set showPrompt to false to close the prompt

    setShowPrompt(false);
  };
  //   .............Prmomp.........../////

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // console.log(
        //   "http://localhost:8080/api/user/${userid}",
        //   `http://localhost:8080/api/user/${userid}`
        // );
        const response = await axios.get(
          `http://localhost:8080/api/user/${userid}`
        );
        const userData = response.data; // Assuming your API returns user data
        console.log("userData is: ", userData);
        setFormData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    if (userid == "" || !userid) {
      var role = axios
        .get("http://localhost:8080/api/isAuth", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          // print the Role property of the response data
          if (response.data.Role) {
            setuserid(response.data.userid);
            console.log("userid :", response.data.userid);
            console.log("userRole :", response.data.Role);
          } else {
            window.location.href = "/";
          }
        })
        .catch((error) => {
          // handle errors
          console.error(error);
        });
    } else {
      fetchUserData();
    }
  }, [userid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPrompt(true);
    setIsAsking(true);
    setIsSuccess(false);
    setIsLoading(true); // Set isLoading to true when starting form submission

    // TODO: Add logic to submit the form data
    // handleConfirm();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div>
      {" "}
      {showPrompt && (
        <AlertPrompt
          message={isMessage}
          isAsking={isAsking}
          isSuccess={isSuccess}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onClose={() => {
            setShowPrompt(false);
            setIsMessage("Do you want to save change?");
          }}
        />
      )}
      <h2 className="text-2xl mt-28 mx-10  font-semibold mb-6">
        Account Settings
      </h2>
      <div className="mx-6">
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <div className="w-3/5 bg-white rounded-md shadow-md mr-5 max-w-content max-h-content">
              <h3 className="font-medium p-5 text-black  border-b">
                Personal Information
              </h3>
              <div className="p-6  ">
                <div className="mb-4 flex w-full">
                  <div className="w-2/4 mr-3">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-600">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="w-2/4 ml-3">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-600">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-600">
                    Bio
                  </label>
                  <textarea
                    type="text"
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
                    placeholder="Enter your role"
                    rows="6"
                  />
                </div>
                <div className="mb-4">
                  <div
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-600">
                    Role{" "}
                  </div>
                  <Link to="/admin/user-management/manage-role">
                    <div className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md">
                      {formData.role}
                    </div>
                  </Link>
                </div>
                <button
                  className="flex justify-center rounded bg-blue-600 py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                  type="submit">
                  {isLoading ? <LoadingSpinner /> : "Save Changes"}
                </button>
              </div>
            </div>
            <div style={{ maxHeight: "500px" }} className="w-2/5 ">
              <h3 className="font-medium p-5 text-black  border-b bg-white rounded-tl rounded-tr  shadow-md max-w-content max-h-content">
                Change Password
              </h3>
              <div className="p-6  bg-white  shadow-md max-w-content rounded-bl rounded-br max-h-content">
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-600">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={handleInputChange}
                      className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-600">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={handleInputChange}
                      className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {/* <button
                    className="flex justify-center rounded bg-blue-600 py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                    type="submit">
                    {isLoading ? <LoadingSpinner /> : "Save Changes"}
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
