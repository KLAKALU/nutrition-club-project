'use server'

import { Nutrition } from '@/types/types'
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
        .order('year_month')
        if (error) {
            redirect('/error')
          }
    return data
}

export async function getPlayerNutrition(playerId: string, yearMonth: Date) {
    const supabase = await createClient()

    const {data, error} = await supabase
        .from('player_nutrition')
        .select('is_training_day, meal_type (type), energy, protein, fat, carbohydrate, calcium, iron, zinc, vitaminA, vitaminD, vitaminE, vitaminK, vitaminB1, vitaminB2, vitaminC')
        .eq('player_id', playerId)
        .eq('year', yearMonth.getFullYear())
        .eq('month', yearMonth.getMonth() + 1)
        if (error) {
            redirect('/error')
        }
    if (!data) {
        return []
    }
    const NutritionData:Nutrition = data.map(item => ({
        ...item,
        meal_type: item.meal_type?.type || null}))
    return NutritionData
}