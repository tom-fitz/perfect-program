import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getServices } from "./services"

export async function getUserContext() {
  const validAdmins = ['tpfitz42@gmail.com']
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const { users } = await getServices()
  
  // Get or create user in our database
  const user = await users.getOrCreateUser({
    email: session.user.email,
    name: session.user.name,
    image: session.user.image
  })

  return {
    user: {
      ...user,
      isAdmin: validAdmins.includes(session.user.email)
    }
  }
} 