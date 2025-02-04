import { getServices } from "@/lib/services"
import ClientList from "@/components/clients/ClientList"
import InviteClientButton from "@/components/clients/InviteClientButton"

export default async function ClientsPage() {
  const { adminUsers } = await getServices()
  const clients = await adminUsers.getUsers()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <InviteClientButton />
      </div>
      <ClientList clients={clients} />
    </div>
  )
} 