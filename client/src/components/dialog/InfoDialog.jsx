import React, { useEffect, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import Dialog from "./index";
import { AppContext } from "../../context/AppContext";

function InfoDialog({ show, title, subtitle }) {
  const { setInfoDialog } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => {
      if (show) {
        setInfoDialog({ show: false });
      }
    }, 4000);
  }, [show]);

  return (
    <Dialog show={show}>
      <div className="min-w-[20rem] bg-gray-800 text-gray-200 px-6 py-5 rounded-lg flex flex-col items-center gap-8">
        <p className="text-xl leading-tight uppercase">{title}</p>
        <div className="">
          <FaUserCircle className="text-9xl text-teal-600" />
        </div>
        <p className="text-base leading-tight">{subtitle}</p>
      </div>
    </Dialog>
  );
}

export default InfoDialog;
