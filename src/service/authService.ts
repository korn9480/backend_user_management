import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '../../generated/prisma';
import { envConfig } from '../config/environment';
import { prismaClient } from '../config/prisma';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    expires_in: number;
}

export interface TokenPayload {
    userId: number;
    email: string;
    role: string;
}

export class AuthService {
    private readonly prisma: PrismaClient = prismaClient;
    private readonly saltRounds = 12;

    /**
     * Hash password using bcrypt
     */
    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    /**
     * Compare password with hash
     */
    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    /**
     * Generate JWT token
     */
    public generateToken(payload: TokenPayload): string {
        const token = jwt.sign(payload, envConfig.JWT_SECRET, {
            expiresIn: envConfig.JWT_EXPIRES_IN
        })
        return `Bearer ${token}`
    }

    /**
     * Verify JWT token
     */
    public verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, envConfig.JWT_SECRET) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Login user with email and password
     */
    public async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { email, password } = credentials;

        // Find user by email WITH role data
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { 
            role: {
                include: {
                rolePermissions: {
                    select: {
                        permission: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
                }
            }
            }
        });

        if (!user) {
            throw new Error('Invalid email');
        }

        // Verify password
        const isPasswordValid = await this.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Create token payload with role information
        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role.name,  // 🔥 Use role.name instead of role
        };

        // Generate token
        const token = this.generateToken(tokenPayload);

        // Remove password from user object
        // const { password: _, ...userWithoutPassword } = user;

        return {
            token,
            expires_in: envConfig.JWT_EXPIRES_IN
        };
    }

    /**
     * Get user by token
     */
    public async getUserByToken(token: string): Promise<Omit<User, 'password'> | null> {
        try {
            const payload = this.verifyToken(token);
            
            const user = await this.prisma.user.findUnique({
                where: { id: payload.userId },
                include: { 
                    role: true
                }
            });

            if (!user) {
                return null;
            }

            // Remove password from user object
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            return null;
        }
    }

    /**
     * Check if user exists by email
     */
    public async getUserByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { email },
            include: { 
                role: true  // 🔥 Include role data
            }
        });
    }
}
