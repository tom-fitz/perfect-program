import { getUserContext } from './context';
import { prisma } from './prisma';

export class BaseService {
  protected prisma = prisma;
  protected user: Awaited<ReturnType<typeof getUserContext>>['user'];

  constructor(user: Awaited<ReturnType<typeof getUserContext>>['user']) {
    this.user = user;
  }

  protected enforceUserContext<T extends { userId: string }>(data: T): T {
    return {
      ...data,
      userId: this.user.id
    };
  }
}
