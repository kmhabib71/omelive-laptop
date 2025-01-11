// ReceivedGift.js
import React from "react";
import { CSSTransition } from "react-transition-group";

const ReceivedGift = ({ gift, show }) => (
  <CSSTransition
    in={show}
    timeout={300}
    classNames={{
      enter: "opacity-0 scale-90",
      enterActive:
        "opacity-100 scale-100 transition-opacity transition-transform duration-300",
      exit: "opacity-100 scale-100",
      exitActive:
        "opacity-0 scale-90 transition-opacity transition-transform duration-300",
    }}
    unmountOnExit>
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 transform transition-transform duration-500 ease-in-out">
        <img src={gift.imageUrl} alt={gift.name} className="w-24 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800">{gift.name}</h3>
        <h5 className="text-2xl font-bold text-gray-800">${gift.value}</h5>
        <p className="text-lg text-gray-600">{gift.description}</p>
      </div>
    </div>
  </CSSTransition>
);

export default ReceivedGift;
