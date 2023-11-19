import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useUserMedia } from "../hooks/useUserMedia";
import * as constants from "../constants";

const AppContext = createContext();
const socket = io(import.meta.env.VITE_APP_API_URL);
const configuration = {
  iceServer: [
    {
      urls: "stun.stun.1.google.com:13902"
    }
  ]
};

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [socketId, setSocketId] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRemoteAudioOff, setIsRemoteAudioOff] = useState(false);
  const [isRemoteVideoOff, setIsRemoteVideoOff] = useState(false);
  const [isRemoteScreenShare, setIsRemoteScreenShare] = useState(false);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const [isRoomMembersOpen, setIsRoomMembersOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [remoteMessage, setRemoteMessage] = useState("");

  const connectedUserSocketId = useRef();
  const caller_peer = useRef();
  const callee_peer = useRef();
  const localStream = useRef();
  const remoteStream = useRef();
  const screenSharingStream = useRef();
  const dataChannel = useRef();

  const [showCallingDialog, setShowCallingDialog] = useState(false);
  const [showIncomingCallDialog, setShowIncomingCallDialog] = useState(false);
  const [infoDialog, setInfoDialog] = useState({
    show: false,
    title: "",
    subtitle: ""
  });

  const userMedia = useUserMedia();

  useEffect(() => {
    registerSocketEvent();
  }, []);

  useEffect(() => {
    localStream.current = userMedia;
    localVideoRef.current.srcObject = userMedia;
  }, [userMedia]);

  const handleMuteUnmute = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;

      // Emit video state change event to other user
      socket.emit(constants.events.VIDEO_STATE_CHNAGE, {
        connectedUserSocketId: connectedUserSocketId.current,
        type: "audio",
        value: !isMuted
      });
      setIsMuted(!isMuted);
    }
  };

  const handleVideoShowHide = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;

      // Emit video state change event to other user
      socket.emit(constants.events.VIDEO_STATE_CHNAGE, {
        connectedUserSocketId: connectedUserSocketId.current,
        type: "video",
        value: !isVideoOff
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleScreenShare = async () => {
    if (isScreenShare) {
      const senders = caller_peer.current ? caller_peer.current?.getSenders() : callee_peer.current?.getSenders();

      const sender = senders.find((sender) => sender.track.kind === localStream.current.getVideoTracks()[0].kind);

      if (sender) sender.replaceTrack(localStream.current.getVideoTracks()[0]);

      // Stop screen sharing
      screenSharingStream.current?.getTracks().forEach((track) => {
        track.stop();
      });

      setIsScreenShare(false);
      if (localVideoRef) localVideoRef.current.srcObject = localStream.current;
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenSharingStream.current = stream;

        // Replace track which sender is sending
        const senders = caller_peer.current ? caller_peer.current?.getSenders() : callee_peer.current?.getSenders();

        const sender = senders.find((sender) => sender.track.kind === stream.getVideoTracks()[0].kind);

        if (sender) sender.replaceTrack(stream.getVideoTracks()[0]);

        setIsScreenShare(true);
        if (localVideoRef) localVideoRef.current.srcObject = stream;
      } catch (err) {
        console.error(err);
      }
    }

    // Emit video state change event to other user
    socket.emit(constants.events.VIDEO_STATE_CHNAGE, {
      connectedUserSocketId: connectedUserSocketId.current,
      type: "screen-share",
      value: !isScreenShare
    });
  };

  const handleEndCall = () => {
    socket.emit(constants.events.HANGED_UP, {
      connectedUserSocketId: connectedUserSocketId.current
    });

    closePeerConnectionAndResetState();
    navigate("/end-call");
  };

  const closePeerConnectionAndResetState = () => {
    caller_peer.current?.close();
    callee_peer.current?.close();

    connectedUserSocketId.current = null;
    localStream.current = null;
    remoteStream.current = null;
    screenSharingStream.current = null;
  };

  const handleClickRoomDetails = () => {
    setIsRoomMembersOpen(false);
    setIsMessengerOpen(false);
    setIsRoomDetailsOpen(!isRoomDetailsOpen);
  };

  const handleClickRoomMembers = () => {
    setIsRoomDetailsOpen(false);
    setIsMessengerOpen(false);
    setIsRoomMembersOpen(!isRoomMembersOpen);
  };

  const handleClickMessenger = () => {
    setIsRoomDetailsOpen(false);
    setIsRoomMembersOpen(false);
    setIsMessengerOpen(!isMessengerOpen);
  };

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
          if (callee_peer.current) {
            handleWebRTCOffer(data);
          }
          break;
        case ANSWER:
          if (caller_peer.current) {
            handleWebRTCAnswer(data);
          }
          break;
        case ICE_CANDIDATE:
          if (caller_peer.current || callee_peer.current) {
            handleWebRTCCandidate(data);
          }
          break;
      }
    });

    socket.on(constants.events.VIDEO_STATE_CHNAGE, (data) => {
      const { type, value } = data;

      if (type === "audio") setIsRemoteAudioOff(value);
      if (type === "video") setIsRemoteVideoOff(value);
      if (type === "screen-share") setIsRemoteScreenShare(value);
    });

    socket.on(constants.events.HANGED_UP, (data) => {
      closePeerConnectionAndResetState();
      navigate("/end-call");
    });
  };

  const createPeerConnection = (peer) => {
    // Create data channel
    dataChannel.current = peer.createDataChannel("chat");

    peer.ondatachannel = (event) => {
      const dataChannel = event.channel;

      dataChannel.onopen = () => {
        console.log("peer is ready to receive message");
      };

      dataChannel.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        setRemoteMessage(message);
      };
    };

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

  const sendMessageUsingDataChannel = (message) => {
    dataChannel.current?.send(JSON.stringify(message));
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

        navigate("/video-call");
        break;

      default:
        break;
    }
  };

  const sendWebRTCOffer = async () => {
    // Get Caller SDP information
    const offer = await caller_peer.current.createOffer();
    await caller_peer.current.setLocalDescription(offer);

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
    await callee_peer.current.setRemoteDescription(data.offer);
    const answer = await callee_peer.current.createAnswer();
    await callee_peer.current.setLocalDescription(answer);

    sendDataUsingWebRTCSignaling({
      connectedUserSocketId: connectedUserSocketId.current,
      type: constants.webRTCSignaling.ANSWER,
      answer
    });
  };

  // Caller receive webRTC answer
  const handleWebRTCAnswer = async (data) => {
    await caller_peer.current.setRemoteDescription(data.answer);
  };

  // Caller receive ice-candidate
  const handleWebRTCCandidate = async (data) => {
    try {
      await caller_peer.current?.addIceCandidate(data.candidate);
      await callee_peer.current?.addIceCandidate(data.candidate);
    } catch (err) {
      console.error("Error occur to exchange ice-candidate", err);
    }
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
    if (localStream.current) createPeerConnection(callee_peer.current);

    // Send pre-offer-answer
    socket.emit(constants.events.PRE_OFFER_ANSWER, {
      callerSocketId: connectedUserSocketId.current,
      preOfferAnswer: constants.preOfferAnswer.CALL_ACCEPTED
    });

    // Navigate to video call
    navigate("/video-call");
  };

  const handleDecline = () => {
    console.log("Decline Call");
    setShowIncomingCallDialog(false);

    // Send pre-offer-answer
    socket.emit(constants.events.PRE_OFFER_ANSWER, {
      callerSocketId: connectedUserSocketId.current,
      preOfferAnswer: constants.preOfferAnswer.CALL_REJECTED
    });
  };

  return (
    <AppContext.Provider
      value={{
        socketId,
        localVideoRef,
        remoteVideoRef,
        localStream,
        remoteStream,
        isRemoteAudioOff,
        isRemoteVideoOff,
        isRemoteScreenShare,
        isMuted,
        isVideoOff,
        isScreenShare,
        isRoomDetailsOpen,
        setIsRoomDetailsOpen,
        isRoomMembersOpen,
        setIsRoomMembersOpen,
        isMessengerOpen,
        setIsMessengerOpen,
        handleMuteUnmute,
        handleVideoShowHide,
        handleScreenShare,
        handleEndCall,
        handleClickRoomDetails,
        handleClickRoomMembers,
        handleClickMessenger,
        handleJoin,
        handleAccept,
        handleDecline,
        infoDialog,
        setInfoDialog,
        showCallingDialog,
        showIncomingCallDialog,
        sendMessageUsingDataChannel,
        remoteMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
