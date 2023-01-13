import React, { useState, useContext } from "react";
import { RxCopy } from "react-icons/rx";
import { BiMicrophone, BiMicrophoneOff, BiVideo, BiVideoOff, BiDotsHorizontalRounded } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import { AppContext } from "../../context/AppContext";

const ButtonElement = ({ icon: Icon, handleOnClick }) => {
  return (
    <div className="flex justify-center items-center rounded-full border border-white p-3 cursor-pointer">
      <Icon size={20} className="text-white" onClick={handleOnClick} />
    </div>
  );
};

function JoinRequest() {
  const [value, setValue] = useState("John");
  const [isCopied, setIsCopied] = useState(false);

  const { localVideoRef, isMuted, isVideoOff, handleMuteUnmute, handleVideoShowHide } = useContext(AppContext);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleJoin = () => {
    console.log("Join");
  };

  const handleClickSettings = () => {
    console.log("Settings");
  };

  return (
    <div className="bg-[#111010] w-full h-full">
      <div className="flex justify-center mt-4">
        <div className="bg-white w-1/2 flex items-center gap-5 p-3 rounded-xl">
          <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden self-start relative">
            <video
              ref={localVideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "rotateY(180deg)" }}
              autoPlay
            />
            {isVideoOff && (
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl">
                Camera is off
              </p>
            )}
            <div className="absolute bottom-3 w-full flex gap-5 justify-center">
              {isMuted ? (
                <ButtonElement icon={BiMicrophoneOff} handleOnClick={handleMuteUnmute} />
              ) : (
                <ButtonElement icon={BiMicrophone} handleOnClick={handleMuteUnmute} />
              )}

              {isVideoOff ? (
                <ButtonElement icon={BiVideoOff} handleOnClick={handleVideoShowHide} />
              ) : (
                <ButtonElement icon={BiVideo} handleOnClick={handleVideoShowHide} />
              )}

              <ButtonElement icon={BiDotsHorizontalRounded} handleOnClick={handleClickSettings} />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full pt-4">
            <h2 className="text-black text-lg font-bold">Join Room</h2>
            <input
              className="w-full bg-transparent text-base px-4 py-2 rounded-lg text-black border border-black focus:outline-none"
              type="text"
              placeholder="Enter RoomId"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              className="bg-[#0055ff] hover:bg-[#3c7cfd] text-white text-base font-semibold rounded-lg outline-none border-none px-4 py-2"
              onClick={handleJoin}
            >
              Join
            </button>
            <div className="flex flex-col gap-3 mt-3">
              <p className="text-black text-lg font-semibold">Share the link</p>
              <div className="bg-[#f5f7fa] text-black px-4 py-2 rounded-lg flex justify-between items-center gap-2">
                <div className="flex flex-col gap-3 mt-4">
                  <p className="text-xs font-semibold">Copy link:</p>
                  <p className="text-sm font-semibold text-gray-400">http://localhost:3000/room/123</p>
                </div>
                <div>
                  {isCopied ? (
                    <MdDone color="#10b981" size={24} className="cursor-pointer font-bold" />
                  ) : (
                    <RxCopy
                      color="#0055ff"
                      size={20}
                      className="cursor-pointer"
                      onClick={() => handleCopy("http://localhost:3000/room/123")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinRequest;
