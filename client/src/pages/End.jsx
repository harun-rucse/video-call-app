import React from "react";
import { useNavigate } from "react-router-dom";

function End() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 w-full h-screen">
      <div className="flex gap-6 flex-col justify-center items-center pt-5">
        <h2 className="text-2xl mb-4">You have left the room.</h2>
        <button
          className="bg-[#0055ff] hover:bg-[#2868e7] w-[206px] py-3 rounded-lg text-base text-white font-semibold focus:outline-none"
          onClick={() => navigate(-1)}
        >
          Rejoin
        </button>
        <button
          className="bg-white hover:bg-slate-200 text-[#0055ff] w-[206px] py-3 rounded-lg text-base font-semibold focus:outline-none"
          onClick={() => navigate("/")}
        >
          Return to home screen
        </button>
      </div>
    </div>
  );
}

export default End;
