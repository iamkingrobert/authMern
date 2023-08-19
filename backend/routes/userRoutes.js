import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // Import the protect middleware for authentication

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.post("/logout", logoutUser);

// Route: GET /api/users/profile
// @Desc: Get a user's profile
// Middleware: protect - Requires authentication
router
  .route("/profile")
  .get(protect, getUserProfile)

  // Route: PUT /api/users/profile
  // @Desc: Update a user's profile
  // Middleware: protect - Requires authentication
  .put(protect, updateUserProfile);

export default router;
