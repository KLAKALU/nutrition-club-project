'use server'

import { Nutrition, Comment } from '@/types/types'
import { createClient } from '@/utils/supabase/server'

import { redirect } from 'next/navigation'

export async function logout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut({ scope: 'global' })
    if (error) {
        redirect('/error')
    }
    redirect('/')
}

export async function getPlayerList() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('player_profiles')
        .select()
        .eq('is_initial_setup_done', true)
    if (error) {
        redirect('/error')
    }
    return data
}

export async function getPlayerBodyComposition(playerId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('body_composition')
        .select('year_month, weight, muscle_mass, body_fat')
        .eq('player_id', playerId)
        .order('year_month')
    if (error) {
        redirect('/error')
    }
    return data
}

export async function getPlayerNutrition(playerId: string): Promise<Nutrition[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('player_nutrition')
        .select('is_training_day, meal_type (type), energy, protein, fat, carbohydrate, calcium, iron, zinc, vitaminA, vitaminD, vitaminE, vitaminK, vitaminB1, vitaminB2, vitaminC')
        .eq('player_id', playerId)
    if (error) {
        redirect('/error')
    }
    if (!data) {
        return []
    }
    const NutritionData: Nutrition[] = data.map(item => ({
        ...item,
        meal_type: item.meal_type?.type || null
    }))
    return NutritionData
}

export async function getComment(playerId: string): Promise<Comment[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('comment')
        .select('comment, date, player_id')
        .eq('player_id', playerId)
    if (error) {
        throw new Error('コメントの取得に失敗しました')
    }
    if (!data) {
        return []
    }
    return data
}