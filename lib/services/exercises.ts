import { BaseService } from '../base-service';
import { UnauthorizedError } from '@/lib/errors';
import { Difficulty, Prisma } from '@prisma/client';

interface FilterOptions {
  bodyPart?: string;
  equipment?: string[];
  type?: string;
  difficulty?: Difficulty;
  search?: string;
}

export class ExerciseService extends BaseService {
  async getExercises(filters?: FilterOptions) {
    const where: Prisma.ExerciseWhereInput = {};

    if (filters) {
      if (filters.bodyPart) {
        where.bodyPartId = filters.bodyPart;
      }
      if (filters.equipment?.length) {
        where.equipment = {
          some: {
            id: {
              in: filters.equipment
            }
          }
        };
      }
      if (filters.type) {
        where.typeId = filters.type;
      }
      if (filters.difficulty) {
        where.difficulty = filters.difficulty;
      }
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
    }

    return this.prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        createdBy: {
          select: {
            name: true
          }
        },
        bodyPart: true,
        equipment: true,
        type: true
      }
    });
  }

  async getBodyParts() {
    return this.prisma.bodyPart.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async getEquipment() {
    return this.prisma.equipment.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async getExerciseTypes() {
    return this.prisma.exerciseType.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async createExercise(data: {
    name: string;
    description: string;
    videoUrl: string;
    bodyPartId: string;
    equipmentIds: string[];
    typeId: string;
    difficulty: Difficulty;
  }) {
    if (!this.user?.id) {
      throw new Error('User not authenticated');
    }

    if (!this.user.isAdmin) {
      throw new UnauthorizedError('Only admins can create exercises');
    }

    return this.prisma.exercise.create({
      data: {
        name: data.name,
        description: data.description,
        videoUrl: data.videoUrl,
        userId: this.user.id,
        bodyPartId: data.bodyPartId,
        typeId: data.typeId,
        difficulty: data.difficulty,
        equipment: {
          connect: data.equipmentIds.map((id) => ({ id }))
        }
      },
      include: {
        createdBy: {
          select: {
            name: true
          }
        },
        bodyPart: true,
        equipment: true,
        type: true
      }
    });
  }

  async getTotalExercises() {
    return this.prisma.exercise.count();
  }

  async getPopularExercises() {
    return this.prisma.exercise.findMany({
      include: {
        type: true,
        _count: {
          select: { workouts: true }
        }
      },
      orderBy: {
        workouts: { _count: 'desc' }
      },
      take: 5
    });
  }
}
