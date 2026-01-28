import { Request, Response, NextFunction } from 'express';
import 'dotenv/config'
const token = process.env.TOKEN||'my-secret-token'
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Authorization header missing'
    });
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Invalid authorization format'
    });
  }

  // 🔹 Dummy validation (MVP)
  if (token !== token) {
    return res.status(403).json({
      message: 'Invalid or expired token'
    });
  }

  next();
};
