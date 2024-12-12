"use client"
import { Listbox, ListboxItem,} from "@nextui-org/react"
import {Card, CardHeader, CardBody} from "@nextui-org/react"
import { User } from "../../types/types"
import { useState } from "react"

interface ChildProps {
    rootUserIdChange: (value: string) => void;
    playerList: User[];
}

export default function UserList({ rootUserIdChange, playerList }: ChildProps) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    const handleUserChange = (newValue: string) => {
        setSelectedUserId(newValue)
        rootUserIdChange(newValue)
    }

    const  TopContent = () => {
        const user = playerList.find((user) => user.id === selectedUserId)
        console.log(user ? user.name : "No user selected")
        return (
            <Card>
                <CardHeader>
                    <div>{user?.name}</div>
                </CardHeader>
                <CardBody>
                    <div>{user?.club}</div>
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
                <ListboxItem key={item.id} textValue={item.name}>
                    <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                            <span className="text-2xl">{item.name}</span>
                        </div>
                    </div>
                </ListboxItem>
        )}
        </Listbox>
    )
}