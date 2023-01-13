import React from "react";
import VideoPreview from "./VideoPreview";
import VideoControl from "./VideoControl";

function VideoPlayer() {
  return (
    <div className="bg-[#1e2130] max-w-screen min-h-screen">
      <div className="flex flex-col gap-6 px-4">
        <VideoPreview />
        <VideoControl />
      </div>
    </div>
  );
}

export default VideoPlayer;
