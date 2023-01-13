import React, { useEffect, useContext } from "react";
import VideoPreview from "../components/video/VideoPreview";
import VideoControl from "../components/video/VideoControl";
import { AppContext } from "../context/AppContext";

function Video() {
  const { localVideoRef, remoteVideoRef, localStream, remoteStream } = useContext(AppContext);

  useEffect(() => {
    if (!localStream.current || !remoteStream.current) return (window.location = "/");

    localVideoRef.current.srcObject = localStream.current;
    remoteVideoRef.current.srcObject = remoteStream.current;
  }, []);

  return (
    <div className="bg-[#1e2130] w-full h-screen">
      <div className="flex flex-col gap-6 px-4">
        <VideoPreview />
        <VideoControl />
      </div>
    </div>
  );
}

export default Video;
