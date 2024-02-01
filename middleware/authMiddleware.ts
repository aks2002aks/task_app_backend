import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split(" ")[1];

    if (token) {
      const decodedToken: any = jwt.verify(token, process.env.JWT_TOKEN || "");
      if (decodedToken) {
        res.locals.userId = decodedToken.userId;
        return next();
      }
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { isLoggedIn };
