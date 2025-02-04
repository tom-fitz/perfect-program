import { BaseService } from '../../base-service'
import { UnauthorizedError } from '@/lib/errors'
import { getUserContext } from '@/lib/context'

export class AdminUserService extends BaseService {
  constructor(user: Awaited<ReturnType<typeof getUserContext>>['user']) {
    super(user)
    if (!user.isAdmin) {
      throw new UnauthorizedError('Admin access required')
    }
  }

  async getUsers() {
    return this.prisma.user.findMany({
      where: {
        isAdmin: false
      }
    })
  }
} 