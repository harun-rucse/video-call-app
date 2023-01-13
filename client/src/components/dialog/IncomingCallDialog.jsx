import React, { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiPhoneOutgoing, FiPhoneOff } from "react-icons/fi";
import Dialog from "./index";

function IncomingCallDialog({ show, handleOnAccept, handleOnDecline }) {
  return (
    <Dialog show={show}>
      <div className="min-w-[20rem] bg-gray-800 text-gray-200 px-6 py-5 rounded-lg flex flex-col items-center gap-8">
        <p className="text-xl leading-tight uppercase">Incoming Video Call</p>
        <div className="">
          <FaUserCircle className="text-9xl text-teal-600" />
        </div>
        <div className="flex items-center gap-10">
          <button
            className="bg-green-700 text-white text-sm px-4 py-2 flex items-center gap-2 rounded-lg"
            onClick={handleOnAccept}
          >
            <FiPhoneOutgoing className="text-xl" />
            <span>Accept</span>
          </button>
          <button
            className="bg-red-600 text-white text-sm px-4 py-2 flex items-center gap-2 rounded-lg"
            onClick={handleOnDecline}
          >
            <FiPhoneOff className="text-xl" />
            <span>Decline</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default IncomingCallDialog;
