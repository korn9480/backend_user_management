import { Prisma, PrismaClient, Role_Permission } from '@/prisma/index';

export class RolePermissionService {
    private readonly prisma: PrismaClient = new PrismaClient();

    public async getAllRolePermissions(): Promise<Role_Permission[]> {
        return await this.prisma.role_Permission.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

    public async createRolePermission(data: Prisma.Role_PermissionUncheckedCreateInput): Promise<Role_Permission> {
        return await this.prisma.role_Permission.create({
            data
        });
    }

    public async createManyRolePermissions(data: Prisma.Role_PermissionCreateManyInput[]): Promise<number> {
        const result = await this.prisma.role_Permission.createMany({
            data,
            skipDuplicates: true
        });
        return result.count;
    }

    public async getRolePermissionsByRoleId(roleId: number): Promise<Role_Permission[]> {
        return await this.prisma.role_Permission.findMany({
            where: { role_id: roleId }
        });
    }

    public async deleteAllRolePermissions(): Promise<number> {
        const result = await this.prisma.role_Permission.deleteMany({});
        return result.count;
    }

    public async deleteRolePermissionsByRoleId(roleId: number): Promise<number> {
        const result = await this.prisma.role_Permission.deleteMany({
            where: { role_id: roleId }
        });
        return result.count;
    }
}
