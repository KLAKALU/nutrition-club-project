import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import {Button} from "@heroui/button";

import { logout } from './actions'

export default async function PrivatePage() {

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div>
        <h1>Private Page</h1>
        <p>Hello {data.user.email}</p>
        <form onSubmit={logout}>
            <Button type="submit">
                Log out
            </Button>
        </form>
    </div>
  )
}
