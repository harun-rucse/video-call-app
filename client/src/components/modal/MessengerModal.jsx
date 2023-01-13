import React, { useState, useContext, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import Modal from "./index";
import ModalHeader from "./ModalHeader";
import { AppContext } from "../../context/AppContext";

const LeftMessage = ({ message, username, time }) => {
  return (
    <div className="flex flex-col items-start gap-1 text-xs lg:text-sm ">
      <p className="flex items-center gap-3">
        <span className="text-gray-400">{username}</span>
        <span className="text-gray-500 text-xs">{time}</span>
      </p>
      <div className="bg-[#2d303e] p-2 rounded-xl">{message}</div>
    </div>
  );
};

const RightMessage = ({ message, username, time }) => {
  return (
    <div className="flex flex-col items-end justify-end gap-1 text-xs lg:text-sm">
      <p className="flex items-center gap-3">
        <span className="text-gray-500 text-xs">{time}</span>
        <span className="text-gray-400">{username}</span>
      </p>
      <div className="bg-[#0055ff] p-2 rounded-xl">{message}</div>
    </div>
  );
};

function MessengerModal({ open, handleOnClose }) {
  const [message, setMessage] = useState("");
  const [showMessages, setShowMessages] = useState([]);

  const { sendMessageUsingDataChannel, remoteMessage } = useContext(AppContext);

  useEffect(() => {
    if (remoteMessage)
      setShowMessages((prev) => [...prev, { type: "other", value: remoteMessage, date: currentTimestamp() }]);
  }, [remoteMessage]);

  const handleMessageSend = () => {
    sendMessageUsingDataChannel(message);
    setShowMessages((prev) => [...prev, { type: "my", value: message, date: currentTimestamp() }]);
    setMessage("");
  };

  const currentTimestamp = () => {
    return new Date().toLocaleTimeString();
  };

  return (
    <Modal open={open}>
      <ModalHeader title="Room messages" handleOnClose={handleOnClose} />
      <div className="flex flex-col gap-1 px-4 py-2">
        <div className="h-[12rem] lg:h-[29rem] flex flex-col gap-2 mb-4 overflow-y-auto">
          {showMessages.map((msg, i) => {
            return msg.type === "my" ? (
              <RightMessage key={i} message={msg.value} username="Me" time={msg.date} />
            ) : (
              <LeftMessage key={i} message={msg.value} username="Friend" time={msg.date} />
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <input
            className="w-full bg-[#2d303e] p-3 rounded-lg text-sm text-gray-400 focus:outline-none"
            type="text"
            placeholder="Sent a message to everyone"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-[#0055ff] px-3 py-2 rounded-lg flex justify-center items-center cursor-pointer hover:bg-[#316de6] disabled:cursor-not-allowed disabled:bg-blue-400"
            onClick={handleMessageSend}
            disabled={!message}
          >
            <FiSend color="#fff" size={20} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default MessengerModal;
