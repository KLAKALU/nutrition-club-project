'use client'

import { use, useEffect, useState } from 'react';

import UserList from '@/utils/userlist/userlist';

import BodyGraph from '@/utils/graph/bodyGraph';
import NutritionGraph from '@/utils/graph/nutritionGraph';

import { User,BodyComposition, Nutrition } from '@/types/types';
import { getPlayerList,getPlayerBodyComposition, getPlayerNutrition } from '@/app/actions';


export default function Home() {

  const [rootUserId, setRootUserId] = useState<string>();

  const [playerList, setPlayerList] = useState<User[]>([]);

  const [bodyComposition, setBodyComposition] = useState<BodyComposition[]>([]);

  const [nutrition, setNutrition] = useState<Nutrition[]>([]);

  useEffect(() => {
    console.log("fetchPlayerList")
    const fetchPlayerList = async () => {
      try {
        const players = await getPlayerList();
        setPlayerList(players);
      } catch (error) {
      }
    };
    fetchPlayerList();
  }, []);
  console.log(playerList);

  useEffect(() => {
    const fetchBodyComposition = async () => {
      console.log("fetchBodyComposition")
      try {
        if (rootUserId) {
          const bodyComposition = await getPlayerBodyComposition(rootUserId);
          setBodyComposition(bodyComposition);
        }
      } catch (error) {
      }
    }
    fetchBodyComposition();

    const fetchNutrition = async () => {
      try {
        if (rootUserId) {
          console.log("fetchNutrition")
          const nutrition:Nutrition[] = await getPlayerNutrition(rootUserId, new Date());
          if (nutrition) {
            setNutrition(nutrition);
          }

        }
      } catch (error) {
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

  return (
    <div className="">
      <main className="">
        <div className="flex flex-row">
          <div className='w-[20vw]'>
            <UserList playerList = {playerList} rootUserIdChange={handleRootUserChange} />
          </div>
          <div>
            <div className='w-hull bg-gray-200'>今月の選手データ</div>
            <div className='w-hull bg-gray-200'>必須栄養素</div>
            <div className='flex flex-row h-[40vh]'>
              <div className="w-[35vw]">
                <NutritionGraph graphprops={trainingDayNutrition} />
              </div>
              <div className='w-[35vw]'>
                <NutritionGraph graphprops={nonTrainingDayNutrition} />
              </div>
            </div>
            <div className='w-hull bg-gray-200'>体組成</div>
            <div className="w-[35vw]">
              <BodyGraph bodyComposition = {bodyComposition}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
