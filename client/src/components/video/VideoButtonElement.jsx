import React from "react";
import clsx from "clsx";

function VideoButtonElement({ className, icon: Icon, handleOnClick, notification = false }) {
  return (
    <div
      className={clsx(
        "relative flex justify-center items-center bg-gray-700 p-2 rounded-xl shadow-md hover:cursor-pointer hover:bg-gray-600",
        className
      )}
      onClick={handleOnClick}
    >
      <Icon size={24} className="text-gray-300" />
      {notification && (
        <span className="absolute -top-1 -right-1 bg-teal-500 text-white rounded-full w-3 h-3 flex justify-center items-center text-xs">
          {/* {notification} */}
        </span>
      )}
    </div>
  );
}

export default VideoButtonElement;
