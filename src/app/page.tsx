'use client'

import { use, useEffect, useState } from 'react';

import UserList from '@/utils/userlist/userlist';

import BodyGraph from '@/utils/graph/bodyGraph';
import NutritionGraph from '@/utils/graph/nutritionGraph';

import { graphProps, User,BodyComposition } from '@/types/types';
import { getPlayerList,getPlayerBodyComposition } from '@/app/actions';


export default function Home() {

  const [rootUserId, setRootUserId] = useState<string>();

  const [playerList, setPlayerList] = useState<User[]>([]);

  const [bodyComposition, setBodyComposition] = useState<BodyComposition[]>([]);

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
  }, [rootUserId]);

  console.log(bodyComposition);

  const handleRootUserChange = (newValue: string) => {
    setRootUserId(newValue);
  };

  const graphProps1: graphProps = {
    list1: [9, 5, 18, 7, 21, 7, 7, 14, 9, 12, 4, 7, 15, 2],
    list2: [19, 11, 35, 16, 8, 23, 29, 13, 5, 60, 25, 13, 9, 8],
    list3: [20, 17, 21, 20, 4, 11, 32, 4, 1, 23, 28, 35, 12, 18]
  };
  const graphProps2: graphProps = {
    list1: [16, 16, 16, 13, 11, 43, 27, 23, 32, 29, 341, 13, 32, 5],
    list2: [21, 12, 15, 19, 4, 15, 23, 8, 1, 9, 37, 11, 9, 8],
    list3: [23, 17, 25, 18, 6, 26, 52, 17, 23, 19, 24, 12, 24, 5]
  };



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
                <NutritionGraph graphprops={graphProps1} />
              </div>
              <div className='w-[35vw]'>
                <NutritionGraph graphprops={graphProps2} />
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
