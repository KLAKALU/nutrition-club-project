'use client'

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';

import { PlayerProfile, BodyComposition, Nutrition } from '@/types/types';
import { getPlayerList, getPlayerBodyComposition, getPlayerNutrition } from '@/app/admin/serverActions';
import { setTrainingLoad } from '@/app/admin/clientActions';


import Header  from '@/utils/header/header';
import NutritionCard from '@/components/nutritionCard';
import UserList from '@/utils/userlist/userlist';


export default function Home() {

  const [userData, setUserData] = useState<User>();

  const [selectPlayer, setSelectPlayer] = useState<PlayerProfile | null>(null);

  const [players, setPlayers] = useState<PlayerProfile[]>([]);

  const [bodyComposition, setBodyComposition] = useState<BodyComposition[]>([]);

  const [nutrition, setNutrition] = useState<Nutrition[]>([]);

  const [currentDate, setCurrentDate] = useState<Date>(dayjs().toDate());

  useEffect(() => {
    setCurrentDate(dayjs().toDate())
    const fetchUserData = async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
      }
      setUserData(user);
    }
    fetchUserData();

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
    if (!selectPlayer || !currentDate) {
      return;
    }
    console.log("useEffect2Called")
    const fetchBodyComposition = async () => {
      console.log("fetchBodyComposition")
      try {
        const bodyComposition = await getPlayerBodyComposition(selectPlayer.id, currentDate);
        setBodyComposition(bodyComposition);
      } catch (error) {
        alert("体組成データの取得に失敗しました");
      }
    }
    fetchBodyComposition();

    const fetchNutrition = async () => {
      try {
        console.log("fetchNutrition")
        const nutrition: Nutrition[] = await getPlayerNutrition(selectPlayer.id, currentDate);
        setNutrition(nutrition);
      } catch (error) {
        alert("栄養データの取得に失敗しました");
      }
    }
    fetchNutrition();
  }, [selectPlayer,currentDate]);

  console.log(bodyComposition);

  const handleSelectPlayerChange = (newPlayer: PlayerProfile) => {
    setSelectPlayer(newPlayer);
    const selectedUser = players.find((player) => player.id === newPlayer.id);
    if (!selectedUser?.training_load) {
      const training_load = Number(prompt("トレーニング負荷数値を入力してください"));
      const non_training_load = Number(prompt("非トレーニング負荷数値を入力してください"));
      setTrainingLoad(newPlayer.id, training_load, non_training_load);
      setPlayers(players.map((player) => {
        if (player.id === newPlayer.id) {
          return { ...player, training_load: training_load, non_training_load: non_training_load };
        }
        return player;
      }
      ));
    }
  };
  
  return (
    <div className="">
      <main className="">
        <Header userEmail = {userData?.email}/>
        <div className="flex flex-row">
          <div className='w-[20vw]'>
            <UserList playerList={players} selectPlayerChange={handleSelectPlayerChange} />
          </div>
          {selectPlayer ? <NutritionCard nutrition={nutrition} selectPlayer={selectPlayer} currentDate={currentDate} bodyComposition={bodyComposition} /> : <div>選手を選択してください</div>}
        </div>
      </main>
    </div>
  );
}
