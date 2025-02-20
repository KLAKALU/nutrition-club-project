'use client'

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Textarea
} from "@heroui/react";

import { PlayerProfile, BodyComposition, Nutrition, Comment } from '@/types/types';
import { getPlayerList, getPlayerBodyComposition, getPlayerNutrition, getComment } from '@/app/admin/serverActions';
import { setTrainingLoad, uploadComment } from '@/app/admin/clientActions';


import Header from '@/utils/header/header';
import NutritionCard from '@/components/nutritionCard';
import UserList from '@/utils/userlist/userlist';


export default function Home() {

  const [userData, setUserData] = useState<User | undefined>(undefined);

  const [selectPlayer, setSelectPlayer] = useState<PlayerProfile | undefined>(undefined);

  const [players, setPlayers] = useState<PlayerProfile[] | undefined>([]);

  const [bodyComposition, setBodyComposition] = useState<BodyComposition[] | undefined>(undefined);

  const [comment, setComment] = useState<Comment[] | undefined>(undefined);

  const [nutrition, setNutrition] = useState<Nutrition[] | undefined>(undefined);

  const [currentDate, setCurrentDate] = useState<Date>(dayjs().toDate());

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    console.log("useEffect1Called")
    setCurrentDate(dayjs().toDate())
    const fetchUserData = async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
      }
      setUserData(user);
    }

    const fetchPlayerList = async () => {
      try {
        const players = await getPlayerList();
        setPlayers(players);
      } catch (error) {
        alert("選手データの取得に失敗しました");
      }
    };
    Promise.all([fetchUserData(), fetchPlayerList()]);
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
        const bodyComposition = await getPlayerBodyComposition(selectPlayer.id);
        setBodyComposition(bodyComposition);
      } catch (error) {
        alert("体組成データの取得に失敗しました");
      }
    }

    const fetchNutrition = async () => {
      try {
        console.log("fetchNutrition")
        const nutrition: Nutrition[] = await getPlayerNutrition(selectPlayer.id);
        setNutrition(nutrition);
      } catch (error) {
        alert("栄養データの取得に失敗しました");
      }
    }

    const fetchComment = async () => {
      try {
        console.log("fetchComment")
        const comment = await getComment(selectPlayer.id);
        setComment(comment);
      } catch (error) {
        alert("コメントの取得に失敗しました");
      }
    }

    Promise.all([fetchBodyComposition(), fetchNutrition(), fetchComment()]);

  }, [selectPlayer, currentDate]);

  console.log(bodyComposition);

  console.log(nutrition);

  console.log(comment);

  const handleSelectPlayerChange = (newPlayer: PlayerProfile) => {
    if (!players) {
      return;
    }
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
        <Header userEmail={userData?.email} />
        <div className="flex flex-row">
          <div className='w-[20vw]'>
            <UserList playerList={players} selectPlayerChange={handleSelectPlayerChange} />
          </div>
          {selectPlayer ? <NutritionCard nutrition={nutrition} selectPlayer={selectPlayer} currentDate={currentDate} bodyComposition={bodyComposition} commentList={comment} is_admin onEditOpen={onOpen} /> : <div>選手を選択してください</div>}
        </div>
        <div>
          {selectPlayer ?
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
              <DrawerContent>
                {(onClose) => (
                  <>
                    <DrawerHeader className="flex flex-col gap-1">コメント編集</DrawerHeader>
                    <DrawerBody>
                      <Textarea
                        className="max-w-xs"
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        variant="bordered"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                    </DrawerBody>
                    <DrawerFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        閉じる
                      </Button>
                      <Button color="primary" onPress={() => { onClose(); uploadComment(selectPlayer.id, currentDate, editComment); setComment(comment?.map((comment) => { if (comment.date === currentDate) { return { ...comment, comment: editComment }; } return comment; }) ?? []); }}>
                        変更
                      </Button>
                    </DrawerFooter>
                  </>
                )}
              </DrawerContent>
            </Drawer>
            : <div></div>}
        </div>
      </main>
    </div>
  );
}
