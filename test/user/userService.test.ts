import { afterAll, describe, expect, test, vi } from "vitest"
import { UserService } from "../../src/service/userService"
import { Prisma } from "../../generated/prisma"
import prisma from '../libs/__mocks__/prisma'
import { AuthService } from "../../src/service/authService"
import { prismaClient } from "../../src/config/prisma"


if (process.env.VITE_USER_NODE_ENV !== 'test') {
    throw new Error('This test file should only be run in a test environment')
}

afterAll(async () => {
    await prismaClient.user.deleteMany()
})

const userService = new UserService()

describe('UserService Tests', () => {
    test('createUser should return the generated user', async () => {
        const newUser: Prisma.UserUncheckedCreateInput = { email: 'user@prisma.io', name: 'Prisma Fan', password: "123456", role_id: 1}    
        const userCreate = await userService.createUser(newUser)
        
        const user = await userService.getUserById(userCreate.id)
        expect(user).not.toBeNull()
        expect(user).not.toBeUndefined()
        expect(user?.id).toBe(userCreate.id)
    })
    
    test('getUserByEmail should return the user', async () => {
        const email = "user@prisma.io"
        const user = await userService.getUserByEmail(email)
        expect(user).not.toBeNull()
        expect(user).not.toBeUndefined()
    })
    
    test('getUserByEmail should return null or find not found email', async () => {
        const email = ""
        const user = await userService.getUserByEmail(email)
        expect(user).toBeNull()
    })    
})

