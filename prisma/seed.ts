import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.exercise.deleteMany();
  await prisma.bodyPart.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.exerciseType.deleteMany();

  // Create body parts
  const bodyParts = [
    'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 
    'Quadriceps', 'Hamstrings', 'Calves', 'Core', 'Full Body'
  ];

  for (const name of bodyParts) {
    await prisma.bodyPart.create({ data: { name } });
  }

  // Create equipment types
  const equipmentTypes = [
    'Bodyweight', 'Dumbbells', 'Barbell', 'Kettlebell',
    'Resistance Bands', 'Cable Machine', 'Smith Machine',
    'Pull-up Bar', 'Bench', 'Medicine Ball', 'Yoga Mat'
  ];

  for (const name of equipmentTypes) {
    await prisma.equipment.create({ data: { name } });
  }

  // Create exercise types
  const exerciseTypes = [
    'Strength', 'Hypertrophy', 'Endurance', 'Power',
    'Flexibility', 'Balance', 'Cardio', 'HIIT'
  ];

  for (const name of exerciseTypes) {
    await prisma.exerciseType.create({ data: { name } });
  }

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