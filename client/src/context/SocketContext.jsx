import { createContext, useState, useEffect, useContext } from "react";
import { InitContext } from "./InitContext";
import { WebRTCContext } from "./WebRTCContext";
import * as constants from "../constants";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socketId, setSocketId] = useState("");

  const { handlePreOffer, handlePreOfferAnswer, handleWebRTCOffer, handleWebRTCAnswer, handleWebRTCCandidate } =
    useContext(WebRTCContext);
  const { socket } = useContext(InitContext);

  const registerSocketEvent = () => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Socket connected");
    });

    // Callee listening pre-offer event from caller
    socket.on(constants.events.PRE_OFFER, (data) => {
      handlePreOffer(data);
    });

    // Caller listening for pre-offer-answer from callee
    socket.on(constants.events.PRE_OFFER_ANSWER, (data) => {
      handlePreOfferAnswer(data);
    });

    socket.on(constants.events.WEBRTC_SIGNALING, (data) => {
      const { OFFER, ANSWER, ICE_CANDIDATE } = constants.webRTCSignaling;

      switch (data.type) {
        case OFFER:
          handleWebRTCOffer(data);
          break;
        case ANSWER:
          handleWebRTCAnswer(data);
          break;
        case ICE_CANDIDATE:
          handleWebRTCCandidate(data);
          break;
      }
    });
  };

  const sendPreOffer = (data) => {
    socket.emit(constants.events.PRE_OFFER, data);
  };

  const sendPreOfferAnswer = (data) => {
    socket.emit(constants.events.PRE_OFFER_ANSWER, data);
  };

  useEffect(() => {
    if (socket) registerSocketEvent();
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socketId,
        sendPreOffer,
        sendPreOfferAnswer
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
