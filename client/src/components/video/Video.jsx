import React from "react";
import clsx from "clsx";

function Video({ videoRef, isScreenShare, className, ...props }) {
  return (
    <video
      ref={videoRef}
      className={clsx("w-full h-full object-cover shadow", className)}
      style={isScreenShare ? { transform: "rotateY(0deg)" } : { transform: "rotateY(180deg)" }}
      autoPlay
      {...props}
    />
  );
}

export default Video;
