import React from "react";
import { MdClose } from "react-icons/md";

function ModalHeader({ title, handleOnClose }) {
  return (
    <div className="flex justify-between border-b border-gray-600 pb-2 p-4">
      <p className="text-base text-white">{title}</p>
      <MdClose size={18} cursor="pointer" onClick={handleOnClose} />
    </div>
  );
}

export default ModalHeader;
