// src/components/Home/Actionbutton.js
import React from "react";

function Actionbutton({ openGenderModal, openCountryModal }) {
  return (
    <div>
      <div className="absolute bottom-0 left-0 right-0 md:p-4 flex md:flex-row flex-col items-center justify-around space-x-2 z-50 md:w-[50%] md:mb-0 mb-5">
        <div className="md:w-full flex md:justify-between md:basis-[60%] flex-row w-full justify-center gap-8 md:gap-0 my-5 md:my-0">
          <button
            className="bg-gray-800 md:text-xl text-white p-3 font-bold flex justify-center items-center rounded-full"
            onClick={openGenderModal}>
            <img src="/svg/gender.svg" alt="Gender Icon" className="h-6 w-6 " />
            <div className="ml-3">Gender</div>
            <img
              src="/svg/arrow-up.svg"
              alt="Arrow Icon"
              className="h-7 w-7 ml-2 pt-1"
            />
          </button>

          <button
            className="bg-gray-800 md:text-xl text-white p-3 font-bold flex justify-center items-center rounded-full"
            onClick={openCountryModal}>
            <img src="/svg/glob.svg" alt="Country Icon" className="h-6 w-6" />
            <div className="ml-3">Country</div>
            <img
              src="/svg/arrow-up.svg"
              alt="Arrow Icon"
              className="h-7 w-7 ml-2 pt-1"
            />
          </button>
        </div>
        <div className="md:w-full md:flex md:justify-end md:basis-[40%]">
          <button className="bg-white text-green-900 md:py-3 py-2 px-4 md:text-xl font-bold flex justify-center items-center rounded-full">
            <img
              src="/svg/cam.svg"
              alt="Camera Icon"
              className="h-8 w-8 mr-2"
            />
            <div>Start Video Chat</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Actionbutton;
