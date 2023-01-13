import React, { useState, useContext } from "react";
import { RxCopy } from "react-icons/rx";
import { BiMicrophone, BiMicrophoneOff, BiVideo, BiVideoOff, BiDotsHorizontalRounded } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import CallingDialog from "../components/dialog/CallingDialog";
import IncomingCallDialog from "../components/dialog/IncomingCallDialog";
import InfoDialog from "../components/dialog/InfoDialog";
import { AppContext } from "../context/AppContext";

const ButtonElement = ({ icon: Icon, handleOnClick }) => {
  return (
    <div className="flex justify-center items-center rounded-full border border-white p-3 cursor-pointer">
      <Icon size={20} className="text-white" onClick={handleOnClick} />
    </div>
  );
};

function Home() {
  const [calleeSocketId, setCalleeSocketId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const {
    socketId,
    infoDialog,
    showCallingDialog,
    showIncomingCallDialog,
    handleJoin,
    handleAccept,
    handleDecline,
    localVideoRef,
    isVideoOff,
    isMuted,
    handleMuteUnmute,
    handleVideoShowHide
  } = useContext(AppContext);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleClickSettings = () => {
    console.log("Settings");
  };

  const handleRejectCall = () => {
    console.log("Caller Reject Call");
  };

  return (
    <div className="bg-[#111010] w-full h-full">
      <div className="flex justify-center mt-4">
        <div className="bg-white w-2/3 mx-5 md:w-1/2 lg:w-1/2 flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-5 p-3 rounded-xl">
          <div className="relative w-full h-[14rem] lg:h-full bg-gray-900 rounded-xl overflow-hidden lg:self-start">
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

          <div className="flex flex-col gap-2 lg:gap-4 w-full pt-4">
            <h2 className="text-black text-base md:text-lg font-bold">Call Your Friends</h2>
            <input
              className="w-full bg-transparent text-sm md:text-base px-4 py-2 rounded-lg text-black border border-black focus:outline-none"
              type="text"
              placeholder="Enter Your Friend's Socket ID"
              value={calleeSocketId}
              onChange={(e) => setCalleeSocketId(e.target.value)}
            />
            <button
              className="bg-[#0055ff] hover:bg-[#3c7cfd] text-white text-sm md:text-base font-semibold rounded-lg outline-none border-none px-4 py-2 disabled:cursor-not-allowed disabled:bg-blue-400"
              onClick={() => handleJoin(calleeSocketId)}
              disabled={!calleeSocketId}
            >
              Join
            </button>
            <div className="flex flex-col gap-3 mt-3">
              <p className="text-black text-base md:text-lg font-semibold">Share the code</p>
              <div className="bg-[#f5f7fa] text-black px-4 py-1 md:py-2 rounded-lg flex justify-between items-center gap-2">
                <div className="flex flex-col gap-3 mt-4">
                  <p className="text-xs font-semibold">Copy Your Personal Code:</p>
                  <p className="text-sm font-semibold text-gray-400">{socketId}</p>
                </div>
                <div>
                  {isCopied ? (
                    <MdDone color="#10b981" size={24} className="cursor-pointer font-bold" />
                  ) : (
                    <RxCopy color="#0055ff" size={20} className="cursor-pointer" onClick={() => handleCopy(socketId)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IncomingCallDialog show={showIncomingCallDialog} handleOnAccept={handleAccept} handleOnDecline={handleDecline} />
      <CallingDialog show={showCallingDialog} handleOnReject={handleRejectCall} />
      <InfoDialog show={infoDialog.show} title={infoDialog.title} subtitle={infoDialog.subtitle} />
    </div>
  );
}

export default Home;
