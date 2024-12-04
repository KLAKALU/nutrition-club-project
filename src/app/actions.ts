'use server'

import { createClient } from '@/utils/supabase/server'

import { redirect } from 'next/navigation'

export async function getPlayerList() {
    const supabase = await createClient()

    const {data, error} = await supabase
        .from('players')
        .select()
        if (error) {
            redirect('/error')
          }
    
    return data
}

export async function getPlayerBodyComposition(playerId: string) {
    const supabase = await createClient()

    const {data: playerBodyComposition, error} = await supabase.from('body_composition')
        .select('player_id, weight, height, body_fat, muscle_mass, bone_mass, water_mass, date')
        .eq('player_id', playerId)
        .order('date', {ascending: false})
}