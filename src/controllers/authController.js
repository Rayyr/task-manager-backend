import User from "../models/User";
import { generateToken } from "../utils/token";
import asyncHandler from "../utils/asyncHandler";
import bcrypt from "bcrypt";

//@route POST /api/v1/auth/register
//@access puplic

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

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
    token: generateToken(User._id),
    newUser,
  });
});
