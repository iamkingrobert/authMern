import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: "string",
      required: true,
    },

    email: {
      type: "string",
      required: true,
      unique: true,
    },

    password: {
      type: "string",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Before we save the user into the database check if the it is modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  //Hash the password using bcrypt; which will turn the password into a string of letters and/or numbers
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
