import { Prisma, PrismaClient, Permission } from '../../generated/prisma/index';
import { prismaClient } from '../config/prisma';

export class PermissionService {
    private readonly prisma: PrismaClient = prismaClient;

    public async getAllPermissions(): Promise<Permission[]> {
        return await this.prisma.permission.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

    public async createPermission(data: Prisma.PermissionCreateInput): Promise<Permission> {
        return await this.prisma.permission.create({
            data
        });
    }

    public async createManyPermissions(data: Prisma.PermissionCreateManyInput[]): Promise<number> {
        const result = await this.prisma.permission.createMany({
            data,
            skipDuplicates: true
        });
        return result.count;
    }

    public async getPermissionByName(name: string): Promise<Permission | null> {
        return await this.prisma.permission.findFirst({
            where: { name }
        });
    }

    public async deleteAllPermissions(): Promise<number> {
        const result = await this.prisma.permission.deleteMany({});
        return result.count;
    }
}
