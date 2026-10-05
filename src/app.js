import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { notFound } from "./middleware/error.js";
import { errorHandler } from "./middleware/error.js";
import routes from "./routes/index.js";

export const app = express();

//security headers for requests
app.use(helmet());

// Allow requests from your frontend
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// Read JSON bodies
app.use(express.json());

// Remove $ and . from user input (blocks NoSQL injection)
app.use(mongoSanitize());

// Log requests in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1",routes);//for all api routes
app.use(notFound);//for invalid routes (unknown urls)
app.use(errorHandler);
