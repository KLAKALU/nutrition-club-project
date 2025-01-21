'use client'

import dayjs from 'dayjs';
import { use, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';

import { BodyComposition, Nutrition, PlayerProfile } from '@/types/types';
import { getPlayerBodyComposition, getPlayerNutrition } from '@/app/admin/serverActions';

import Header from '@/utils/header/header';
import NutritionCard from '@/components/nutritionCard';


export default function Home() {

  const [userData, setUserData] = useState<User>();

  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>();

  const [bodyComposition, setBodyComposition] = useState<BodyComposition[]>([]);

  const [nutrition, setNutrition] = useState<Nutrition[]>([]);

  const currentDate = dayjs().toDate();

  const validateInitialSetupIsDone = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      redirect('/login');
    }
    setUserData(user);
    const { data: playerProfileData, error: playerProfileError } = await supabase.from('player_profiles').select().eq('id', user.id);

    if (playerProfileError || !playerProfileData) {
      redirect('/error')
    }
      const playerProfile = playerProfileData[0]
      if (!playerProfile.is_initial_setup_done) {
        redirect('/initial_setup')
      }
    setPlayerProfile(playerProfileData[0]);
  }
  validateInitialSetupIsDone();

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
      }
      const { data: playerProfileData, error: playerProfileError } = await supabase.from('player_profiles').select().eq('id', user.id);
      if (playerProfileError || !playerProfileData) {
        return;
      }
      setUserData(playerProfileData[0]);
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) {
      return;
    }
    const fetchBodyComposition = async () => {
      console.log("fetchBodyComposition")
      try {
        const bodyComposition = await getPlayerBodyComposition(userData.id, currentDate);
        setBodyComposition(bodyComposition);
      } catch (error) {
        alert("体組成データの取得に失敗しました");
      }
    }
    fetchBodyComposition();

    const fetchNutrition = async () => {
      try {
        console.log("fetchNutrition")
        const nutrition: Nutrition[] = await getPlayerNutrition(userData.id, currentDate);
        setNutrition(nutrition);
      } catch (error) {
        alert("栄養データの取得に失敗しました");
      }
    }
    fetchNutrition();
  }, [userData, currentDate]);

  console.log(bodyComposition);

  return (
    <div className="">
      <main className="">
        <Header userEmail={userData?.email} />
        <div className="">
          {playerProfile ? <NutritionCard nutrition={nutrition} selectPlayer={playerProfile} currentDate={currentDate} bodyComposition={bodyComposition} /> : <div>選手情報の取得に失敗しました</div>}
        </div>
      </main>
    </div>
  );
}