"use client"
import { Listbox, ListboxItem } from "@nextui-org/react"
import {Card, CardHeader, CardBody} from "@nextui-org/react"
import { PlayerProfile } from "@/types/types"
import { useState } from "react"

interface ChildProps {
    selectPlayerChange: (value: PlayerProfile) => void;
    playerList: PlayerProfile[];
}

export default function UserList({ selectPlayerChange, playerList }: ChildProps) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    const handleUserChange = (selectPlayerId: string) => {
        setSelectedUserId(selectPlayerId)
        const selectUser = playerList.find((user) => user.id === selectPlayerId)
        if (!selectUser) {
            return
        }
        selectPlayerChange(selectUser)
    }

    const  TopContent = () => {
        const player = playerList.find((player) => player.id === selectedUserId)
        console.log(player ? player.last_name : "No Player selected")
        if (!player) {
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
                    <div className="text-3xl font-bold">{player.last_name + "　" + player.first_name}</div>
                </CardHeader>
                <CardBody>
                    <div>{player.club}</div>
                    <div className="text-small">運動負荷数値:{player.training_load}</div>
                    <div className="text-small">非運動負荷数値:{player.non_training_load}</div>
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