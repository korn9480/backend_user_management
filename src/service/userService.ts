import { Prisma, PrismaClient, User } from '@/prisma';
import { PaginationOptions } from '../util/pagination';
import { AuthService } from './authService';

export interface UserWithPagination {
    users: User[];
    totalCount: number;
}

export class UserService {
    private readonly prisma: PrismaClient = new PrismaClient();
    private readonly authService = new AuthService();

    public async getUsersAll(): Promise<User[]> {
        const data = await this.prisma.user.findMany({
            include: { 
                role: true  // 🔥 Include role data
            }
        });
        return data;
    }    

    public async getUsersWithPagination(options: PaginationOptions): Promise<UserWithPagination> {
        const { page, limit, search } = options;
        const skip = (page - 1) * limit;

        // Build search conditions
        const whereCondition: Prisma.UserWhereInput = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                        }
                    },
                    {
                        email: {
                            contains: search,
                        }
                    },
                    {
                        role: {  // 🔥 Search in role name
                            name: {
                                contains: search,
                            }
                        }
                    }
                ]
            }
            : {};

        // Execute queries in parallel
        const [users, totalCount] = await Promise.all([
            this.prisma.user.findMany({
                where: whereCondition,
                skip: skip,
                take: limit,
                include: { 
                    role: true  // 🔥 Include role data
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.user.count({
                where: whereCondition
            })
        ]);

        return {
            users,
            totalCount
        };
    }

    public async createUser(body: Prisma.UserUncheckedCreateInput): Promise<User> {
        // Hash password before saving
        if (body.password) {
            body.password = await this.authService.hashPassword(body.password);
        }
        const user = await this.prisma.user.create({
            data: body,
            include: { 
                role: true  // 🔥 Include role data in response
            }
        });
        return user;
    }

    public async getUserById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { 
                role: true  // 🔥 Include role data
            }
        });
        return user;
    }

    public async updateUser(id: number, body: Prisma.UserUncheckedUpdateInput): Promise<User> {
        // Hash password if it's being updated
        if (body.password && typeof body.password === 'string') {
            body.password = await this.authService.hashPassword(body.password);
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: body,
            include: { 
                role: true  // 🔥 Include role data in response
            }
        });
        return user;
    }

    public async deleteUser(id: number): Promise<User> {
        const user = await this.prisma.user.delete({
            where: { id },
            include: { 
                role: true  // 🔥 Include role data in response
            }
        });
        return user;
    }

    /**
     * Get user by role ID
     */
    public async getUsersByRoleId(roleId: number): Promise<User[]> {
        return await this.prisma.user.findMany({
            where: { role_id: roleId },
            include: { 
                role: true
            }
        });
    }

    /**
     * Update user's role
     */
    public async updateUserRole(userId: number, roleId: number): Promise<User> {
        return await this.prisma.user.update({
            where: { id: userId },
            data: { role_id: roleId },
            include: { 
                role: true
            }
        });
    }
}
