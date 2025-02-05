import { BaseService } from '../base-service';
import { Difficulty } from '@prisma/client';
import { UnauthorizedError } from '../errors';

export class WorkoutService extends BaseService {
  async getWorkouts() {
    if (!this.user.isAdmin) {
      throw new UnauthorizedError('Only admins can view all workouts');
    }

    return this.prisma.workout.findMany({
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        programs: {
          include: {
            program: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async createWorkout(data: {
    name: string;
    description?: string;
    duration: number;
    difficulty: Difficulty;
    exercises: {
      exerciseId: string;
      sets: number;
      reps?: number;
      duration?: number;
      order: number;
      notes?: string;
      restPeriod: number;
    }[];
  }) {
    if (!this.user.isAdmin) {
      throw new UnauthorizedError('Only admins can create workouts');
    }

    return this.prisma.workout.create({
      data: {
        ...data,
        createdBy: {
          connect: { id: this.user.id }
        },
        exercises: {
          create: data.exercises
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });
  }

  async getWorkoutById(id: string) {
    return this.prisma.workout.findFirst({
      where: {
        id,
        createdById: this.user.id
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });
  }

  async getTotalWorkouts() {
    return this.prisma.workout.count();
  }

  async getMostActiveWorkouts() {
    return this.prisma.workout.findMany({
      include: {
        exercises: true,
        _count: {
          select: { programs: true }
        }
      },
      orderBy: {
        programs: { _count: 'desc' }
      },
      take: 5
    });
  }
}
