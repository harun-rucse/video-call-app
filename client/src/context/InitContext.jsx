import { createContext } from "react";
import { io } from "socket.io-client";

const InitContext = createContext();
const socket = io("http://localhost:4000");

const InitProvider = ({ children }) => {
  return <InitContext.Provider value={{ socket }}>{children}</InitContext.Provider>;
};

export { InitContext, InitProvider };
