'use client'

import { useState } from 'react';

import UserList from '@/utils/userlist/userlist';

import  BodyGraph  from '@/utils/graph/bodyGraph';

export default function Home() {

  const [rootUserId, setRootUserId] = useState<number>();

  const handleRootUserChange = (newValue: number) => {
    setRootUserId(newValue);
  };

  return (
    <div className="">
      <main className="">
        <div className="flex flex-row">
          <div className='w-[20vw]'>
            <UserList rootUserIdChange = {handleRootUserChange} /> 
          </div>
          <div className="h-screen w-[40vw]">
            <BodyGraph/>
          </div>
        </div>
      </main>
    </div>
  );
}
