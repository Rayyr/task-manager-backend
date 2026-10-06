import User from "../models/User.js";
import { generateToken } from "../utils/token.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
//@route POST /api/v1/auth/register
//@access puplic

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
  //hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    name: name,
    password: hashedPassword,
    email: email,
  });
  return res.status(201).json({
    success: true,
    /*  token: generateToken(User._id), */
    newUser,
  });
});

//@route  POST /api/v1/auth/login
//@access Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne(
    { email: email.toLowerCase() }.select(+password),
  );

  //wrong email
  if (!user) {
    throw new ApiError(401, "Invalid email");
  }

  const isSame = await bcrypt.compare(password, user.password);
  //wrong password
  if (!isSame) {
    throw new ApiError(401, "Invalid password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated");
  }
  //correct credentials
  return res.status(200).json({
    success: true,
    user: user,
    token: generateToken(user._id),
  });
});
