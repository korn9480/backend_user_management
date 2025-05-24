import { Request, Response } from "express";
import { AuthService, LoginCredentials } from "../service/authService";
import { ApiResponse, ApiResponseVaildato } from '../type/response/response';
import { ValidationError, validationResult } from "express-validator";
import { AuthResponse } from "../service/authService";

export class AuthController {
    private readonly authService = new AuthService();

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const resError: ApiResponseVaildato<ValidationError[]> = {
                    message: "Login validation failed",
                    status: "error",
                    error: errors.array()
                };
                res.status(400).json(resError);
                return;
            }

            const credentials: LoginCredentials = {
                email: req.body.email,
                password: req.body.password
            };

            // Perform login
            const authResponse = await this.authService.login(credentials);

            const resData: ApiResponse<AuthResponse> = {
                status: "success",
                message: "Login successful",
                data: authResponse
            };

            res.json(resData);
        } catch (error) {            
            // Handle specific authentication errors
            if (error instanceof Error && error.message === 'Invalid email or password') {
                const resError: ApiResponse<undefined> = {
                    status: "error",
                    message: "Invalid email or password"
                };
                res.status(401).json(resError);
                return;
            }

            // Handle other errors
            const resError: ApiResponse<undefined> = {
                status: "error",
                message: "Login failed. Please try again."
            };
            res.status(500).json(resError);
        }
    };

    public getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            // Extract token from Authorization header
            const authHeader = req.headers.authorization ?? "";
            const token = authHeader.substring(7); // Remove 'Bearer ' prefix

            // Get user by token
            const user = await this.authService.getUserByToken(token);
            if (!user) {
                const resError: ApiResponse<undefined> = {
                    status: "error",
                    message: "Invalid or expired token"
                };
                res.status(401).json(resError);
                return;
            }

            const resData: ApiResponse<typeof user> = {
                status: "success",
                message: "Profile retrieved successfully",
                data: user
            };

            res.json(resData);
        } catch (error) {
            const resError: ApiResponse<undefined> = {
                status: "error",
                message: "Failed to retrieve profile"
            };
            res.status(500).json(resError);
        }
    };

    public verifyToken = async (req: Request, res: Response): Promise<void> => {
        try {
            // Extract token from Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                const resError: ApiResponse<undefined> = {
                    status: "error",
                    message: "Authorization token required"
                };
                res.status(401).json(resError);
                return;
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix

            // Verify token
            const payload = this.authService.verifyToken(token);

            const resData: ApiResponse<{
                valid: boolean;
                payload: typeof payload;
            }> = {
                status: "success",
                message: "Token is valid",
                data: {
                    valid: true,
                    payload
                }
            };

            res.json(resData);
        } catch (error) {
            const resError: ApiResponse<{
                valid: boolean;
            }> = {
                status: "error",
                message: "Invalid or expired token",
                data: {
                    valid: false
                }
            };
            res.status(401).json(resError);
        }
    };
}

export const authController = new AuthController();
