'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const loginData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(loginData)

  if (error) {
    redirect('/error')
  }

  const { data, error: userError } = await supabase.auth.getUser()

  if (userError) {
    redirect('/error')
  }

  if (data?.user?.user_metadata?.is_admin) {
    redirect('/admin')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}