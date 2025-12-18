import  { Router } from "express";
import { registerUser, verifyOtp } from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-otp", verifyOtp);


export default userRouter
