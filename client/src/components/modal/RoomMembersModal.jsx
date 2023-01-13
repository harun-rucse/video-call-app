import React from "react";
import Modal from "./index";
import ModalHeader from "./ModalHeader";

const User = ({ name, isYou }) => {
  return (
    <div className="flex items-center gap-2 hover:bg-gray-700/50 px-4 py-2 rounded-lg">
      <div className="bg-gray-600 w-8 lg:w-10 h-8 lg:h-10 p-2 rounded-full flex justify-center items-center">
        {name[0]}
      </div>
      <p className="text-xs lg:text-sm">
        {name} {isYou && "(You)"}
      </p>
    </div>
  );
};

function RoomMembersModal({ open, handleOnClose }) {
  return (
    <Modal open={open}>
      <ModalHeader title="Room members" handleOnClose={handleOnClose} />
      <div className="flex flex-col gap-1 mt-5 md:h-[15rem] lg:h-[33rem] overflow-y-auto">
        <User name="John" isYou />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
        <User name="Michel" />
      </div>
    </Modal>
  );
}

export default RoomMembersModal;
