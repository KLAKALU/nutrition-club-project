'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function saveSettings(formData: FormData) {
  const supabase = await createClient()

  // ユーザーの認証情報を取得
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // フォームデータの取得と型変換
  const settingsData = {
    lastName: formData.get('lastName') as string,
    firstName: formData.get('firstName') as string,
    age: parseInt(formData.get('age') as string),
    club: formData.get('club') as string,
  }
  // バリデーション
  if (!settingsData.lastName || !settingsData.firstName || !settingsData.age || !settingsData.club) {
    redirect('/error')
  }

  // ユーザープロファイルの更新
  const { error: updateError } = await supabase
  .from('player_profiles')
  .upsert({
    id: user.id,
    last_name: settingsData.lastName,
    first_name: settingsData.firstName,
    age: settingsData.age,
    club: settingsData.club,
    is_initial_setup_done: true
  }, {
    onConflict: 'id'
  })

  if (updateError) {
    redirect('/error')
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      is_initial_setup_done: true,
    }
  })

  if (metadataError) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}