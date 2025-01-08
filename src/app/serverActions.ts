'use server'

import { Nutrition } from '@/types/types'
import { createClient } from '@/utils/supabase/server'

import { redirect } from 'next/navigation'
import dayjs from 'dayjs'

export async function getPlayerList() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('players')
        .select()
    if (error) {
        redirect('/error')
    }
    return data
}

export async function getPlayerBodyComposition(playerId: string, date: Date) {
    const supabase = await createClient()

    const startOfMonth = dayjs(date).subtract(1,"y").startOf('month').toISOString()
    const endOfMonth = dayjs(date).endOf('month').toISOString()

    const { data, error } = await supabase
        .from('body_composition')
        .select('year_month, weight, muscle_mass, body_fat')
        .eq('player_id', playerId)
        .order('year_month')
        .gte('year_month', startOfMonth)
        .lt('year_month', endOfMonth)
    if (error) {
        redirect('/error')
    }
    return data
}

export async function getPlayerNutrition(playerId: string, yearMonth: Date): Promise<Nutrition[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
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
    const NutritionData: Nutrition[] = data.map(item => ({
        ...item,
        meal_type: item.meal_type?.type || null
    }))
    return NutritionData
}