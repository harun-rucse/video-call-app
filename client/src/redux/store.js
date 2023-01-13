import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/appSlice";
import webRTCReducer from "./reducers/webRTCSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    webRTC: webRTCReducer
  }
});
