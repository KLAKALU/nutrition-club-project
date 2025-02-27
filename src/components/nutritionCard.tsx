'use client'

import { useState } from 'react';
import dayjs from 'dayjs';
import { Input } from "@heroui/input";
import { Card, CardHeader, Divider, Button, Textarea, Switch, addToast } from "@heroui/react"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import { BodyComposition, Nutrition, PlayerProfile, Comment } from '@/types/types';

import { uploadNutrition, calculateNutrition } from '@/app/admin/clientActions';
import BodyCompositionGraph from '@/utils/graph/bodyCompositionGraph';
import NutritionGraph from '@/utils/graph/nutritionGraph';

type NutritionCardProps = {
    nutrition: Nutrition[] | undefined;
    selectPlayer: PlayerProfile;
    currentDate: Date;
    bodyComposition: BodyComposition[] | undefined;
    commentList: Comment[] | undefined;
    is_admin: boolean;
    onEditOpen: () => void | undefined;
}

export default function NutritionCard({ nutrition, selectPlayer, currentDate, bodyComposition, commentList, is_admin, onEditOpen }: NutritionCardProps) {

    const [isGraphMode, setIsGraphMode] = useState(true);

    const [SheetSelectedDay, setSheetSelectedDay] = useState<Date>(currentDate);

    const [sheetIndex, setSheetIndex] = useState(0);

    if (!selectPlayer.non_training_load || !selectPlayer.training_load) {
        addToast({
            title: "エラー",
            description: "トレーニング負荷が設定されていません",
            color: "danger",
          })
        return null;
    }

    if (!bodyComposition || !nutrition || !commentList) {
        addToast({
            title: "エラー",
            description: "データが取得できませんでした",
            color: "danger",
          })
        return null;
    }

    const trainingDayNutrition: Nutrition[] = nutrition.filter((n) => n.is_training_day);

    const nonTrainingDayNutrition: Nutrition[] = nutrition.filter((n) => !n.is_training_day);

    const trainingDayNutritionRatio = trainingDayNutrition.map((n) => calculateNutrition(n, bodyComposition[0], selectPlayer.training_load!)).filter((n) => n !== undefined);
    
    const nonTrainingDayNutritionRatio = nonTrainingDayNutrition.map((n) => calculateNutrition(n, bodyComposition[0], selectPlayer.non_training_load!)).filter((n) => n !== undefined);
    //const comment = commentList.find((c) => dayjs(c.date).isSame(dayjs(currentDate), 'day'));

    //const currentIndex = commentList.length - 1 - sheetIndex;

    console.log(trainingDayNutrition);
    console.log(nonTrainingDayNutrition);
    console.log(trainingDayNutritionRatio);
    console.log(nonTrainingDayNutritionRatio);
    console.log(commentList);

    const incrementSheetDateMonth = () => {
        // 現在の月より加算できないようにする
        if (dayjs(currentDate).isBefore(dayjs(SheetSelectedDay).add(1, "M"))) {
            return;
        }
        setSheetSelectedDay(dayjs(SheetSelectedDay).add(1, "M").toDate());
        setSheetIndex(sheetIndex - 1);
    }

    const decrementSheetDateMonth = () => {
        setSheetSelectedDay(dayjs(SheetSelectedDay).subtract(1, "M").toDate());
        setSheetIndex(sheetIndex + 1);
    }

    const handleFileChange = (is_training_day: boolean) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectPlayer) {
            uploadNutrition(selectPlayer.id, currentDate, is_training_day, event);
        }
    };

    const renderNutritionData = (data: Nutrition | null) => {
        if (!data) return <div>データがありません</div>;

        const nutrients = {
            "エネルギー (kcal)": data.energy ?? 0,
            "タンパク質 (g)": data.protein ?? 0,
            "脂質 (g)": data.fat ?? 0,
            "炭水化物 (g)": data.carbohydrate ?? 0,
            "カルシウム (mg)": data.calcium ?? 0,
            "鉄分 (mg)": data.iron ?? 0,
            "亜鉛 (mg)": data.zinc ?? 0,
            "ビタミンA (μg)": data.vitaminA ?? 0,
            "ビタミンD (μg)": data.vitaminD ?? 0,
            "ビタミンE (mg)": data.vitaminE ?? 0,
            "ビタミンK (μg)": data.vitaminK ?? 0,
            "ビタミンB1 (mg)": data.vitaminB1 ?? 0,
            "ビタミンB2 (mg)": data.vitaminB2 ?? 0,
            "ビタミンC (mg)": data.vitaminC ?? 0
        };

        return (
            <div className="grid grid-cols-2 gap-2 p-4">
                {Object.entries(nutrients).map(([name, value]) => (
                    <div key={name} className="flex justify-between border-b border-gray-200 text-small">
                        <span>{name}</span>
                        <span>{typeof value === 'number' ? value.toFixed(1) : '0.0'}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex gap-2">
                <Button onClick={decrementSheetDateMonth} isIconOnly aria-label="MonthDecrement" color="primary" variant="bordered">
                    <FaAngleLeft />
                </Button>
                <Button onClick={incrementSheetDateMonth} isIconOnly aria-label="MonthIncrement" color="primary" variant="bordered">
                    <FaAngleRight />
                </Button>
            </div>
            <Card className="px-4">
                <CardHeader className="flex items-baseline">
                    <span className="text-xl">{dayjs(SheetSelectedDay).format("YYYY")} /</span>
                    <span className="text-3xl font-bold">{dayjs(SheetSelectedDay).format("M")}</span>
                    <span className="pl-1">月の栄養管理シート</span>
                </CardHeader>
                <Divider />
                <div className="py-2">
                    <div className="text-lg">必須栄養素(運動時/非運動時)</div>
                    <Switch isSelected={isGraphMode} onValueChange={setIsGraphMode}>
                        グラフモード
                    </Switch>
                </div>
                <div className="flex flex-row h-[35vh] gap-4 w-full">
                    <div className="w-[50%]">
                        {trainingDayNutritionRatio ? (
                            isGraphMode ?
                                <NutritionGraph graphprops={trainingDayNutritionRatio} /> :
                                renderNutritionData(trainingDayNutrition[-sheetIndex])
                        ) : (
                            <div>データがありません</div>
                        )}
                    </div>
                    <div className="w-[50%]">
                        {nonTrainingDayNutritionRatio ? (
                            isGraphMode ?
                                <NutritionGraph graphprops={nonTrainingDayNutritionRatio} /> :
                                renderNutritionData(nonTrainingDayNutrition[-sheetIndex])
                        ) : (
                            <div>データがありません</div>
                        )}
                    </div>
                </div>{
                    is_admin && (
                        <div className="flex flex-row gap-4">
                            <div className="w-[50%]">
                                {selectPlayer && <Input type="file" onChange={handleFileChange(true)} />}
                            </div>
                            <div className="w-[50%]">
                                {selectPlayer && <Input type="file" onChange={handleFileChange(false)} />}
                            </div>
                        </div>
                    )
                }
                <div className="flex flex-row gap-4">
                    <div className="text-lg">体組成</div>
                    <div className="w-[50%]">
                        <BodyCompositionGraph bodyComposition={bodyComposition} />
                    </div>
                    <div className="flex flex-col gap-2 w-[50%]">
                        <Textarea
                            isReadOnly
                            className="max-w-xs"
                            value={commentList[sheetIndex]?.comment ? commentList[sheetIndex]?.comment : "No comment"}
                            label="コメント"
                            labelPlacement="outside"
                            placeholder="Enter your description"
                            variant="bordered"
                        />
                        {is_admin && (
                            <Button
                                color="primary"
                                variant="bordered"
                                className="w-full"
                                onPress={onEditOpen}
                            >
                                編集
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}