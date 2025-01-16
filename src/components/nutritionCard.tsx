'use client'

import { useState } from 'react';
import dayjs from 'dayjs';
import { Input } from "@nextui-org/input";
import { Card, CardHeader, Divider, Button } from "@nextui-org/react"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import { BodyComposition, Nutrition } from '@/types/types';

import { uploadNutrition } from '@/app/admin/clientActions';
import BodyCompositionGraph from '@/utils/graph/bodyCompositionGraph';
import NutritionGraph from '@/utils/graph/nutritionGraph';

type NutritionCardProps = {
    nutrition: Nutrition[];
    rootUserId: string;
    currentDate: Date;
    bodyComposition: BodyComposition[];
}

export default function NutritionCard({ nutrition, rootUserId, currentDate, bodyComposition }: NutritionCardProps) {

    const trainingDayNutrition = nutrition.filter((n) => n.is_training_day);
    const nonTrainingDayNutrition = nutrition.filter((n) => !n.is_training_day);

    const [SheetSelectedDay, setSheetSelectedDay] = useState<Date>();

    const incrementSheetDateMonth = () => {
        // 現在の月より加算できないようにする
        if (dayjs(currentDate).isBefore(dayjs(SheetSelectedDay).add(1, "M"))) {
            return;
        }
        setSheetSelectedDay(dayjs(SheetSelectedDay).add(1, "M").toDate());
    }

    const decrementSheetDateMonth = () => {
        setSheetSelectedDay(dayjs(SheetSelectedDay).subtract(1, "M").toDate());
    }

    const handleFileChange = (is_training_day: boolean) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (rootUserId) {
            uploadNutrition(rootUserId, bodyComposition.slice(-1)[0], is_training_day, event);
        }
    };

    return (
        <div className=''>
            <div>
                <Button onClick={decrementSheetDateMonth} isIconOnly aria-label="MonthDecrement" color="primary" variant="bordered">
                    <FaAngleLeft />
                </Button>
                <Button onClick={incrementSheetDateMonth} isIconOnly aria-label="MonthIncrement" color="primary" variant="bordered">
                    <FaAngleRight />
                </Button>
            </div>
            <Card>
                <CardHeader className=''>
                    <span className="text-3xl font-bold">{dayjs(SheetSelectedDay).format("M")}</span>
                    <span className='pl-1'>月の栄養管理シート</span>
                </CardHeader>
                <Divider />
                <div className=''>必須栄養素</div>
                <div className='flex flex-row h-[35vh]'>
                    <div className="w-[35vw]">
                        {trainingDayNutrition.length ? <NutritionGraph graphprops={trainingDayNutrition} /> : <div>データがありません</div>}
                    </div>
                    <div className='w-[35vw]'>
                        {nonTrainingDayNutrition.length ? <NutritionGraph graphprops={nonTrainingDayNutrition} /> : <div>データがありません</div>}
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='w-[35vw]'>
                        {rootUserId ? <Input type="file" onChange={handleFileChange(true)}></Input> : null}
                    </div>
                    <div className='w-[35vw]'>
                        {rootUserId ? <Input type="file" onChange={handleFileChange(false)}></Input> : null}
                    </div>
                </div>
                <div className=''>体組成</div>
                <div className="w-[35vw]">
                    <BodyCompositionGraph bodyComposition={bodyComposition} />
                </div>
            </Card>
        </div>
    )
}