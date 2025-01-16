'use client'

import { useEffect, useState } from 'react';

import UserList from '@/utils/userlist/userlist';

import dayjs from 'dayjs';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';

import { PlayerProfile, BodyComposition, Nutrition } from '@/types/types';
import { getPlayerList, getPlayerBodyComposition, getPlayerNutrition } from '@/app/admin/serverActions';

import  AdminHeader  from '@/utils/header/header';
import NutritionCard from '@/components/nutritionCard';

export default function Home() {

  const [rootUserId, setRootUserId] = useState<string>();

  const [players, setPlayers] = useState<PlayerProfile[]>([]);

  const [bodyComposition, setBodyComposition] = useState<BodyComposition[]>([]);

  const [nutrition, setNutrition] = useState<Nutrition[]>([]);

  const [userEmail, setUserEmail] = useState<string>("");

  const currentDate = dayjs().toDate();

  useEffect(() => {

    //setNutritionSheetDay(dayjs().toDate());

    const fetchUserEmail = async () => {
      const supabase = await createClient();
      const {data:{ user }} = await supabase.auth.getUser();
      if (!user || !user.email) {
        redirect('/login');
      }
      setUserEmail(user.email);
    }
    fetchUserEmail();

    console.log("useEffect1Called")
    const fetchPlayerList = async () => {
      try {
        const players = await getPlayerList();
        setPlayers(players);
      } catch (error) {
        alert("選手データの取得に失敗しました");
      }
    };
    fetchPlayerList();
  }, []);
  console.log(players);

  useEffect(() => {
    if (!rootUserId) {
      return;
    }
    console.log("useEffect2Called")
    const fetchBodyComposition = async () => {
      console.log("fetchBodyComposition")
      try {
        const bodyComposition = await getPlayerBodyComposition(rootUserId, currentDate);
        setBodyComposition(bodyComposition);
      } catch (error) {
        alert("体組成データの取得に失敗しました");
      }
    }
    fetchBodyComposition();

    const fetchNutrition = async () => {
      try {
        console.log("fetchNutrition")
        const nutrition: Nutrition[] = await getPlayerNutrition(rootUserId, currentDate);
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
    //setNutritionSheetDay(dayjs().toDate());
  };
  
  return (
    <div className="">
      <main className="">
        <AdminHeader userEmail = {userEmail}/>
        <div className="flex flex-row">
          <div className='w-[20vw]'>
            <UserList playerList={players} rootUserIdChange={handleRootUserChange} />
          </div>
          {rootUserId ? <NutritionCard nutrition={nutrition} rootUserId={rootUserId} currentDate={currentDate} bodyComposition={bodyComposition} /> : <div>選手を選択してください</div>}
        </div>
      </main>
    </div>
  );
}
