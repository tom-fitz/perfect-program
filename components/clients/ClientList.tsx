import { User } from "@prisma/client"

export default function ClientList({ clients }: { clients: User[] }) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No clients to display
      </div>
    )
  }

  return (
    <div className="bg-ebony rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left p-4 text-gray-400 font-medium">Name</th>
            <th className="text-left p-4 text-gray-400 font-medium">Email</th>
            <th className="text-left p-4 text-gray-400 font-medium">Joined</th>
            <th className="text-left p-4 text-gray-400 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-gray-800 last:border-0">
              <td className="p-4 text-powder">
                {client.name || 'Pending Invite'}
              </td>
              <td className="p-4 text-powder">
                {client.email}
              </td>
              <td className="p-4 text-powder">
                {new Date(client.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4">
                {client.emailVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
                    Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 