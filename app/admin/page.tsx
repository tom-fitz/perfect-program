import DashboardCard from '@/components/admin/DashboardCard';
import StatCard from '@/components/admin/StatCard';
import { getServices } from '@/lib/services';
import {
  Users,
  Dumbbell,
  Calendar,
  Activity,
  Trophy,
  Clock
} from 'lucide-react';
import Image from 'next/image';

async function getStats() {
  const { users, exercises, workouts, programs } = await getServices();

  const [
    totalUsers,
    totalExercises,
    totalWorkouts,
    totalPrograms,
    recentUsers,
    popularExercises,
    activeWorkouts,
    topPrograms
  ] = await Promise.all([
    users.getTotalUsers(),
    exercises.getTotalExercises(),
    workouts.getTotalWorkouts(),
    programs.getTotalPrograms(),
    users.getRecentUsers(),
    exercises.getPopularExercises(),
    workouts.getMostActiveWorkouts(),
    programs.getTopPrograms()
  ]);

  return {
    totalUsers,
    totalExercises,
    totalWorkouts,
    totalPrograms,
    recentUsers,
    popularExercises,
    activeWorkouts,
    topPrograms
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6 p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend="+12%"
          href="/admin/users"
        />
        <StatCard
          title="Total Exercises"
          value={stats.totalExercises}
          icon={Dumbbell}
          trend="+5%"
          href="/admin/exercises"
        />
        <StatCard
          title="Active Workouts"
          value={stats.totalWorkouts}
          icon={Activity}
          trend="+8%"
          href="/admin/workouts"
        />
        <StatCard
          title="Programs Created"
          value={stats.totalPrograms}
          icon={Calendar}
          trend="+15%"
          href="/admin/programs"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Popular Exercises">
          <div className="space-y-4">
            {stats.popularExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Dumbbell className="w-8 h-8 text-sunglow mr-3" />
                  <div>
                    <p className="text-powder">{exercise.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{exercise.type.name}</span>
                      <span>•</span>
                      <span>{exercise.difficulty}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-sunglow font-medium">
                  {exercise._count.workouts} workouts
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Most Active Workouts">
          <div className="space-y-4">
            {stats.activeWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-powder mr-3" />
                  <div>
                    <p className="text-powder">{workout.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{workout.exercises.length} exercises</span>
                      <span>•</span>
                      <span>{workout.duration} min</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-powder font-medium">
                  {workout._count.programs} programs
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Top Programs">
          <div className="space-y-4">
            {stats.topPrograms.map((program) => (
              <div
                key={program.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-sunglow mr-3" />
                  <div>
                    <p className="text-powder">{program.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{program.workouts.length} workouts</span>
                      <span>•</span>
                      <span>{program.duration} weeks</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-powder font-medium">
                  {program._count.assignedTo} users
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Recent Users">
          <div className="space-y-4">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 mr-3" />
                  )}
                  <div>
                    <p className="text-powder">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
