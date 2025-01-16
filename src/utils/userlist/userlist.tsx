"use client"
import { Listbox, ListboxItem,} from "@nextui-org/react"
import {Card, CardHeader, CardBody} from "@nextui-org/react"
import { PlayerProfile } from "@/types/types"
import { useState } from "react"

interface ChildProps {
    rootUserIdChange: (value: string) => void;
    playerList: PlayerProfile[];
}

export default function UserList({ rootUserIdChange, playerList }: ChildProps) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    const handleUserChange = (newValue: string) => {
        setSelectedUserId(newValue)
        rootUserIdChange(newValue)
    }

    const  TopContent = () => {
        const user = playerList.find((user) => user.id === selectedUserId)
        console.log(user ? user.last_name : "No user selected")
        if (!user) {
            return (
                <Card>
                    <CardHeader>
                        <div>選手を選択してください</div>
                    </CardHeader>
                </Card>
            )
        }
        return (
            <Card>
                <CardHeader>
                    <div>{user.last_name + "　" + user.first_name}</div>
                </CardHeader>
                <CardBody>
                    <div>{user.club}</div>
                </CardBody>
            </Card>
        )
    };

    return (
        <Listbox
        items={playerList}
        topContent = {<TopContent/>}
        onAction={(key) => handleUserChange(String(key))}
        >
            {(item) => (
                <ListboxItem key={item.id} textValue={item.last_name + "　" + item.first_name}>
                    <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                            <span className="text-2xl">{item.last_name + "　" + item.first_name}</span>
                        </div>
                    </div>
                </ListboxItem>
        )}
        </Listbox>
    )
}