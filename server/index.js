const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
//backend always serves as a layer when you emit an event from the frontend you can only emit it to the backend

//Really we want to send the data to another user not to the backend but for socket io to work you need to do it this way

//emit the message to the backend then backend will listen to event your emitting from the frontend youll send the data then the backend event that your listening to will recievve the data
//use as for conection errors
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  //backend event that your listening to will recieve the data and emit that data to another event that your listening to on the frontend

  //Socket called join event that specifys a val or number or here the id of the room that we are joining

  //FE we created a variable called join room and here we are listiening to that event

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  //this is what we used to send message to all users on server with socket.broadcast.emit
//   socket.on("send_message", (data) => {
//     socket.broadcast.emit("receive_message", data);
//   });
// });

//here we are sending data to room we are part of and then emitting
socket.on("send_message", (data) => {
  socket.to(data.room).emit("receive_message", data);
});
});

server.listen(3001, () => {
  console.log("server listening on *:3001");
});
