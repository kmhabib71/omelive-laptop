import React from "react";

function Header() {
  return (
    <>
      <header className="md:flex hidden justify-between p-4 text-white">
        <nav className="flex space-x-8">
          <a
            href="#video-chat"
            className="text-lg font-extrabold hover:border-b-4 border-white "
            style={{ marginBottom: "9px" }}>
            Ome Live
          </a>
          {/* <a href="#live" className="text-lg">
        Live
      </a> */}
          <a
            href="#blog"
            className="text-lg font-bold hover:border-b-4 border-white "
            style={{ marginBottom: "9px" }}>
            Blog
          </a>
          <a
            href="#about"
            className="text-lg font-bold hover:border-b-4 border-white "
            style={{ marginBottom: "9px" }}>
            About
          </a>
        </nav>
        <div className="flex space-x-4 items-center">
          <button className="bg-white text-lg  text-black font-bold py-2 px-3 rounded-full flex justify-between items-center">
            <img src="/svg/crown.svg" alt="Gender Icon" className="h-6 w-6" />
            <div className="pl-2">Premium</div>
          </button>
          <button className="bg-white text-lg  text-black font-bold py-2 px-3 rounded-full flex justify-between items-center">
            <img src="/svg/clock.svg" alt="Gender Icon" className="h-6 w-6" />
            <div className="pl-2">History</div>
          </button>
          <button className="bg-white text-lg  text-black font-bold py-2 px-3 rounded-full flex justify-between items-center">
            <img src="/svg/user.svg" alt="Gender Icon" className="h-6 w-6" />
            <div className="pl-2">Profile</div>
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
