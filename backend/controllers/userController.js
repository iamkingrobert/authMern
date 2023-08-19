import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @Desc: Auth User/Set Token
// Routes: POST api/users/auth
// @Access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Sending Logged-in User data
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id); //sending the user token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({ message: "Authenticate User" });
});

// @Desc: Register a new User
// Routes: POST api/users
// @Access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user is already registered
  const userExists = await User.findOne({ email });

  //if the email is already registered, then send this error message
  if (userExists) {
    res.status(400);
    throw new Error(`User ${email} already exists`);
  }

  //Create a new User if user do not exist
  const user = await User.create({
    name,
    email,
    password,
  });

  // Sending the new User data
  if (user) {
    generateToken(res, user._id); //sending the user token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
  //   res.status(200).json({ message: "Register User" });
});

// @Desc: Logout a User
// Routes: POST api/users/logout
// @Access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", ""),
    {
      httpOnly: true,
      expires: new Date(0),
    };
  res.status(200).json({ message: "User Logged Out Successfully" });
});

// @Desc: Get a User's Profile
// Routes: GET api/users/profile
// @Access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

// @Desc: Update a User Profile
// Routes: PUT api/users/profile
// @Access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // Find the user by their ID stored in the authenticated request object
  const user = await User.findById(req.user._id);
  // Check if the user exists
  if (user) {
    // Update the user's name and email with values from the request body, if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If a new password is provided in the request body, update the user's password
    if (req.body.password) {
      user.password = req.body.password;
    }
    // Save the updated user details in the database
    const updatedUser = await user.save();
    // Respond with a success status and the updated user's information
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
  //res.status(200).json({ message: "User Profile Updated Successfully" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
