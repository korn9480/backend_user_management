import { Request, Response } from "express";
import { RoleService } from "../service/roleService";
import { PermissionService } from "../service/permissionService";
import { RolePermissionService } from "../service/rolePermissionService";
import { ApiResponse } from '../type/response/response';
import { RoleUser } from "../type/interface/enum/rolesUser";
import { Prisma } from "@/prisma";
import { UserService } from '../service/userService';

interface SeedStats {
    roles_created: number;
    permissions_created: number;
    role_permissions_created: number;
    users_created: number
}

export class SeedController {
    private readonly roleService = new RoleService();
    private readonly permissionService = new PermissionService();
    private readonly rolePermissionService = new RolePermissionService();
    private readonly userService = new UserService()

    // Seed data definitions
    private readonly defaultRoles = [
        { name: RoleUser.admin },
        { name: RoleUser.user },
    ];

    private readonly defaultPermissions = [
        { name: "create" },
        { name: "read" },
        { name: "update" },
        { name: "delete" }
    ];

    // Role-Permission mappings
    private readonly rolePermissionMappings = {
        admin: [
            "create", "read", "update", "delete",
        ],
        user: [
            "read",
        ],
    };

    // User Default
    private readonly usersDefault: Prisma.UserUncheckedCreateInput[] = 
    [
        {
            email: "admin@gmail.com",
            name: "admin",
            password: "123456",
            role_id: 1 // admin
        }
    ]

    public seedRolePermissions = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("🌱 Starting Role-Permission seeding...");

            // 1. Create Roles
            console.log("📝 Creating roles...");
            const rolesCreated = await this.roleService.createManyRoles(this.defaultRoles);

            // 2. Create Permissions  
            console.log("🔐 Creating permissions...");
            const permissionsCreated = await this.permissionService.createManyPermissions(this.defaultPermissions);

            // 3. Create Role-Permission relationships
            console.log("🔗 Creating role-permission relationships...");
            let rolePermissionsCreated = 0;

            for (const [roleName, permissionNames] of Object.entries(this.rolePermissionMappings)) {
                const role = await this.roleService.getRoleByName(roleName);
                if (!role) {
                    console.log(`⚠️  Role '${roleName}' not found, skipping...`);
                    continue;
                }

                for (const permissionName of permissionNames) {
                    const permission = await this.permissionService.getPermissionByName(permissionName);
                    if (!permission) {
                        console.log(`⚠️  Permission '${permissionName}' not found, skipping...`);
                        continue;
                    }

                    try {
                        await this.rolePermissionService.createRolePermission({
                            role_id: role.id,
                            permission_id: permission.id
                        });
                        rolePermissionsCreated++;
                    } catch (error) {
                        // Skip duplicates
                        console.log(`ℹ️  Role-Permission relation already exists: ${roleName} -> ${permissionName}`);
                    }
                
                
                }
            }

            let usersCreated = 0
            for (const [_, user] of Object.entries(this.usersDefault)) {
                await this.userService.createUser(user)
                usersCreated += 1
            }

            const stats: SeedStats = {
                roles_created: rolesCreated,
                permissions_created: permissionsCreated,
                role_permissions_created: rolePermissionsCreated,
                users_created: usersCreated
            };

            console.log("✅ Seeding completed successfully!");
            console.log("📊 Stats:", stats);

            const resData: ApiResponse<SeedStats> = {
                status: "success",
                message: "Role-Permission data seeded successfully",
                data: stats
            };

            res.status(201).json(resData);
        } catch (error) {
            console.error("❌ Seeding failed:", error);
            const resError: ApiResponse<undefined> = {
                status: "error",
                message: `Seeding failed: ${error}`
            };
            res.status(500).json(resError);
        }
    };
}

export const seedController = new SeedController();
