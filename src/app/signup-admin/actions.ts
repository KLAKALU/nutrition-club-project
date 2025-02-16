'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const adminPassword = formData.get('adminPassword') as string

  // Validate admin password
  if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASS) {
    throw new Error('管理者パスワードが正しくありません');
  }

  // Validate email and password
  if (!email || !password) {
    throw new Error('メールアドレスとパスワードは必須です');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        is_admin: true,
      },
    },
  })

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout')
  redirect('/')
}