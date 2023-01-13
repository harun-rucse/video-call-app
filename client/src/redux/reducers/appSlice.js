import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMuted: false,
  isVideoOff: false,
  showCallingDialog: false,
  showIncomingCallDialog: false,
  infoDialog: {
    show: false,
    title: "",
    subtitle: ""
  }
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    muteUnmute: (state, action) => {
      state.isMuted = !state.isMuted;
    },
    videoShowHide: (state, action) => {
      const localStream = action.payload;
      if (localStream) localStream.getVideoTracks()[0].enabled = state.isVideoOff;

      state.isVideoOff = !state.isVideoOff;
    },
    setShowCallingDialog: (state, action) => {
      state.showCallingDialog = action.payload;
    },
    setShowIncomingCallDialog: (state, action) => {
      state.showIncomingCallDialog = action.payload;
    },
    setInfoDialog: (state, action) => {
      state.infoDialog = action.payload;
    }
  }
});

export const { muteUnmute, videoShowHide, setShowCallingDialog, setShowIncomingCallDialog, setInfoDialog } =
  appSlice.actions;

export default appSlice.reducer;
