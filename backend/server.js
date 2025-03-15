require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app); // Use HTTP server for WebSockets

app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes"); // ✅ New message routes

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes); // ✅ Message API

// ✅ Initialize WebSocket Server
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🔗 User Connected:", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
