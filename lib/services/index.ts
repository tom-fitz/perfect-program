import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ExerciseService } from './exercises'
import { WorkoutService } from './workouts'
import { UserService } from './users'
// import { ScheduleService } from './schedule'

async function bootstrapUser() {
  const session = await auth()
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }
  
  const userService = new UserService({ 
    id: '', 
    email: session.user.email!, 
    name: session.user.name ?? null, 
    image: session.user.image ?? null, 
    isAdmin: false,
    emailVerified: null,
    adminId: null
  })
  return userService.getCurrentUser(session.user.email!)
}

interface Services {
  users: UserService;
  workouts: WorkoutService;
  exercises: ExerciseService;
}

export async function getServices(): Promise<Services> {
  const user = await bootstrapUser()
  
  return {
    users: new UserService(user),
    workouts: new WorkoutService(user),
    exercises: new ExerciseService(user)
  }
} 