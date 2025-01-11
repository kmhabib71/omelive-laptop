import React from "react";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <header className="flex justify-center items-center py-4 bg-blue-600 text-white text-2xl">
        omelive.online
      </header>
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p>Welcome to Omelive!</p>
        <p>
          At Omelive, we’re taking the social experience of connecting online to
          a whole new level. As an advanced alternative to Omegle, our platform
          is designed for people looking to engage in meaningful, fun, and safe
          conversations with others around the world.
        </p>
        <p>
          We understand the importance of seamless, user-friendly interaction,
          so we’ve enhanced Omelive with improved features for a more enjoyable
          chat experience. Our platform allows you to connect via text or video,
          making it easier than ever to meet new friends, share your interests,
          and experience global perspectives—all at the click of a button.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h2>
        <p>
          Our mission at Omelive is to provide a modern, secure, and enjoyable
          environment for real-time communication. We aim to bridge gaps, foster
          connections, and create a place where people can meet, talk, and share
          in a safe and engaging way.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          Why Choose Omelive?
        </h2>
        <ul className="list-disc ml-6">
          <li className="mb-2">
            <strong>Advanced Technology:</strong> We've upgraded the traditional
            chat platform with state-of-the-art technology to support smoother,
            faster, and safer interactions.
          </li>
          <li className="mb-2">
            <strong>User-Centric Features:</strong> With additional safety tools
            and customizable chat options, we prioritize your privacy and
            convenience.
          </li>
          <li className="mb-2">
            <strong>Global Reach:</strong> Our platform connects users
            worldwide, offering endless possibilities for making new connections
            and learning from different cultures.
          </li>
        </ul>
        <p>
          Thank you for being part of Omelive. Together, let’s make online
          connections more impactful, secure, and enjoyable!
        </p>
      </main>
      <footer className="flex justify-center items-center py-4 bg-gray-700 text-white text-sm">
        © 2024 omelive.online. All rights reserved.
      </footer>
    </div>
  );
};

export default About;
