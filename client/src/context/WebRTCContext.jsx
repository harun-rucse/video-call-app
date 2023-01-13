import { createContext, useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as constants from "../constants";
import { InitContext } from "./InitContext";
import { useUserMedia } from "../hooks/useUserMedia";

// handlePreOfferAnswer: set callee info in caller side
// sendPreOfferAnswer: set caller info in callee side

const WebRTCContext = createContext();

const configuration = {
  iceServer: [
    {
      urls: "stun.stun.1.google.com:13902"
    }
  ]
};

const WebRTCProvider = ({ children }) => {
  const navigate = useNavigate();
  const connectedUserSocketId = useRef();
  const caller_peer = useRef();
  const callee_peer = useRef();
  const localStream = useRef();
  const remoteStream = useRef();
  const screenSharingStream = useRef();

  const [showCallingDialog, setShowCallingDialog] = useState(false);
  const [showIncomingCallDialog, setShowIncomingCallDialog] = useState(false);
  const [infoDialog, setInfoDialog] = useState({
    show: false,
    title: "",
    subtitle: ""
  });

  const { socket } = useContext(InitContext);
  const userMedia = useUserMedia();

  useEffect(() => {
    localStream.current = userMedia;
  }, [userMedia]);

  const createPeerConnection = (peer) => {
    // Geting ice-candidate form stun server
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ice-candidate to other peer
        const data = {
          connectedUserSocketId: connectedUserSocketId.current,
          type: constants.webRTCSignaling.ICE_CANDIDATE,
          candidate: event.candidate
        };
        sendDataUsingWebRTCSignaling(data);
      }
    };

    peer.onconnectionstatechange = (event) => {
      if (peer.connectionState === "connected") {
        console.log("successfully connected with other peer");
      }
    };

    // Receiving remote stream
    const _remoteStream = new MediaStream();
    remoteStream.current = _remoteStream;

    peer.ontrack = (event) => {
      remoteStream.current.addTrack(event.track);
    };

    // Add our stream to peer connection
    for (const trak of localStream.current.getTracks()) {
      peer.addTrack(trak, localStream.current);
    }
  };

  const handlePreOffer = (data) => {
    connectedUserSocketId.current = data.callerSocketId;
    setShowIncomingCallDialog(true);
  };

  const handlePreOfferAnswer = (data) => {
    setShowCallingDialog(false);

    const { CALLEE_NOT_FOUND, CALL_UNAVAILABLE, CALL_REJECTED, CALL_ACCEPTED } = constants.preOfferAnswer;

    switch (data.preOfferAnswer) {
      case CALLEE_NOT_FOUND:
        // show dialog that callee has not been found
        setInfoDialog({
          show: true,
          title: "Callee not Found",
          subtitle: "Please Check personal code"
        });
        break;

      case CALL_UNAVAILABLE:
        // show dialog that callee is not able to connect
        setInfoDialog({
          show: true,
          title: "Call is not possible",
          subtitle: "Probably callee is busy. Please try again later!"
        });
        break;

      case CALL_REJECTED:
        // show dialog that callee reject the call
        setInfoDialog({
          show: true,
          title: "Call Rejected",
          subtitle: "Callee rejected your call"
        });
        break;

      case CALL_ACCEPTED:
        // Create peer connection
        caller_peer.current = new RTCPeerConnection(configuration);
        if (localStream.current) createPeerConnection(caller_peer.current);
        // Caller Send webRTC offer
        sendWebRTCOffer();

        // navigate("/video-call");
        break;

      default:
        break;
    }
  };

  const sendWebRTCOffer = async () => {
    // Get Caller SDP information
    const offer = await caller_peer.createOffer();
    await caller_peer.setLocalDescription(offer);

    const data = {
      connectedUserSocketId: connectedUserSocketId.current,
      type: constants.webRTCSignaling.OFFER,
      offer
    };
    sendDataUsingWebRTCSignaling(data);
  };

  const sendDataUsingWebRTCSignaling = (data) => {
    socket.emit(constants.events.WEBRTC_SIGNALING, data);
  };

  // Callee receive webRTC offer
  const handleWebRTCOffer = async (data) => {
    console.log("webRTC offer came", data);
    await callee_peer.current.setRemoteDescription(data.offer);
    const answer = await callee_peer.current.createAnswer();
    await callee_peer.current.setLocalDescription(answer);

    sendDataUsingWebRTCSignaling({
      connectedUserSocketId: data.connectedUserSocketId,
      type: constants.webRTCSignaling.ANSWER,
      answer
    });
  };

  // Caller receive webRTC answer
  const handleWebRTCAnswer = async (data) => {
    console.log("webRTC answer came", data);
    await caller_peer.setRemoteDescription(data.answer);
  };

  // Caller receive ice-candidate
  const handleWebRTCCandidate = (data) => {
    console.log("ICE candidate came");
  };

  const handleJoin = (calleeSocketId) => {
    connectedUserSocketId.current = calleeSocketId;
    setShowCallingDialog(true);

    // Send pre-offer
    socket.emit(constants.events.PRE_OFFER, { calleeSocketId });
  };

  const handleAccept = () => {
    console.log("Accept Call");
    setShowIncomingCallDialog(false);

    // Create peer connection
    callee_peer.current = new RTCPeerConnection(configuration);
    if (localStream) createPeerConnection(callee_peer.current);

    // Send pre-offer-answer
    socket.emit(constants.events.PRE_OFFER_ANSWER, {
      callerSocketId: connectedUserSocketId.current,
      preOfferAnswer: constants.preOfferAnswer.CALL_ACCEPTED
    });
  };

  const handleDecline = () => {
    console.log("Decline Call");
  };

  return (
    <WebRTCContext.Provider
      value={{
        connectedUserSocketId,
        localStream,
        remoteStream,
        screenSharingStream,
        showCallingDialog,
        setShowCallingDialog,
        showIncomingCallDialog,
        setShowIncomingCallDialog,
        infoDialog,
        setInfoDialog,
        createPeerConnection,
        handlePreOffer,
        handlePreOfferAnswer,
        handleWebRTCOffer,
        handleWebRTCAnswer,
        handleWebRTCCandidate,
        handleJoin,
        handleAccept,
        handleDecline
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export { WebRTCContext, WebRTCProvider };
