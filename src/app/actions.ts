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

    const {data, error} = await supabase
        .from('body_composition')
        .select('year_month, weight, muscle_mass, body_fat')
        .eq('player_id', playerId)
        .limit(6)
        if (error) {
            redirect('/error')
          }
    return data
}