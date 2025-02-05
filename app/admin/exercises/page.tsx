import { getServices } from '@/lib/services';
import ExercisesClient from './ExercisesClient';

export default async function AdminExercisesPage() {
  const { exercises: exerciseService } = await getServices();
  const [initialExercises, bodyParts, equipment, exerciseTypes] =
    await Promise.all([
      exerciseService.getExercises(),
      exerciseService.getBodyParts(),
      exerciseService.getEquipment(),
      exerciseService.getExerciseTypes()
    ]);

  return (
    <div className="p-6">
      <ExercisesClient
        initialExercises={initialExercises}
        bodyParts={bodyParts}
        equipment={equipment}
        exerciseTypes={exerciseTypes}
      />
    </div>
  );
}
