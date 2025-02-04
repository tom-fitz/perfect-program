import { BaseService } from "../base-service";
import { UnauthorizedError } from "@/lib/errors";

export class ExerciseService extends BaseService {
  async getExercises() {
    return this.prisma.exercise.findMany({
      orderBy: { name: 'asc' },
      include: {
        createdBy: {
          select: {
            name: true
          }
        }
      }
    });
  }

  async createExercise(data: { name: string; description: string; videoUrl: string }) {
    if (!this.user?.id) {
      throw new Error('User not authenticated');
    }

    if (!this.user.isAdmin) {
      throw new UnauthorizedError('Only admins can create exercises');
    }

    return this.prisma.exercise.create({
      data: {
        ...data,
        userId: this.user.id
      },
      include: {
        createdBy: {
          select: {
            name: true
          }
        }
      }
    });
  }
}