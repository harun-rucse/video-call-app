import React, { useState, useContext } from "react";
import { RxCopy } from "react-icons/rx";
import { MdDone } from "react-icons/md";
import Modal from "./index";
import ModalHeader from "./ModalHeader";
import { AppContext } from "../../context/AppContext";

function RoomDetailsModal({ open, handleOnClose }) {
  const [isCopied, setIsCopied] = useState(false);
  const { socketId } = useContext(AppContext);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Modal open={open}>
      <ModalHeader title="Room details" handleOnClose={handleOnClose} />
      <div className="p-4 flex flex-col gap-4 mt-4">
        <p className="text-sm">Copy Your Personal Code</p>
        <div className="bg-[#2d303e] flex justify-between items-center p-3 rounded-lg">
          <span className="text-xs lg:text-sm">{socketId}</span>
          {isCopied ? (
            <MdDone color="#10b981" size={24} className="cursor-pointer font-bold" />
          ) : (
            <RxCopy size={20} className="cursor-pointer" onClick={() => handleCopy(socketId)} />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default RoomDetailsModal;
