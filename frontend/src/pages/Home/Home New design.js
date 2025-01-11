// src/components/VideoChat.js
import React, { useState, useRef, useEffect } from "react";
import Actionbutton from "../../components/Home/Actionbutton";
import Header from "../../components/Home/Header";
import ModalOne from "../../components/Home/ModalOne";
import ModalTwo from "../../components/Home/ModalTwo";
import GenderSelection from "../../components/Home/GenderSelection";
import CountrySelection from "../../components/Home/CountrySelection";
const VideoChat = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isPremium, setIsPremium] = useState(false); // Placeholder for premium status

  // ............Modal................

  const [isModalOneOpen, setModalOneOpen] = useState(false);
  const [isModalTwoOpen, setModalTwoOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openGenderModal = () => {
    setModalContent(<GenderSelection />);
    setModalOneOpen(true);
  };

  const openCountryModal = () => {
    setModalContent(<CountrySelection />);
    setModalOneOpen(true);
  };

  const closeModalOne = () => {
    setModalOneOpen(false);
  };

  const closeModalTwo = () => {
    setModalTwoOpen(false);
    closeModalOne();
  };

  const handleProceed = () => {
    if (!isPremium) {
      setModalTwoOpen(true);
    } else {
      closeModalOne();
    }
  };

  // ............Modal................
  useEffect(() => {
    // Sample video setup - Replace with actual WebRTC logic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex flex-col h-screen  bg-purple-gradient">
      <Header />
      <div className="video-wrapper flex-1 flex flex-col md:flex-row relative">
        <div className="md:flex-1 md:flex items-center justify-center relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="object-cover absolute top-0 right-0 h-[100px] w-[100px] md:w-full md:h-full z-20 border border-gray-100"></video>
        </div>
        <div className="flex-1 flex items-center justify-center  border-2 border-white relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="remote-video absolute top-0 left-0 w-full h-full object-cover bg-black"></video>
        </div>
      </div>

      <Actionbutton
        openGenderModal={openGenderModal}
        openCountryModal={openCountryModal}
      />

      <ModalOne
        isOpen={isModalOneOpen}
        onClose={closeModalOne}
        content={modalContent}
        onProceed={handleProceed}
      />
      <ModalTwo isOpen={isModalTwoOpen} onClose={closeModalTwo} />
      {/* <footer className="p-4 text-white text-center">
        <span>NaN are matching now!</span>
      </footer> */}
    </div>
  );
};

export default VideoChat;

// ...........Example one of props passing...............

// import React from "react";
// import MyComponent from "./MyComponent";

// const user = { name: "John Doe", age: 30 };
// const items = ["Item 1", "Item 2", "Item 3"];

// const App = () => {
//   const handleClick = () => alert("Button clicked!");

//   return (
//     <MyComponent
//       title="Welcome to My Component"
//       user={user}
//       items={items}
//       onClick={handleClick}
//       header={<h2>Header Content</h2>}
//       style={{ backgroundColor: "lightgray" }}
//       className="custom-class"
//     />
//   );
// };
// export default App;

// .........Example two........

// import React from "react";
// import ProfileCard from "./MyComponent";

// const App = () => {
//   const handleFollow = () => alert("You are now following this user!");

//   const renderAdditionalInfo = () => (
//     <div>
//       <h4>Additional Info</h4>
//       <p>This user is also a fan of open-source software.</p>
//     </div>
//   );

//   return (
//     <div className="app-container">
//       <ProfileCard
//         name="Jane Doe"
//         age={28}
//         hobbies={["Reading", "Traveling", "Photography"]}
//         profilePicture="https://via.placeholder.com/150"
//         onFollow={handleFollow}
//         renderAdditionalInfo={renderAdditionalInfo}
//         style={{
//           border: "1px solid #ccc",
//           padding: "20px",
//           borderRadius: "10px",
//         }}
//         className="custom-profile-card"
//       />
//     </div>
//   );
// };

// export default App;
