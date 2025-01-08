'use client'

import { useEffect, useState } from 'react';

import UserList from '@/utils/userlist/userlist';

import BodyCompositionGraph from '@/utils/graph/bodyCompositionGraph';
import NutritionGraph from '@/utils/graph/nutritionGraph';

import { Input } from "@nextui-org/input";
import {Card, CardHeader, Divider, Button} from "@nextui-org/react"
import dayjs from 'dayjs';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import { User, BodyComposition, Nutrition } from '@/types/types';
import { getPlayerList, getPlayerBodyComposition, getPlayerNutrition } from '@/app/serverActions';
import { uploadNutrition } from '@/app/clientActions';
import { logout } from '@/app/serverActions';


export default function Home() {

  const [rootUserId, setRootUserId] = useState<string>();

  const [playerList, setPlayerList] = useState<User[]>([]);

  const [bodyComposition, setBodyComposition] = useState<BodyComposition[]>([]);

  const [nutritionSheetDay, setNutritionSheetDay] = useState<Date>();

  const [nutrition, setNutrition] = useState<Nutrition[]>([]);

  useEffect(() => {

    //setNutritionSheetDay(dayjs().toDate());

    console.log("useEffect1Called")
    const fetchPlayerList = async () => {
      try {
        const players = await getPlayerList();
        setPlayerList(players);
      } catch (error) {
        alert("選手データの取得に失敗しました");
      }
    };
    fetchPlayerList();
  }, []);
  console.log(playerList);

  useEffect(() => {
    if (!rootUserId || !nutritionSheetDay) {
      return;
    }
    console.log("useEffect2Called")
    const fetchBodyComposition = async () => {
      console.log("fetchBodyComposition")
      try {
        const bodyComposition = await getPlayerBodyComposition(rootUserId, nutritionSheetDay);
        setBodyComposition(bodyComposition);
      } catch (error) {
        alert("体組成データの取得に失敗しました");
      }
    }
    fetchBodyComposition();

    const fetchNutrition = async () => {
      try {
        console.log("fetchNutrition")
        const nutrition: Nutrition[] = await getPlayerNutrition(rootUserId, nutritionSheetDay);
        setNutrition(nutrition);
      } catch (error) {
        alert("栄養データの取得に失敗しました");
      }
    }
    fetchNutrition();
  }, [rootUserId, nutritionSheetDay]);

  console.log(bodyComposition);

  const handleRootUserChange = (newValue: string) => {
    setRootUserId(newValue);
    setNutritionSheetDay(dayjs().toDate());
  };

  const trainingDayNutrition = nutrition.filter((n) => n.is_training_day);
  const nonTrainingDayNutrition = nutrition.filter((n) => !n.is_training_day);
  const handleFileChange = (is_training_day: boolean) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (rootUserId) {
      uploadNutrition(rootUserId, bodyComposition.slice(-1)[0], is_training_day, event);
    }
  };

  const incrementSheetDateMonth = () => {
    // 現在の月より加算できないようにする
    if (dayjs().isBefore(dayjs(nutritionSheetDay).add(1, "M"))) {
      return;
    }
    setNutritionSheetDay(dayjs(nutritionSheetDay).add(1, "M").toDate());
  }

  const decrementSheetDateMonth = () => {
    setNutritionSheetDay(dayjs(nutritionSheetDay).subtract(1, "M").toDate());
  }

  return (
    <div className="">
      <main className="">
      <form onSubmit={logout}>
            <Button type="submit">
                Log out
            </Button>
        </form>
        <div className="flex flex-row">
          <div className='w-[20vw]'>
            <UserList playerList={playerList} rootUserIdChange={handleRootUserChange} />
          </div>
          <Button onClick={decrementSheetDateMonth} isIconOnly aria-label="MonthDecrement" color="primary" variant="bordered">
            <FaAngleLeft />
          </Button>
          <Button onClick={incrementSheetDateMonth} isIconOnly aria-label="MonthIncrement" color="primary" variant="bordered">
            <FaAngleRight />
          </Button>
          <Card>
            <CardHeader className=''>
              <span className="text-3xl font-bold">{dayjs(nutritionSheetDay).format("M")}</span>
              <span className='pl-1'>月の栄養管理シート</span>
            </CardHeader>
            <Divider />
            <div className=''>必須栄養素</div>
            <div className='flex flex-row h-[40vh]'>
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
      </main>
    </div>
  );
}
