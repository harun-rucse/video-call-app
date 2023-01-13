import React from "react";

function Modal({ open, children }) {
  return (
    <div className={`${open ? "block" : "hidden"} w-1/3 h-[20rem] lg:h-full bg-[#242736] rounded-2xl`}>{children}</div>
  );
}

export default Modal;
