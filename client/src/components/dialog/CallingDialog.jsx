import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiPhoneOff } from "react-icons/fi";
import Dialog from "./index";

function CallingDialog({ show, handleOnReject }) {
  return (
    <Dialog show={show}>
      <div className="min-w-[20rem] bg-gray-800 text-gray-200 px-6 py-5 rounded-lg flex flex-col items-center gap-8">
        <p className="text-xl leading-tight uppercase">Calling...</p>
        <div className="">
          <FaUserCircle className="text-9xl text-teal-600" />
        </div>
        <button
          className="bg-red-600 text-white text-sm px-4 py-2 flex items-center gap-2 rounded-lg"
          onClick={handleOnReject}
        >
          <FiPhoneOff className="text-xl" />
          <span>Reject</span>
        </button>
      </div>
    </Dialog>
  );
}

export default CallingDialog;
