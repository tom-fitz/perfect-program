import { getServices } from "@/lib/services";
import { 
  Users, Dumbbell, Calendar
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import DashboardCard from '@/components/admin/DashboardCard';

async function getStats() {
  const { adminUsers, exercises, workouts } = await getServices();
  
  const [
    totalUsers,
    totalExercises,
    totalWorkouts,
    recentUsers,
    popularExercises
  ] = await Promise.all([
    adminUsers.getTotalUsers(),
    exercises.getTotalExercises(),
    workouts.getTotalWorkouts(),
    adminUsers.getRecentUsers(),
    exercises.getPopularExercises()
  ]);

  return {
    totalUsers,
    totalExercises,
    totalWorkouts,
    recentUsers,
    popularExercises
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon={Calendar}
          trend="+8%"
          href="/admin/workouts"
        />
      </div>

      {/* Recent Activity & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Recent Users">
          <div className="space-y-4">
            {stats.recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {user.image ? (
                    <img src={user.image} className="w-8 h-8 rounded-full mr-3" />
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

        <DashboardCard title="Popular Exercises">
          <div className="space-y-4">
            {stats.popularExercises.map(exercise => (
              <div key={exercise.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Dumbbell className="w-8 h-8 text-sunglow mr-3" />
                  <div>
                    <p className="text-powder">{exercise.name}</p>
                    <p className="text-sm text-gray-400">{exercise.type.name}</p>
                  </div>
                </div>
                <span className="text-sm text-sunglow">
                  {exercise._count.workouts} uses
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}