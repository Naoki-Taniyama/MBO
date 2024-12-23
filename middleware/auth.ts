import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config'

const SECRET_KEY = process.env.SECRET_KEY;

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (SECRET_KEY == null) {
    res.sendStatus(500);
    return;
  }
  if (token == null) {
    res.sendStatus(401);
    return;
  }else{
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      (req as any).user = user;
      next();
    });
  }

};
