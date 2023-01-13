import React from "react";

function Dialog({ show, children }) {
  return (
    <div
      className={`${
        show ? "block" : "hidden"
      } fixed top-0 left-0 bg-gray-800/30 backdrop-blur-md w-full h-full z-[1000]`}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl">{children}</div>
    </div>
  );
}

export default Dialog;
