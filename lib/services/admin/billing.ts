import { BaseService } from '../../base-service';
import { UnauthorizedError } from '@/lib/errors';
import { getUserContext } from '@/lib/context';

export class AdminBillingService extends BaseService {
  constructor(user: Awaited<ReturnType<typeof getUserContext>>['user']) {
    super(user);
    if (!user.isAdmin) {
      throw new UnauthorizedError('Admin access required');
    }
  }

  async getBills() {
    return this.prisma.billing.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        template: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getTemplates() {
    return this.prisma.billingTemplate.findMany({
      where: {
        userId: this.user.id
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  async createTemplate(data: {
    name: string;
    amount: number;
    description?: string;
  }) {
    return this.prisma.billingTemplate.create({
      data: {
        ...data,
        userId: this.user.id
      }
    });
  }

  async createBill(data: {
    amount: number;
    dueDate: Date;
    description?: string;
    userId?: string;
    templateId?: string;
    status?: string;
  }) {
    const { userId, ...rest } = data;
    return this.prisma.billing.create({
      data: {
        ...rest,
        status: data.status || 'draft',
        userId: userId || this.user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        template: true
      }
    });
  }
}
