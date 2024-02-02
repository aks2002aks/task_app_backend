import { Request, Response } from "express";
import User from "../models/user";
import { setAsync, getAsync, delAsync } from "../redis";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accountSid = "AC6b86139986270ba9e10f9dcc8b837039";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function sendLoginOtp(req: Request, res: Response) {
  const { phone } = req.body;
  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  try {
    const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    const storedOTP = await getAsync(phone);
    if (storedOTP) {
      await delAsync(phone);
    }

    await setAsync(phone, otp, "EX", 300);
    await client.messages
      .create({
        body: `your OTP for Task manager is : ${otp}`,
        from: "+16203613216",
        to: phone,
      })
      .then((message: any) => console.log(message.sid));

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
}

async function resendLoginOtp(req: Request, res: Response) {
  const { phone } = req.body;

  try {
    // Generate a new OTP
    const storedOTP = await getAsync(phone);

    // Send the new OTP to the user's email
    await client.messages
      .create({
        body: `your OTP for Task manager is : ${storedOTP}`,
        from: "+16203613216",
        to: phone,
      })
      .then((message: any) => console.log(message.sid));

    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error resending OTP" });
  }
}

async function verifyOtpForPhone(req: Request, res: Response) {
  const { phone, otp } = req.body;

  try {
    const storedOTP = await getAsync(phone);

    if (storedOTP && storedOTP === otp) {
      // Remove the OTP from Redis after successful verification
      await delAsync(phone);

      let user = await User.findOne({ phone_number: phone });

      if (!user) {
        user = new User({ phone_number: phone });
        await user.save();
      }

      res.setHeader("Set-Cookie", [
        `token=${jwt.sign({ userId: user._id }, process.env.JWT_TOKEN!, {
          expiresIn: "1d",
        })}; Path=/;`,
      ]);
      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
}

async function checkTokenValidity(req: Request, res: Response) {
  const { token } = req.body;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN!);

    res.status(200).json({ success: true, message: "Token is valid" });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}

export { sendLoginOtp, resendLoginOtp, verifyOtpForPhone, checkTokenValidity };
