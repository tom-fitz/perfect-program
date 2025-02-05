import { getServices } from '@/lib/services';
import { getUserContext } from '@/lib/context';
import NewExerciseButton from '@/components/exercises/NewExerciseButton';
import ExerciseList from '@/components/exercises/ExerciseList';

export default async function ExercisesPage() {
  const { exercises } = await getServices();
  const { user } = await getUserContext();
  const [exerciseList, bodyParts, equipment, exerciseTypes] = await Promise.all(
    [
      exercises.getExercises(),
      exercises.getBodyParts(),
      exercises.getEquipment(),
      exercises.getExerciseTypes()
    ]
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Exercise Library</h1>
        {user.isAdmin && (
          <NewExerciseButton
            bodyParts={bodyParts}
            equipment={equipment}
            exerciseTypes={exerciseTypes}
          />
        )}
      </div>
      <ExerciseList exercises={exerciseList} />
    </div>
  );
}
