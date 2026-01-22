import  { Router } from "express";
import { registerUser, signUp, verifyOtp } from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-otp", verifyOtp);
userRouter.patch("/signup", signUp);

export default userRouter
