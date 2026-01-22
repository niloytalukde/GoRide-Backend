import http from "http";
import { app } from "./app";
import connectDB from "./app/config/db";


const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
