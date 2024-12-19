'use client'

import { useEffect, useState } from 'react';

import UserList from '@/utils/userlist/userlist';

import BodyCompositionGraph from '@/utils/graph/bodyCompositionGraph';
import NutritionGraph from '@/utils/graph/nutritionGraph';

import { Input } from "@nextui-org/input";

import { User, BodyComposition, Nutrition } from '@/types/types';
import { getPlayerList, getPlayerBodyComposition, getPlayerNutrition } from '@/app/serverActions';
import { uploadNutrition } from '@/app/clientActions';


export default function Home() {

  const [rootUserId, setRootUserId] = useState<string>();

  const [playerList, setPlayerList] = useState<User[]>([]);

  const [bodyComposition, setBodyComposition] = useState<BodyComposition[]>([]);

  const [nutrition, setNutrition] = useState<Nutrition[]>([]);

  useEffect(() => {
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
    if (!rootUserId) {
      return;
    }
    console.log("useEffect2Called")
    const fetchBodyComposition = async () => {
      console.log("fetchBodyComposition")
      try {
        const bodyComposition = await getPlayerBodyComposition(rootUserId);
        setBodyComposition(bodyComposition);
      } catch (error) {
        alert("体組成データの取得に失敗しました");
      }
    }
    fetchBodyComposition();

    const fetchNutrition = async () => {
      try {
        console.log("fetchNutrition")
        const nutrition: Nutrition[] = await getPlayerNutrition(rootUserId, new Date());
        setNutrition(nutrition);
      } catch (error) {
        alert("栄養データの取得に失敗しました");
      }
    }
    fetchNutrition();
  }, [rootUserId]);

  console.log(bodyComposition);

  const handleRootUserChange = (newValue: string) => {
    setRootUserId(newValue);
  };

  const trainingDayNutrition = nutrition.filter((n) => n.is_training_day);
  const nonTrainingDayNutrition = nutrition.filter((n) => !n.is_training_day);
  const handleFileChange = (is_training_day: boolean) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (rootUserId) {
      uploadNutrition(rootUserId, bodyComposition.slice(-1)[0], is_training_day, event);
    }
  };

  return (
    <div className="">
      <main className="">
        <div className="flex flex-row">
          <div className='w-[20vw]'>
            <UserList playerList={playerList} rootUserIdChange={handleRootUserChange} />
          </div>
          <div>
            <div className='w-hull bg-gray-200'>今月の選手データ</div>
            <div className='w-hull bg-gray-200'>必須栄養素</div>
            <div className='flex flex-row h-[40vh]'>
              <div className="w-[35vw]">
                {trainingDayNutrition.length ? <NutritionGraph graphprops={trainingDayNutrition} /> : <div>データがありません</div>}
                <NutritionGraph graphprops={trainingDayNutrition} />
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
            <div className='w-hull bg-gray-200'>体組成</div>
            <div className="w-[35vw]">
              <BodyCompositionGraph bodyComposition={bodyComposition} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
