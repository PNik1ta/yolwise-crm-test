import { prisma } from "../../config/prisma";

export class UsersService {
  async listUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const usersService = new UsersService();
