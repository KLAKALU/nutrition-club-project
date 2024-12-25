import { parse } from 'csv-parse/sync';

import { createClient } from '@/utils/supabase/client';
import dayjs from "dayjs";

import { Nutrition, BodyComposition } from '@/types/types';

function dataToObject(csv: string) {
    const records = parse(csv, { columns: true });
    console.log(records);
    const selectedData = records.filter((n: { [x: string]: string; }) => n['食事区分'] === '朝食合計' || n['食事区分'] === '昼食合計' || n['食事区分'] === '夕食合計');

    const nutrition: Nutrition[] = selectedData.map((record: { [x: string]: number; }) => {
        return {
            energy: record['エネルギー kcal'],
            protein: record['アミノ酸組成によるたんぱく質 g'],
            fat: record['脂肪酸のトリアシルグリセロール当量 g'],
            carbohydrate: record['摂取量計算のための利用可能炭水化物 g'],
            calcium: record['カルシウム mg'],
            iron: record['鉄 mg'],
            zinc: record['亜鉛 mg'],
            vitaminA: record['レチノール活性当量 μg'],
            vitaminD: record['ビタミンD μg'],
            vitaminE: record['α-トコフェロール mg'],
            vitaminK: record['ビタミンK μg'],
            vitaminB1: record['ビタミンB1 mg'],
            vitaminB2: record['ビタミンB2 mg'],
            vitaminC: record['ビタミンC mg']
        };
    });
    return nutrition;
}

function calculateNutrition(nutrition: Nutrition, playerBodyComposition: BodyComposition, is_training_day: boolean) {
    const nonFatBodyWeight = playerBodyComposition.weight * (1 - (playerBodyComposition.body_fat / 100));
    const totalEnergy = nonFatBodyWeight * 28.5 * (is_training_day ? 2.0 : 1.75);
    const totalProtein = nonFatBodyWeight * 2.2;
    const totalCarbohydrate = playerBodyComposition.weight * 8.0;
    const totalFat = ((nonFatBodyWeight * 28.5 * 2.0) - totalProtein - totalCarbohydrate) / 9.0;

    const toPercents = (value: number) => Math.round(value * 100);

    const nutritionData: Nutrition = {
        is_training_day: is_training_day,
        energy: toPercents(nutrition.energy / totalEnergy),
        protein: toPercents(nutrition.protein / totalProtein),
        fat: toPercents(nutrition.fat / totalFat),
        carbohydrate: toPercents(nutrition.carbohydrate / totalCarbohydrate),
        calcium: toPercents(nutrition.calcium / 800),
        iron: toPercents(nutrition.iron / 7.5),
        zinc: toPercents(nutrition.zinc / 11),
        vitaminA: toPercents(nutrition.vitaminA / 850),
        vitaminD: toPercents(nutrition.vitaminD / 8.5),
        vitaminE: toPercents(nutrition.vitaminE / 6),
        vitaminK: toPercents(nutrition.vitaminK / 150),
        vitaminB1: toPercents(nutrition.vitaminB1 / 1.4),
        vitaminB2: toPercents(nutrition.vitaminB2 / 1.6),
        vitaminC: toPercents(nutrition.vitaminC / 100)
    }
    return nutritionData;

}

export function uploadNutrition(userId: string, playerBodyComposition: BodyComposition, is_training_day: boolean, event: React.ChangeEvent<HTMLInputElement>) {
    console.log("uploadNutrition");
    if (!event.target.files) {
        alert("ファイルが選択されていません");
        return;
    }
    const csvFile: File = event.target.files[0];
    console.log(csvFile);
    const reader = new FileReader();
    reader.readAsText(csvFile);
    reader.onload = async () => {
        const csv = reader.result as string;
        console.log(csv);
        const nutrition = dataToObject(csv);
        console.log(nutrition);
        const breakfastNutrition = calculateNutrition(nutrition[0], playerBodyComposition, is_training_day);
        const lunchNutrition = calculateNutrition(nutrition[1], playerBodyComposition, is_training_day);
        const dinnerNutrition = calculateNutrition(nutrition[2], playerBodyComposition, is_training_day);
        console.log(breakfastNutrition);
        console.log(lunchNutrition);
        console.log(dinnerNutrition);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('player_nutrition')
            .insert([
                { ...breakfastNutrition, meal_type_id: 1, player_id: userId, year: dayjs(playerBodyComposition.year_month).format("YYYY"), month: dayjs(playerBodyComposition.year_month).format("M") },
                { ...lunchNutrition, meal_type_id: 2, player_id: userId, year: dayjs(playerBodyComposition.year_month).format("YYYY"), month: dayjs(playerBodyComposition.year_month).format("M") },
                { ...dinnerNutrition, meal_type_id: 3, player_id: userId, year: dayjs(playerBodyComposition.year_month).format("YYYY"), month: dayjs(playerBodyComposition.year_month).format("M") }
            ]);
        if (data) {
            console.log(data);
        }
        if (error) {
            console.log(error);
        }
    }

}