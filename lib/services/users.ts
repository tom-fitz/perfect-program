import { BaseService } from "../base-service";
import { User } from "@prisma/client";

export class UserService extends BaseService {
  async getOrCreateUser(data: { 
    email: string; 
    name?: string | null; 
    image?: string | null;
  }): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (user) {
      return user;
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name || null,
        image: data.image || null,
        isAdmin: false
      }
    });
  }

  async getCurrentUser(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
} 