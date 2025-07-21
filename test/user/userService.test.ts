import { expect, test, vi } from "vitest"
import { UserService } from "../../src/service/userService"
import { Prisma } from "../../generated/prisma"
import prisma from '../libs/__mocks__/prisma'
import { AuthService } from "../../src/service/authService"

vi.mock('../../src/config/prisma', async () => {
    const prisma = await import('../libs/__mocks__/prisma')
    return {
        prismaClient: prisma.default
    }
})

vi.mock("../../src/service/authService")

const userService = new UserService()

test('createUser should return the generated user', async () => {
    const newUser: Prisma.UserUncheckedCreateInput = { email: 'user@prisma.io', name: 'Prisma Fan', password: "123456", role_id: 1}
    const hashedPassword = 'hashed_password'
    const createdAt = new Date()

    vi.spyOn(AuthService.prototype, 'hashPassword').mockResolvedValue(hashedPassword)

    prisma.user.create.mockResolvedValue({...newUser, id: 1, password: hashedPassword, createdAt, role_id: 1  })
    
    const user = await userService.createUser(newUser)
    
    expect(user).toStrictEqual({ ...newUser, id: 1, password: hashedPassword, createdAt})
})

