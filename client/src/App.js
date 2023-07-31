import io from "socket.io-client";
import "./App.css";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  //Room State
  const [room, setRoom] = useState("");

  //Message State
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");

  //emitting event and sending the room that the user writes on the input

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  //message emitted from froentend that the backend is listening for
  //we are not only sending a message but also to a specific room that we are in so we can specify who we are sending it to
  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    //this is the other event that were listening to on the frontend and doing something with the data.  You need to create 2 different events to recieve some data
    socket.on("receive_message", (data) => {
      setMessageRecieved(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <input
        placeholder="room"
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />
      <button onClick={joinRoom}>Join Room</button>
      <input
        placeholder="message"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button onClick={sendMessage}>Send</button>
      <h1>Message:</h1>
      {messageRecieved}
    </div>
  );
}

export default App;
