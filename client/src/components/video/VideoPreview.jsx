import React, { useContext } from "react";
import clsx from "clsx";
import Video from "./Video";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import RoomDetailsModal from "../modal/RoomDetailsModal";
import RoomMembersModal from "../modal/RoomMembersModal";
import MessengerModal from "../modal/MessengerModal";
import { AppContext } from "../../context/AppContext";

const UserInformation = ({ username, isYou, isMuted, className }) => {
  return (
    <div
      className={clsx("absolute flex items-center gap-2 bg-gray-800/60 px-2 py-1 rounded-lg text-xs z-20", className)}
    >
      {isMuted ? <BiMicrophoneOff color="#fff" /> : <BiMicrophone color="#fff" />}
      <span className="text-inherit">
        {username} {isYou && "(You)"}
      </span>
    </div>
  );
};

const MiniVideo = ({ videoRef, isVideoOff, username, isMuted, isScreenShare }) => {
  return (
    <div className="absolute flex items-center top-4 right-4 bg-gray-800 w-[10rem] md:w-[16rem] h-28 md:h-44 rounded-lg z-[100]">
      <div className="relative w-full h-24 md:h-36">
        <Video videoRef={videoRef} isScreenShare={isScreenShare} />
        {isVideoOff && (
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs md:text-base lg:text-lg">
            Camera is off
          </p>
        )}
        <UserInformation username={username} isYou isMuted={isMuted} className="bottom-0 right-2" />
      </div>
    </div>
  );
};

function VideoPreview() {
  const {
    remoteVideoRef,
    isRemoteAudioOff,
    isRemoteVideoOff,
    isRemoteScreenShare,
    localVideoRef,
    isMuted,
    isScreenShare,
    isVideoOff,
    isRoomDetailsOpen,
    setIsRoomDetailsOpen,
    isRoomMembersOpen,
    setIsRoomMembersOpen,
    isMessengerOpen,
    setIsMessengerOpen
  } = useContext(AppContext);

  return (
    <div className="flex h-[20rem] lg:h-[38rem] 2xl:h-[56rem] items-center gap-4">
      <div className="w-full h-full rounded-2xl overflow-hidden relative">
        {isRemoteVideoOff && (
          <div className="absolute w-full h-full inset-0 flex justify-center items-center bg-gray-700 z-10">
            <p className="text-white text-sm md:text-xl lg:text-2xl font-semibold">Camera is off</p>
          </div>
        )}

        <Video videoRef={remoteVideoRef} isScreenShare={isRemoteScreenShare} />
        <UserInformation username="Friend" isMuted={isRemoteAudioOff} className="bottom-2 right-3" />

        <MiniVideo
          videoRef={localVideoRef}
          isVideoOff={isVideoOff}
          username="Me"
          isMuted={isMuted}
          isScreenShare={isScreenShare}
        />
      </div>
      <RoomDetailsModal open={isRoomDetailsOpen} handleOnClose={() => setIsRoomDetailsOpen(false)} />
      <RoomMembersModal open={isRoomMembersOpen} handleOnClose={() => setIsRoomMembersOpen(false)} />
      <MessengerModal open={isMessengerOpen} handleOnClose={() => setIsMessengerOpen(false)} />
    </div>
  );
}

export default VideoPreview;
