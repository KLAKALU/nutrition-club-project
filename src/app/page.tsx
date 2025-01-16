'use client'

import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';

import { BodyComposition, Nutrition } from '@/types/types';
import { getPlayerBodyComposition, getPlayerNutrition } from '@/app/admin/serverActions';

import AdminHeader  from '@/utils/header/header';
import NutritionCard from '@/components/nutritionCard';

export default function Home() {

  const [userId, setUserId] = useState<string>();

  const [bodyComposition, setBodyComposition] = useState<BodyComposition[]>([]);

  const [nutrition, setNutrition] = useState<Nutrition[]>([]);

  const [userEmail, setUserEmail] = useState<string>("");

  const currentDate = dayjs().toDate();

  const validateInitialSetup = async () => {
    const supabase = await createClient();
    const {data:{ user }} = await supabase.auth.getUser();
    if (!user) {
      redirect('/login');
    }
    const { data: playerProfileData, error: playerProfileError } = await supabase.from('player_profiles').select().eq('id', user.id);

    if (playerProfileError) {
      redirect('/error')
    }
    if (playerProfileData && playerProfileData.length > 0) {
      const playerProfile = playerProfileData[0]
      if (!playerProfile.is_initial_setup_done) {
        redirect('/initial_setup')
      }
    }
  }
  validateInitialSetup();

  useEffect(() => {
    //setNutritionSheetDay(dayjs().toDate());

    const fetchUserData = async () => {
      const supabase = await createClient();
      const {data:{ user }} = await supabase.auth.getUser();
      if (!user || !user.email) {
        redirect('/login');
      }
      setUserId(user.id);
      setUserEmail(user.email);
    }
    fetchUserData();

    console.log("useEffect1Called")
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    console.log("useEffect2Called")
    const fetchBodyComposition = async () => {
      console.log("fetchBodyComposition")
      try {
        const bodyComposition = await getPlayerBodyComposition(userId, currentDate);
        setBodyComposition(bodyComposition);
      } catch (error) {
        alert("体組成データの取得に失敗しました");
      }
    }
    fetchBodyComposition();

    const fetchNutrition = async () => {
      try {
        console.log("fetchNutrition")
        const nutrition: Nutrition[] = await getPlayerNutrition(userId, currentDate);
        setNutrition(nutrition);
      } catch (error) {
        alert("栄養データの取得に失敗しました");
      }
    }
    fetchNutrition();
  }, [userId]);

  console.log(bodyComposition);
  
  return (
    <div className="">
      <main className="">
        <AdminHeader userEmail = {userEmail}/>
        <div className="">
          {userId ? <NutritionCard nutrition={nutrition} rootUserId={userId} currentDate={currentDate} bodyComposition={bodyComposition} /> : <div>選手を選択してください</div>}
        </div>
      </main>
    </div>
  );
}