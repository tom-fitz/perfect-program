import { getServices } from "@/lib/services"
import { getUserContext } from "@/lib/context"
import ClientList from "@/components/clients/ClientList"
import InviteClientButton from "@/components/clients/InviteClientButton"
import { redirect } from "next/navigation"

export default async function ClientsPage() {
  const { adminUsers } = await getServices()
  const { user } = await getUserContext()
  
  if (!user.isAdmin) {
    redirect('/app')
  }

  const clients = await adminUsers.getUsers()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-powder">Client Management</h1>
        <InviteClientButton />
      </div>
      <ClientList clients={clients} />
    </div>
  )
} 