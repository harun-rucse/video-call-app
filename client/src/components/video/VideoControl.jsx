import React, { useContext } from "react";
import { BiMicrophone, BiMicrophoneOff, BiVideo, BiVideoOff, BiDotsHorizontalRounded } from "react-icons/bi";
import { MdCallEnd } from "react-icons/md";
import { FiInfo, FiUsers } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import { TbScreenShare, TbScreenShareOff } from "react-icons/tb";
import VideoButtonElement from "./VideoButtonElement";
import { AppContext } from "../../context/AppContext";

function VideoControl() {
  const {
    isMuted,
    isVideoOff,
    isScreenShare,
    isMessengerOpen,
    handleMuteUnmute,
    handleVideoShowHide,
    handleScreenShare,
    handleEndCall,
    handleClickRoomDetails,
    handleClickRoomMembers,
    handleClickMessenger,
    remoteMessage
  } = useContext(AppContext);

  return (
    <div className="flex justify-center md:justify-between items-center">
      <div />
      <div className="flex gap-3 lg:gap-5 justify-center lg:ml-20">
        {isMuted ? (
          <VideoButtonElement icon={BiMicrophoneOff} handleOnClick={handleMuteUnmute} />
        ) : (
          <VideoButtonElement icon={BiMicrophone} handleOnClick={handleMuteUnmute} />
        )}

        {isVideoOff ? (
          <VideoButtonElement icon={BiVideoOff} handleOnClick={handleVideoShowHide} />
        ) : (
          <VideoButtonElement icon={BiVideo} handleOnClick={handleVideoShowHide} />
        )}

        {isScreenShare ? (
          <VideoButtonElement icon={TbScreenShareOff} handleOnClick={handleScreenShare} />
        ) : (
          <VideoButtonElement icon={TbScreenShare} handleOnClick={handleScreenShare} />
        )}

        <VideoButtonElement icon={BiDotsHorizontalRounded} />
        <VideoButtonElement
          icon={MdCallEnd}
          className="bg-red-700 hover:bg-red-500 px-6 md:px-8"
          handleOnClick={handleEndCall}
        />
      </div>
      <div className="hidden md:flex gap-3 lg:gap-5 justify-center pr-4 md:pr-10">
        <VideoButtonElement icon={FiInfo} handleOnClick={handleClickRoomDetails} />
        <VideoButtonElement icon={FiUsers} notification handleOnClick={handleClickRoomMembers} />
        <VideoButtonElement
          icon={BsChatDots}
          notification={remoteMessage && !isMessengerOpen}
          handleOnClick={handleClickMessenger}
        />
      </div>
    </div>
  );
}

export default VideoControl;
