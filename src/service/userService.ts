import { Prisma, PrismaClient, User } from '../../generated/prisma/index';
import { PaginationOptions } from '../util/pagination';

export interface UserWithPagination {
    users: User[];
    totalCount: number;
}

export class UserService {
    private readonly prisma: PrismaClient = new PrismaClient();

    public async getUsersAll (): Promise<User[]> {
        const data = await this.prisma.user.findMany();
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
                            startsWith: search
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
                orderBy: {
                    createdAt: 'desc' // Order by newest first
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

    public async createUser(body: Prisma.UserCreateInput): Promise<User> {
        const user = await this.prisma.user.create({
            data: body
        });
        return user;
    }

    public async getUserById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        return user;
    }

    public async updateUser(id: number, body: Prisma.UserUpdateInput): Promise<User> {
        const user = await this.prisma.user.update({
            where: { id },
            data: body
        });
        return user;
    }

    public async deleteUser(id: number): Promise<User> {
        const user = await this.prisma.user.delete({
            where: { id }
        });
        return user;
    }

}
