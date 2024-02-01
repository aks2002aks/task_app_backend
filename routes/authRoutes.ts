// routes/userRoutes.ts

import express from "express";
import {
  checkTokenValidity,
  resendLoginOtp,
  sendLoginOtp,
  verifyOtpForPhone,
} from "../controllers/authController";

const router = express.Router();

router.post("/sendLoginOtp", sendLoginOtp);
router.post("/resendLoginOtp", resendLoginOtp);
router.post("/verifyOtpForPhone", verifyOtpForPhone);
router.post("/checkTokenValidity", checkTokenValidity);

export default router;
