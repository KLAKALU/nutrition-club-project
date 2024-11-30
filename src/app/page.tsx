'use client'

import { useState } from 'react';

import UserList from '../utils/userlist/userlist';

export default function Home() {

  const [rootUserId, setRootUserId] = useState<number>();

  const handleRootUserChange = (newValue: number) => {
    setRootUserId(newValue);
  };

  return (
    <div className="">
      <main className="">
        <div className="flex flex-row">
          <div>
            <UserList rootUserId = {handleRootUserChange} /> 
          </div>
        </div>
      </main>
    </div>
  );
}
