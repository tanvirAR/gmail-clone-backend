// externel module imports
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import rateLimit from "express-rate-limit";
import { Server, Socket } from "socket.io";
import sanitizationMiddleware from "./middleware/common/sanitize";

// internal imports
import prisma from "./prismaclient/prismaClient";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/common/errorHandler";

import signUpRouter from "./router/signUpRouter";
import signInRouter from "./router/signInRouter";
import emailRouter from "./router/emailRouter";
// ..............................................................

const app = express();
const server = http.createServer(app);

export const io = new Server(server);

// app.use(rateLimiter)
const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many request! Please try again later.",
});

// cors

/**  use @santizationMiddleware to prevent security @vulnerebility like @SQLinjections */
app.use(sanitizationMiddleware);

// database connection
async function main() {
  await prisma.$connect();
}

main()
  .then(() => console.log("Database Connection Successful"))
  .catch((e) => {
    console.log(e);
  })
  .finally(() => prisma.$disconnect());

dotenv.config();


app.use(cors({ credentials: true, origin: process.env.client }));



// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.JWT_SECRET));

// routing setup
app.use("/", signInRouter);
app.use("/signup", rateLimiter, signUpRouter);
app.use("/email", emailRouter);

// 404 not found handler
app.use(notFoundHandler);

// // common error handler
app.use(errorHandler);

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

app.listen(4000);
