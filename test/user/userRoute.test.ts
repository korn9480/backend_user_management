import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach, Mock, Mocked } from "vitest";
import { mainRouter } from "../../src/route";
import { UserService } from "../../src/service/userService";
import { Prisma } from "../../generated/prisma";

interface MockCatchUser {
  messageIt: string
  data: Prisma.UserUncheckedUpdateInput
  test: {
    statusCode: number,
    message: string
  }
}

// Mock the UserService module
vi.mock("../../src/service/userService", () => {
  const mockUserService: Partial<UserService>= {
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    getUserById: vi.fn(),
    getUsersAll: vi.fn(),
    getUserByEmail: vi.fn(),
    getUsersWithPagination: vi.fn(), // Add this line
    updateUserRole: vi.fn(),
    getUsersByRoleId: vi.fn(),
  };
  return {
    UserService: vi.fn(() => mockUserService),
  };
});

const app = express();
app.use(express.json());
app.use(mainRouter);

describe("POST /user", () => {
  let mockedUserService: Mocked<UserService>;

  
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUserService = new UserService() as Mocked<UserService>;
    // Setup the mock implementation
    mockedUserService.createUser.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      role_id: 1,
      createdAt: new Date(),
    });
  });
  const baseData: Prisma.UserUncheckedUpdateInput = { name: "Test User", email: "test@example.com", password: "123456", role_id: 1 }
  const testValidate: MockCatchUser[] = [
    {
      messageIt: "validator password < 6",
      data: { ...baseData, password: "12345"},
      test: {
        statusCode: 400,
        message: "Password must be at least 6 characters long"
      }
    },
    {
      messageIt: "validator email error Invalid email format",
      data: { ...baseData, email: "testex.com" },
      test: {
        statusCode: 400,
        message: "Invalid email format"
      }
    },
    {
      messageIt: "password null",
      data: { ...baseData, password: undefined },
      test: {
        statusCode: 400,
        message: "Required"
      }
    },
    {
      messageIt: "email null",
      data: { ...baseData, email: undefined },
      test: {
        statusCode: 400,
        message: "Required"
      }
    },
    {
      messageIt: "name null",
      data: { ...baseData, name: undefined },
      test: {
        statusCode: 400,
        message: "Required"
      }
    },
  ]

  it("should create a user and return 201", async () => {

    // Make the request
    const res = await request(app)
    .post("/user/")
    .send({ name: "Test User", email: "test@example.com", password: "123456", role_id: 1 });
    // Assert the response
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("user created successfully");
    expect(res.body.data.email).toBe("test@example.com");
  });
  for (let item of testValidate) {
    it(item.messageIt, async () => {
      const res = await request(app).post("/user")
      .send(item.data);
      expect(res.status).toBe(item.test.statusCode);
      expect(res.body.message).toBe(item.test.message)
    })
  }
});

describe("GET /user", () => {
  let mockedUserService: Mocked<UserService>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUserService = new UserService() as Mocked<UserService>;
  });

  it("should return a list of users with pagination", async () => {
    const mockUsers = [
      { id: 1, name: "User One", email: "one@example.com", password: "hashedpassword1", role_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "User Two", email: "two@example.com", password: "hashedpassword2", role_id: 1, createdAt: new Date(), updatedAt: new Date() },
    ];
    mockedUserService.getUsersWithPagination.mockResolvedValue({
      users: mockUsers,
      totalCount: 2,
    });

    const res = await request(app).get("/user?limit=10&page=2");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Get users successfully");
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).not.toHaveProperty("password");
    expect(res.body.data[1]).not.toHaveProperty("password");
    expect(res.body.pagination).toEqual({
      current_page: 2,
      has_next: false,
      limit: 10,
      total_items: 2,
      total_pages: 1
    });
    expect(mockedUserService.getUsersWithPagination).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      search: undefined,
    });
  });

  it("should handle pagination parameters", async () => {
    const mockUsers = [
      { id: 1, name: "User One", email: "one@example.com", password: "hashedpassword1", role_id: 1, createdAt: new Date(), updatedAt: new Date() },
    ];
    mockedUserService.getUsersWithPagination.mockResolvedValue({
      users: mockUsers,
      totalCount: 5,
    });

    const res = await request(app).get("/user?page=2&limit=1");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toEqual({
      current_page: 2,
      has_next: true,
      limit: 1,
      total_items: 5,
      total_pages: 5
    });
    expect(mockedUserService.getUsersWithPagination).toHaveBeenCalledWith({
      page: 2,
      limit: 1,
      search: undefined,
    });
  });

  it("should handle search parameter", async () => {
    const mockUsers = [
      { id: 1, name: "User One", email: "one@example.com", password: "hashedpassword1", role_id: 1, createdAt: new Date(), updatedAt: new Date() },
    ];
    mockedUserService.getUsersWithPagination.mockResolvedValue({
      users: mockUsers,
      totalCount: 1,
    });

    const res = await request(app).get("/user?search=User One");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(mockedUserService.getUsersWithPagination).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: "User One",
    });
  });

  it("should return 500 if an error occurs", async () => {
    mockedUserService.getUsersWithPagination.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/user");

    expect(res.status).toBe(500);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Error: Database error");
  });
});