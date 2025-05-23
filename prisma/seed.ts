import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function getOrCreateAdmin() {
  const admin = await prisma.user.upsert({
    where: { email: 'tpfitz42@gmail.com' },
    update: { isAdmin: true },
    create: {
      email: 'tpfitz42@gmail.com',
      name: 'Tom Fitzgerald',
      isAdmin: true
    }
  });
  return admin;
}

async function main() {
  const admin = await getOrCreateAdmin();
  console.log('Admin ID:', admin.id);

  // Clear existing data
  await prisma.programWorkout.deleteMany();
  await prisma.program.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.bodyPart.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.exerciseType.deleteMany();

  // Create equipment
  const equipment = await Promise.all([
    prisma.equipment.create({ data: { name: 'Dumbbells' } }),
    prisma.equipment.create({ data: { name: 'Barbell' } }),
    prisma.equipment.create({ data: { name: 'Kettlebell' } }),
    prisma.equipment.create({ data: { name: 'Resistance Band' } }),
    prisma.equipment.create({ data: { name: 'Bodyweight' } })
  ]);

  // Create body parts
  const bodyParts = await Promise.all([
    prisma.bodyPart.create({ data: { name: 'Chest' } }),
    prisma.bodyPart.create({ data: { name: 'Back' } }),
    prisma.bodyPart.create({ data: { name: 'Legs' } }),
    prisma.bodyPart.create({ data: { name: 'Shoulders' } }),
    prisma.bodyPart.create({ data: { name: 'Arms' } }),
    prisma.bodyPart.create({ data: { name: 'Core' } })
  ]);

  // Create exercise types
  const types = await Promise.all([
    prisma.exerciseType.create({ data: { name: 'Strength' } }),
    prisma.exerciseType.create({ data: { name: 'Cardio' } }),
    prisma.exerciseType.create({ data: { name: 'Flexibility' } }),
    prisma.exerciseType.create({ data: { name: 'Balance' } })
  ]);

  // Create exercises
  const exercises = await Promise.all([
    prisma.exercise.create({
      data: {
        name: 'Bench Press',
        description: 'Classic chest exercise',
        videoUrl: 'https://example.com/bench-press',
        userId: admin.id,
        bodyPartId: bodyParts[0].id,
        typeId: types[0].id,
        difficulty: 'INTERMEDIATE',
        equipment: {
          connect: [{ id: equipment[0].id }, { id: equipment[1].id }]
        }
      }
    }),
    prisma.exercise.create({
      data: {
        name: 'Pull-ups',
        description: 'Upper body pulling movement',
        videoUrl: 'https://example.com/pull-ups',
        userId: admin.id,
        bodyPartId: bodyParts[1].id,
        typeId: types[0].id,
        difficulty: 'ADVANCED',
        equipment: { connect: [{ id: equipment[4].id }] }
      }
    }),
    prisma.exercise.create({
      data: {
        name: 'Squats',
        description: 'Fundamental leg exercise',
        videoUrl: 'https://example.com/squats',
        userId: admin.id,
        bodyPartId: bodyParts[2].id,
        typeId: types[0].id,
        difficulty: 'INTERMEDIATE',
        equipment: {
          connect: [{ id: equipment[1].id }, { id: equipment[4].id }]
        }
      }
    }),
    prisma.exercise.create({
      data: {
        name: 'Shoulder Press',
        description: 'Overhead pressing movement',
        videoUrl: 'https://example.com/shoulder-press',
        userId: admin.id,
        bodyPartId: bodyParts[3].id,
        typeId: types[0].id,
        difficulty: 'INTERMEDIATE',
        equipment: { connect: [{ id: equipment[0].id }] }
      }
    }),
    prisma.exercise.create({
      data: {
        name: 'Bicep Curls',
        description: 'Isolation exercise for biceps',
        videoUrl: 'https://example.com/bicep-curls',
        userId: admin.id,
        bodyPartId: bodyParts[4].id,
        typeId: types[0].id,
        difficulty: 'BEGINNER',
        equipment: {
          connect: [{ id: equipment[0].id }, { id: equipment[2].id }]
        }
      }
    }),
    prisma.exercise.create({
      data: {
        name: 'Plank',
        description: 'Core stability exercise',
        videoUrl: 'https://example.com/plank',
        userId: admin.id,
        bodyPartId: bodyParts[5].id,
        typeId: types[3].id,
        difficulty: 'BEGINNER',
        equipment: { connect: [{ id: equipment[4].id }] }
      }
    }),
    prisma.exercise.create({
      data: {
        name: 'Deadlift',
        description: 'Compound pulling movement',
        videoUrl: 'https://example.com/deadlift',
        userId: admin.id,
        bodyPartId: bodyParts[1].id,
        typeId: types[0].id,
        difficulty: 'ADVANCED',
        equipment: { connect: [{ id: equipment[1].id }] }
      }
    }),
    prisma.exercise.create({
      data: {
        name: 'Push-ups',
        description: 'Upper body pushing exercise',
        videoUrl: 'https://example.com/push-ups',
        userId: admin.id,
        bodyPartId: bodyParts[0].id,
        typeId: types[0].id,
        difficulty: 'BEGINNER',
        equipment: { connect: [{ id: equipment[4].id }] }
      }
    }),
    prisma.exercise.create({
      data: {
        name: 'Band Pull-aparts',
        description: 'Upper back and shoulder mobility',
        videoUrl: 'https://example.com/band-pull-aparts',
        userId: admin.id,
        bodyPartId: bodyParts[3].id,
        typeId: types[2].id,
        difficulty: 'BEGINNER',
        equipment: { connect: [{ id: equipment[3].id }] }
      }
    }),
    prisma.exercise.create({
      data: {
        name: 'Kettlebell Swings',
        description: 'Full body explosive movement',
        videoUrl: 'https://example.com/kb-swings',
        userId: admin.id,
        bodyPartId: bodyParts[2].id,
        typeId: types[1].id,
        difficulty: 'INTERMEDIATE',
        equipment: { connect: [{ id: equipment[2].id }] }
      }
    })
  ]);

  // Create workouts
  const workouts = await Promise.all([
    prisma.workout.create({
      data: {
        name: 'Upper Body Power',
        description: 'Focus on upper body strength',
        duration: 45,
        difficulty: 'INTERMEDIATE',
        createdById: admin.id,
        exercises: {
          create: [
            {
              exerciseId: exercises[0].id,
              sets: 4,
              reps: 8,
              order: 0,
              restPeriod: 90
            },
            {
              exerciseId: exercises[1].id,
              sets: 3,
              reps: 10,
              order: 1,
              restPeriod: 120
            },
            {
              exerciseId: exercises[3].id,
              sets: 3,
              reps: 12,
              order: 2,
              restPeriod: 60
            }
          ]
        }
      }
    }),
    prisma.workout.create({
      data: {
        name: 'Lower Body Focus',
        description: 'Leg day essentials',
        duration: 50,
        difficulty: 'ADVANCED',
        createdById: admin.id,
        exercises: {
          create: [
            {
              exerciseId: exercises[2].id,
              sets: 5,
              reps: 5,
              order: 0,
              restPeriod: 180
            },
            {
              exerciseId: exercises[6].id,
              sets: 3,
              reps: 8,
              order: 1,
              restPeriod: 150
            },
            {
              exerciseId: exercises[9].id,
              sets: 4,
              reps: 15,
              order: 2,
              restPeriod: 60
            }
          ]
        }
      }
    }),
    prisma.workout.create({
      data: {
        name: 'Core and Mobility',
        description: 'Focus on core strength and flexibility',
        duration: 30,
        difficulty: 'BEGINNER',
        createdById: admin.id,
        exercises: {
          create: [
            {
              exerciseId: exercises[5].id,
              sets: 3,
              duration: 60,
              order: 0,
              restPeriod: 45
            },
            {
              exerciseId: exercises[8].id,
              sets: 3,
              reps: 15,
              order: 1,
              restPeriod: 30
            },
            {
              exerciseId: exercises[7].id,
              sets: 3,
              reps: 12,
              order: 2,
              restPeriod: 45
            }
          ]
        }
      }
    }),
    prisma.workout.create({
      data: {
        name: 'Full Body HIIT',
        description: 'High-intensity full body workout',
        duration: 40,
        difficulty: 'ADVANCED',
        createdById: admin.id,
        exercises: {
          create: [
            {
              exerciseId: exercises[9].id,
              sets: 5,
              reps: 20,
              order: 0,
              restPeriod: 30
            },
            {
              exerciseId: exercises[7].id,
              sets: 4,
              reps: 15,
              order: 1,
              restPeriod: 30
            },
            {
              exerciseId: exercises[5].id,
              sets: 4,
              duration: 45,
              order: 2,
              restPeriod: 30
            }
          ]
        }
      }
    }),
    prisma.workout.create({
      data: {
        name: 'Strength Basics',
        description: 'Fundamental strength movements',
        duration: 55,
        difficulty: 'INTERMEDIATE',
        createdById: admin.id,
        exercises: {
          create: [
            {
              exerciseId: exercises[0].id,
              sets: 3,
              reps: 10,
              order: 0,
              restPeriod: 90
            },
            {
              exerciseId: exercises[2].id,
              sets: 3,
              reps: 10,
              order: 1,
              restPeriod: 90
            },
            {
              exerciseId: exercises[6].id,
              sets: 3,
              reps: 8,
              order: 2,
              restPeriod: 120
            },
            {
              exerciseId: exercises[3].id,
              sets: 3,
              reps: 12,
              order: 3,
              restPeriod: 60
            }
          ]
        }
      }
    })
  ]);

  // Create programs
  await prisma.program.create({
    data: {
      name: 'Beginner Strength',
      description: 'Perfect for beginners',
      duration: 4,
      difficulty: 'BEGINNER',
      createdById: admin.id,
      workouts: {
        create: [
          {
            workoutId: workouts[0].id,
            weekNumber: 1,
            dayNumber: 1,
            order: 0
          }
        ]
      }
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
