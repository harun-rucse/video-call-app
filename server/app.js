const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(cors());

let connectedPeers = [];

io.on("connection", (socket) => {
  console.log("New client connected");
  connectedPeers.push(socket.id);

  // Listen for caller pre offer
  socket.on("pre-offer", (data) => {
    const { calleeSocketId } = data;

    // Check if callee is online
    if (connectedPeers.includes(calleeSocketId)) {
      // Send caller pre offer to callee
      io.to(calleeSocketId).emit("pre-offer", {
        callerSocketId: socket.id
      });
    } else {
      // Emit event to caller that callee is not online
      io.to(socket.id).emit("pre-offer-answer", {
        preOfferAnswer: "CALLEE_NOT_FOUND"
      });
    }
  });

  // Listen for callee pre-offer-answer
  socket.on("pre-offer-answer", (data) => {
    const { callerSocketId } = data;

    if (connectedPeers.includes(callerSocketId)) {
      io.to(callerSocketId).emit("pre-offer-answer", data);
    }
  });

  // Listening for geting webRTC signal
  socket.on("webRTC-signaling", (data) => {
    const { connectedUserSocketId } = data;

    if (connectedPeers.includes(connectedUserSocketId)) {
      io.to(connectedUserSocketId).emit("webRTC-signaling", data);
    }
  });

  // Listening for video state change (audio/video)
  socket.on("video-state-change", (data) => {
    io.to(data.connectedUserSocketId).emit("video-state-change", data);
  });

  // Listening for user hanged-up
  socket.on("hanged-up", (data) => {
    io.to(data.connectedUserSocketId).emit("hanged-up", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    connectedPeers = connectedPeers.filter((id) => id !== socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening at PORT ${PORT}`);
});
