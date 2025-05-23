import { Request, Response } from "express";
import { UserService } from "../service/userService";
import { ApiResponse, ApiResponseVaildato, PaginatedResponse } from '../type/response/response';
import { Prisma, User } from "../../generated/prisma";
import { ValidationError, validationResult } from "express-validator";
import { PaginationHelper } from '../util/pagination';
import { RoleService } from "../service/roleService";


export class UserController {
    private readonly userService = new UserService();
    private readonly roleService = new RoleService();

    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const resError: ApiResponseVaildato<ValidationError[]> = {
                    message: "user created error validation",
                    status: "error",
                    error: errors.array()
                }
                res.status(500).json(resError)
                return
            }
            const user = await this.userService.createUser(req.body);
            
            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;
            
            const resData: ApiResponse<typeof userWithoutPassword> = {
                message: "user created successfully",
                data: userWithoutPassword,
                status: "success"
            };
            res.json(resData);
        } catch (error) {
            const resError: ApiResponse<undefined> = {
                status: "error",
                message: `${error}`
            };
            res.status(500).json(resError);
        }
    };

    public getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = parseInt(id, 10);

            // Validate ID
            if (isNaN(userId)) {
                const resError: ApiResponse<undefined> = {
                    status: "error",
                    message: "Invalid user ID"
                };
                res.status(400).json(resError);
                return;
            }
            const user = await this.userService.getUserById(userId);

            if (!user) {
                const resError: ApiResponse<undefined> = {
                    status: "error",
                    message: "User not found"
                };
                res.status(404).json(resError);
                return;
            }
            
            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;
            
            const resData: ApiResponse<typeof userWithoutPassword> = {
                message: "user get by id successfully",
                data: userWithoutPassword,
                status: "success"
            };
            res.json(resData);
        } catch (error) {
            const resError: ApiResponse<undefined> = {
                status: "error",
                message: `${error}`
            };
            res.status(500).json(resError);
        }
    }

    public getUserAll = async (req: Request, res: Response): Promise<void> => {
        try {
            // Extract query parameters
            const { page, limit, search } = req.query;
            
            // Validate pagination parameters
            const { page: validPage, limit: validLimit } = PaginationHelper.validatePaginationParams(
                page as string, 
                limit as string
            );

            // Get users with pagination
            const { users, totalCount } = await this.userService.getUsersWithPagination({
                page: validPage,
                limit: validLimit,
                search: search as string
            });

            // Remove passwords from response
            const usersWithoutPasswords = users.map(user => {
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            // Calculate pagination metadata
            const paginationMeta = PaginationHelper.calculatePagination(
                totalCount,
                validPage,
                validLimit
            );

            // Prepare response
            const resData: PaginatedResponse<typeof usersWithoutPasswords[0]> = {
                status: "success",
                message: "Get users successfully",
                data: usersWithoutPasswords,
                pagination: paginationMeta
            };

            res.json(resData);
        } catch (error) {
            const resError: ApiResponse<undefined> = {
                status: "error",
                message: `${error}`
            };
            res.status(500).json(resError);
        }
    };

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = parseInt(id, 10);

            // Validate ID
            if (isNaN(userId)) {
                const resError: ApiResponse<undefined> = {
                    status: "error",
                    message: "Invalid user ID"
                };
                res.status(400).json(resError);
                return;
            }

            // Check if user exists
            const existingUser = await this.userService.getUserById(userId);
            if (!existingUser) {
                const resError: ApiResponse<undefined> = {
                    status: "error",
                    message: "User not found"
                };
                res.status(404).json(resError);
                return;
            }

            // Update user
            const updatedUser = await this.userService.updateUser(userId, req.body);
            
            // Remove password from response
            const { password: _, ...userWithoutPassword } = updatedUser;
            
            const resData: ApiResponse<typeof userWithoutPassword> = {
                message: "user updated successfully",
                data: userWithoutPassword,
                status: "success"
            };
            res.json(resData);
        } catch (error) {
            const resError: ApiResponse<undefined> = {
                status: "error",
                message: `${error}`
            };
            res.status(500).json(resError);
        }
    };

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = parseInt(id, 10);

            // Validate ID
            if (isNaN(userId)) {
                const resError: ApiResponse<undefined> = {
                    status: "error",
                    message: "Invalid user ID"
                };
                res.status(400).json(resError);
                return;
            }

            // Check if user exists
            const existingUser = await this.userService.getUserById(userId);
            if (!existingUser) {
                const resError: ApiResponse<undefined> = {
                    status: "error",
                    message: "User not found"
                };
                res.status(404).json(resError);
                return;
            }

            // Delete user
            const deletedUser = await this.userService.deleteUser(userId);
            
            // Remove password from response
            const { password: _, ...userWithoutPassword } = deletedUser;
            
            const resData: ApiResponse<typeof userWithoutPassword> = {
                message: "user deleted successfully",
                data: userWithoutPassword,
                status: "success"
            };
            res.json(resData);
        } catch (error) {
            const resError: ApiResponse<undefined> = {
                status: "error",
                message: `${error}`
            };
            res.status(500).json(resError);
        }
    };
}

export const userController = new UserController();