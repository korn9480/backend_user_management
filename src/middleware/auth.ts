import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/authService';
import { ApiResponse } from '../type/response/response';

const authService: AuthService = new AuthService();
export function isAuthenticated(req: any, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
  if (!token) {
    const resError: ApiResponse<undefined> = {
        message: "Unauthorized",
        status: "error"
    }
    return res.status(401).json(resError);
  }
  try {
    const [_, subtoken] = token.split(" ")
    const dataUser = authService.verifyToken(subtoken)
    req.user = dataUser
  } catch (error) {
      const resError: ApiResponse<undefined> = {
        message: "Unauthorized",
        status: "error"
    }
    return res.status(401).json(resError);
  }
  next();
}

export function authorizeRoles(...roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
            const resError: ApiResponse<undefined> = {
            message: "Forbidden: insufficient rights",
            status: "error"
        }
        return res.status(403).json(resError);
    }
    next();
  };
}
