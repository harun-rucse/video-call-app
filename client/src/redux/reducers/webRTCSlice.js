import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connectedUserSocketId: null,
  localStream: null,
  remoteStream: null
};

export const webRTCSlice = createSlice({
  name: "webRTC",
  initialState,
  reducers: {
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
      console.log(state.localStream);
      return state;
    },

    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
      return state;
    },

    setConnectedUserSocketId: (state, action) => {
      state.connectedUserSocketId = action.payload;
      return state;
    },

    handlePreOffer: (state, action) => {
      const { callerSocketId } = action.payload;

      state.connectedUserSocketId = callerSocketId;
      console.log("handlePreOffer");
    },
    handlePreOfferAnswer: (state, action) => {
      const { preOfferAnswer, calleeSocketId } = action.payload;

      console.log("pre offer answer came");
    },
    handleWebRTCOffer: (state, action) => {
      console.log("handleWebRTCOffer");
    },
    handleWebRTCAnswer: (state, action) => {
      console.log("handleWebRTCAnswer");
    }
  }
});

export const {
  handlePreOffer,
  handlePreOfferAnswer,
  handleWebRTCOffer,
  handleWebRTCAnswer,
  setConnectedUserSocketId,
  setLocalStream,
  setRemoteStream
} = webRTCSlice.actions;

export default webRTCSlice.reducer;
