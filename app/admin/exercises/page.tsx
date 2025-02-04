import { getServices } from "@/lib/services";
import { getUserContext } from "@/lib/context";
import NewExerciseButton from "@/components/exercises/NewExerciseButton";
import ExerciseList from "@/components/exercises/ExerciseList";
import { redirect } from "next/navigation";

export default async function AdminExercisesPage() {
  const { exercises } = await getServices();
  const { user } = await getUserContext();
  
  if (!user.isAdmin) {
    redirect('/app');
  }

  const exerciseList = await exercises.getExercises();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-powder">Exercise Library Management</h1>
        <NewExerciseButton />
      </div>
      <ExerciseList 
        exercises={exerciseList}
        isAdmin={true}
      />
    </div>
  );
} 