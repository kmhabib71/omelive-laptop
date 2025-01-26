import React from "react";

function Home() {
  return (
    <div>
      <div className="h-screen flex items-center justify-center bg-gradient-to-t from-[#bdcac4] via-[#8ae0d5] to-[#4565e3]">
        {/* Main Card Container */}
        {/* ......prothita buttoner jonno alada kore backgrounder color onujayi color set korte hobe jevabe chobite se kora hoisa*/}
        <div className="button-list mr-80">
          <div className="  pt-[1px] pl-[0.5px] pr-[0.7px] pb-[0.5px] bg-gradient-to-r from-[#cafef7] via-[#cafef7] to-[#cafef7] rounded-tl-[22%] border-b-2 border-gray-500 rounded-tr-[22%]  rounded-bl-[3%] rounded-br-[3%]  shadow-[-4px_1px_10px_rgba(0,0,0,0.3)]">
            {/* Inner Div for Content */}
            <div className="w-[4.5rem] h-20 bg-gradient-to-t  from-[#cbedfe] via-[#a2d7f6] to-[#a8d5f5] rounded-tl-[22%]  rounded-tr-[22%]  rounded-bl-[3%] rounded-br-[3%]  flex items-center justify-center">
              <div className=" h-8 w-8 bg-gradient-to-br from-[#ffffff]  to-[#A8ABF5] rounded-full shadow-[-3px_3px_5px_rgba(0,0,0,0.3)] font-bold text-center flex items-center justify-center text-[#4565e3]">
                B
              </div>
            </div>
          </div>
          <div className="  pt-[0.5px] pl-[0.5px] pr-[0.7px] pb-[0.5px] bg-gradient-to-r from-[#cafef7] via-[#cafef7] to-[#cafef7] rounded-tl-[3%]  rounded-tr-[3%]  rounded-bl-[3%] rounded-br-[3%]  shadow-[-4px_1px_10px_rgba(0,0,0,0.3)]">
            {/* Inner Div for Content */}
            <div className="w-[4.5rem] h-20 bg-gradient-to-t from-[#cbedfe] via-[#a2d7f6] to-[#a8d5f5] rounded-tl-[3%]  rounded-tr-[3%]  rounded-bl-[3%] rounded-br-[3%]  flex items-center justify-center">
              <div className=" h-8 w-8 bg-gradient-to-br from-[#ffffff]  to-[#A8ABF5] rounded-full shadow-[-3px_3px_5px_rgba(0,0,0,0.3)] font-bold text-center flex items-center justify-center text-[#4565e3]">
                D
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-64 h-40 bg-gradient-to-br from-[#8ae0d5] via-[#94D2F3] to-[#8ae0d5] rounded-[20px] p-[6px] shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#94D2F3] via-[#cafef7] to-[#cafef7] rounded-[20px] blur-md opacity-50 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#94D2F3] via-[#cafef7] to-[#cafef7] rounded-[20px] z-10"></div>
          {/* Inner Content */}
          <div className="relative w-full h-full bg-white rounded-[16px] overflow-hidden flex items-center justify-center shadow-lg z-10">
            {/* User Image */}
            <img
              src="images/user.jpg"
              alt="User"
              className="w-full h-full object-cover"
            />

            {/* Glare in Top-Right Corner */}
          </div>
          <div className="absolute top-[-6px] right-[-6px] w-8 h-8 bg-white rounded-full shadow-[0_0_20px_10px_rgba(255,255,255,0.8)] blur-[2px] opacity-80"></div>{" "}
        </div>

        {/* ...........button............. */}
      </div>
    </div>
  );
}

export default Home;
