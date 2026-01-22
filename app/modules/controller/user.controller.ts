require("dotenv").config();
import { Request, Response } from "express";
import twilio from "twilio";
import { User } from "../model/user.model";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_TOKEN!;
const client = twilio(accountSid, authToken, { lazyLoading: true });

/**
 * Register user (Send OTP)
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ message: "Phone number required" });
    }

    await client.verify.v2
      .services(process.env.TWILIO_SERVICESID!)
      .verifications.create({
        channel: "sms",
        to: phone_number,
      });

    res.status(200).json({
      success: true,
      message: "OTP sent to phone number",
    });
  } catch (error) {
    console.error("OTP send error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/**
 * Verify OTP
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone_number, otp } = req.body;

    const flatOtp = Array.isArray(otp) ? otp.join("") : otp;

    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICESID!)
      .verificationChecks.create({
        to: phone_number,
        code: flatOtp,
      });

    if (verification.status !== "approved") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ phone_number });

    if (!user) {
      user = await User.create({
        phone_number,
        isVerified: true,
      });
    } else {
      user.isVerified = true;
      await user.save();
    }

    res.status(200).json({
      message: "OTP verified successfully",
      user,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/**
 * Complete Signup
 */
export const signUp = async (req: Request, res: Response) => {
  try {
    const { userId, email, name } = req.body;
    console.log(userId, email, name);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email) {
      return res.status(400).json({ message: "Profile already completed" });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({
      message: "User profile completed",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};
