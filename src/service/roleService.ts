import { Prisma, PrismaClient, Role } from '@/prisma/index';

export class RoleService {
    private readonly prisma: PrismaClient = new PrismaClient();

    public async getAllRoles(): Promise<Role[]> {
        return await this.prisma.role.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

    public async createRole(data: Prisma.RoleCreateInput): Promise<Role> {
        return await this.prisma.role.create({
            data
        });
    }

    public async createManyRoles(data: Prisma.RoleCreateManyInput[]): Promise<number> {
        const result = await this.prisma.role.createMany({
            data,
            skipDuplicates: true
        });
        return result.count;
    }

    public async getRoleByName(name: string): Promise<Role | null> {
        return await this.prisma.role.findFirst({
            where: { name }
        });
    }

    public async deleteAllRoles(): Promise<number> {
        const result = await this.prisma.role.deleteMany({});
        return result.count;
    }
}
