// libs/__mocks__/prisma.ts
// 1
// import { PrismaClient } from '@prisma/client'
import { beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { PrismaClient } from '../../../generated/prisma'

const prisma = mockDeep<PrismaClient>()

// 2
beforeEach(() => {
  mockReset(prisma)
})

// 3
export default prisma
