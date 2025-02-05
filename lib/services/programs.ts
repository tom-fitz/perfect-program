import { BaseService } from '../base-service';
import { UnauthorizedError } from '../errors';
import { Difficulty } from '@prisma/client';

export class ProgramService extends BaseService {
  async getPrograms() {
    if (!this.user.isAdmin) {
      throw new UnauthorizedError('Only admins can view all programs');
    }

    return this.prisma.program.findMany({
      include: {
        workouts: {
          include: {
            workout: {
              include: {
                exercises: {
                  include: {
                    exercise: true
                  }
                }
              }
            }
          },
          orderBy: [
            { weekNumber: 'asc' },
            { dayNumber: 'asc' },
            { order: 'asc' }
          ]
        },
        assignedTo: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async createProgram(data: {
    name: string;
    description?: string;
    duration: number;
    difficulty: Difficulty;
    workouts: {
      workoutId: string;
      weekNumber: number;
      dayNumber: number;
      order: number;
    }[];
  }) {
    if (!this.user.isAdmin) {
      throw new UnauthorizedError('Only admins can create programs');
    }

    return this.prisma.program.create({
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        difficulty: data.difficulty,
        createdBy: {
          connect: { id: this.user.id }
        },
        workouts: {
          create: data.workouts
        }
      },
      include: {
        workouts: {
          include: {
            workout: true
          }
        }
      }
    });
  }

  async getAvailableWorkouts() {
    return this.prisma.workout.findMany({
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  async getProgramById(id: string) {
    if (!this.user.isAdmin) {
      throw new UnauthorizedError('Only admins can view program details');
    }

    return this.prisma.program.findUnique({
      where: { id },
      include: {
        workouts: {
          include: {
            workout: {
              include: {
                exercises: {
                  include: {
                    exercise: true
                  }
                }
              }
            }
          },
          orderBy: [
            { weekNumber: 'asc' },
            { dayNumber: 'asc' },
            { order: 'asc' }
          ]
        },
        assignedTo: true
      }
    });
  }

  async assignProgramToUser(programId: string, userId: string) {
    if (!this.user.isAdmin) {
      throw new UnauthorizedError('Only admins can assign programs');
    }

    return this.prisma.program.update({
      where: { id: programId },
      data: {
        assignedTo: {
          connect: { id: userId }
        }
      }
    });
  }

  async getTotalPrograms() {
    return this.prisma.program.count();
  }

  async getTopPrograms() {
    return this.prisma.program.findMany({
      include: {
        workouts: true,
        _count: {
          select: { assignedTo: true }
        }
      },
      orderBy: {
        assignedTo: { _count: 'desc' }
      },
      take: 5
    });
  }
}
