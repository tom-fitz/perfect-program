import { BaseService } from '../../base-service';
import { UnauthorizedError } from '@/lib/errors';
import { getUserContext } from '@/lib/context';

export class AdminUserService extends BaseService {
  constructor(user: Awaited<ReturnType<typeof getUserContext>>['user']) {
    super(user);
    if (!user.isAdmin) {
      throw new UnauthorizedError('Admin access required');
    }
  }

  async getUsers() {
    return this.prisma.user.findMany({
      where: {
        isAdmin: false
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  async createInvite(email: string) {
    // First check if user already exists
    // const existingUser = await this.prisma.user.findUnique({
    //   where: { email }
    // })

    // if (existingUser) {
    //   throw new Error('User already exists')
    // }

    // Create a pending user
    const user = await this.prisma.user.create({
      data: {
        email,
        adminId: this.user.id, // Connect to the admin who created the invite
        isAdmin: false
      }
    });

    return user;
  }

  async getTotalUsers() {
    return this.prisma.user.count({
      where: { isAdmin: false }
    });
  }

  async getRecentUsers() {
    return this.prisma.user.findMany({
      where: { isAdmin: false },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
  }
}
