'use server'

import { getServices } from "@/lib/services"
import { revalidatePath } from "next/cache"
import { sendInviteEmail } from "@/lib/email"

export async function inviteUser(data: { email: string }) {
  try {
    const { adminUsers } = await getServices()
    const user = await adminUsers.createInvite(data.email)
    
    // Send invite email
    await sendInviteEmail({
      email: data.email,
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?email=${encodeURIComponent(data.email)}`
    })

    revalidatePath('/admin/clients')
    return { success: true, data: user }
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return { 
      success: false, 
      error: error.message || 'Failed to invite user' 
    }
  }
} 