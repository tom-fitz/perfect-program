import { BaseService } from '../base-service'
import { Prisma } from '@prisma/client'

export class WorkoutService extends BaseService {
  async getWorkouts() {
    return this.prisma.workout.findMany({
      where: {
        createdById: this.user.id
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    })
  }

  async createWorkout(data: Omit<Prisma.WorkoutCreateInput, 'createdBy'>) {
    return this.prisma.workout.create({
      data: {
        ...data,
        createdBy: {
          connect: { id: this.user.id }
        }
      }
    })
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
    })
  }
} 