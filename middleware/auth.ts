import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  const SECRET_KEY = 'secret_key';
  if (token == null) return res.status(401).json({ error: "Token required" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    next();
  })
};
