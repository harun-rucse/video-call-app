import { createContext } from "react";
import { io } from "socket.io-client";

const InitContext = createContext();
const socket = io(import.meta.env.VITE_APP_API_URL);

const InitProvider = ({ children }) => {
  return <InitContext.Provider value={{ socket }}>{children}</InitContext.Provider>;
};

export { InitContext, InitProvider };
