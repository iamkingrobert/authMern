import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 4000;

import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Server is listening on port" + port));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on ${port}`));

// ALL MY ROUTE LISTED BELOW

// METHOD: POST /api/users - Register a new user
// METHOD: POST /api/users/auth - Authenticate a user and get token
// METHOD: POST /api/users/logout - Logout a user and clear cookies
// METHOD: GET /api/users/profile - Get a user profile
// METHOD: PUT /api/users/profile - Update a user profile
