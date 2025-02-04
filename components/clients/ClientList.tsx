import { User } from "@prisma/client"
import { Mail, Calendar } from "lucide-react"

export default function ClientList({ clients }: { clients: User[] }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="divide-y divide-gray-200">
        {clients.map((client) => (
          <div key={client.id} className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{client.name || 'Pending Invite'}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {client.email}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {new Date(client.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 