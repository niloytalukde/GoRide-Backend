require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken, { lazyLoading: true });

// Register New user

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { phone_number } = req.body;
    console.log(phone_number);
    try {
      await client.verify.v2
        .services(process.env.TWILIO_SERVICESID!)
        .verifications.create({
          channel: "sms",
          to: phone_number,
        });

      res.status(200).json({
        success: true,
        message: "OTP send on your phone number ",
      });
        
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

// Verify OTP


export const verifyOtp = async (req :Request, res:Response) => {
  try {
    const { phone_number, otp } = req.body;
const flatOtp = Array.isArray(otp) ? otp.join("").toString() : otp;

    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICESID!)
      .verificationChecks.create({
        to: phone_number,
        code: flatOtp,
      });

    if (verification.status === "approved") {
      return res.json({ success: true });
    }

    return res.status(400).json({ message: "Invalid OTP" });
  } catch (error) {
    console.error("Twilio error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

