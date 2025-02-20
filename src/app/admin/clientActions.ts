import { parse } from 'csv-parse/sync';

import { createClient } from '@/utils/supabase/client';
import dayjs from "dayjs";

import { addToast } from '@heroui/react';

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

export function calculateNutrition(nutrition: Nutrition, playerBodyComposition: BodyComposition, training_load: number) {
    if (!playerBodyComposition) {
        addToast({
            title: 'エラー',
            description: '体組成データがありません',
            color: 'danger',
        });
        return;
    }
    const nonFatBodyWeight = playerBodyComposition.weight * (1 - (playerBodyComposition.body_fat / 100));
    const totalEnergy = nonFatBodyWeight * 28.5 * training_load;
    const totalProtein = nonFatBodyWeight * 2.2;
    const totalCarbohydrate = playerBodyComposition.weight * 8.0;
    const totalFat = ((nonFatBodyWeight * 28.5 * 2.0) - totalProtein - totalCarbohydrate) / 9.0;

    const toPercents = (value: number) => Math.round(value * 100);

    const nutritionData: Nutrition = {
        ...nutrition,
        //is_training_day: is_training_day,
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

export function uploadNutrition(userId: string, date: Date, is_training_day: boolean, event: React.ChangeEvent<HTMLInputElement>) {
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
        //const breakfastNutrition = calculateNutrition(nutrition[0], playerBodyComposition, is_training_day);
        //const lunchNutrition = calculateNutrition(nutrition[1], playerBodyComposition, is_training_day);
        //const dinnerNutrition = calculateNutrition(nutrition[2], playerBodyComposition, is_training_day);
        //console.log(breakfastNutrition);
        //console.log(lunchNutrition);
        //console.log(dinnerNutrition);
        const supabase = await createClient();
        const { error } = await supabase
            .from('player_nutrition')
            .insert([
                { ...nutrition[0], meal_type_id: 1, is_training_day: is_training_day, player_id: userId, year: dayjs(date).format("YYYY"), month: dayjs(date).format("M") },
                { ...nutrition[1], meal_type_id: 2, is_training_day: is_training_day, player_id: userId, year: dayjs(date).format("YYYY"), month: dayjs(date).format("M") },
                { ...nutrition[2], meal_type_id: 3, is_training_day: is_training_day, player_id: userId, year: dayjs(date).format("YYYY"), month: dayjs(date).format("M") }
            ]);
        if (error) {
            console.log(error);
            alert("栄養データのアップロードに失敗しました");
            return;
        }
    }

}

export function setTrainingLoad(userID: string, trainingLoad: number, non_training_load: number) {
    const supabase = createClient();
    const updateTrainingLoad = async () => {
        const { error } = await supabase
            .from('player_profiles')
            .update({ training_load: trainingLoad, non_training_load: non_training_load })
            .eq('id', userID);
        if (error) {
            console.log(error);
        }
    }
    updateTrainingLoad();
}

export function uploadBodyComposition(
    userID: string,
    date: Date,
    weight: string,
    bodyFat: string,
    muscleMass: string
) {
    const supabase = createClient();

    // 文字列を数値に変換
    const weightNum = parseFloat(weight);
    const bodyFatNum = parseFloat(bodyFat);
    const muscleMassNum = parseFloat(muscleMass);

    // 数値変換のバリデーション
    if (isNaN(weightNum) || isNaN(bodyFatNum) || isNaN(muscleMassNum)) {
        alert("入力値が不正です。数値を入力してください。");
        return;
    }
    const upload = async () => {
        const { error } = await supabase
            .from('body_composition')
            .insert([{
                player_id: userID,
                year_month: date,
                weight: weightNum,
                muscle_mass: muscleMassNum,
                body_fat: bodyFatNum
            }]);
        if (error) {
            console.log(error);
            alert("体組成データのアップロードに失敗しました");
            return;
        }
    }
    upload();

    alert("体組成データを保存しました");
}

export function uploadComment(authorID: string, playerID: string, date: Date, comment: string) {
    const supabase = createClient();
    const upload = async () => {
        const { error } = await supabase
            .from('comment')
            .upsert({ player_id: playerID,author_id:authorID,  date: date, comment: comment });
        if (error) {
            console.log(error);
            alert("コメントのアップロードに失敗しました");
            return;
        }
    }
    upload();
    alert("コメントを保存しました");
}