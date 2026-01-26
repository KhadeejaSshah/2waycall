const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let userSocket = null;
let nocSocket = null;

app.use(express.static("public"));

app.get("/user", (_, res) => res.sendFile(__dirname + "/public/user.html"));
app.get("/noc", (_, res) => res.sendFile(__dirname + "/public/noc.html"));

io.on("connection", socket => {
  console.log("Connected:", socket.id);

  socket.on("join", role => {
    if (role === "user") userSocket = socket;
    if (role === "noc") nocSocket = socket;
  });

  socket.on("call_noc", () => {
    if (nocSocket) {
      nocSocket.emit("incoming_call");
    }
  });

  socket.on("accept_call", () => {
    if (userSocket) userSocket.emit("call_accepted");
  });

  socket.on("signal", ({ to, data }) => {
    if (to === "noc" && nocSocket) nocSocket.emit("signal", data);
    if (to === "user" && userSocket) userSocket.emit("signal", data);
  });

  socket.on("disconnect", () => {
    if (socket === userSocket) userSocket = null;
    if (socket === nocSocket) nocSocket = null;
  });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
// const fs = require("fs");
// const https = require("https");
// const express = require("express");
// const { Server } = require("socket.io");

// const app = express();

// // Read SSL certificate
// const options = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
// };

// const server = https.createServer(options, app);
// const io = new Server(server);

// let userSocket = null;
// let nocSocket = null;

// app.use(express.static("public"));

// app.get("/user", (_, res) => res.sendFile(__dirname + "/public/user.html"));
// app.get("/noc", (_, res) => res.sendFile(__dirname + "/public/noc.html"));

// io.on("connection", (socket) => {
//   console.log("Connected:", socket.id);

//   socket.on("join", (role) => {
//     if (role === "user") userSocket = socket;
//     if (role === "noc") nocSocket = socket;
//   });

//   socket.on("call_noc", () => {
//     if (nocSocket) nocSocket.emit("incoming_call");
//   });

//   socket.on("accept_call", () => {
//     if (userSocket) userSocket.emit("call_accepted");
//   });

//   socket.on("signal", ({ to, data }) => {
//     if (to === "noc" && nocSocket) nocSocket.emit("signal", data);
//     if (to === "user" && userSocket) userSocket.emit("signal", data);
//   });

//   socket.on("disconnect", () => {
//     if (socket === userSocket) userSocket = null;
//     if (socket === nocSocket) nocSocket = null;
//   });
// });

// const PORT = 3000;
// server.listen(PORT, () =>
//   console.log(`Server running on https://192.168.50.192:${PORT}`)
// );
