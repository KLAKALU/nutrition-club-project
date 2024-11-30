"use client"
import { Listbox, ListboxItem,} from "@nextui-org/react"
import {Card, CardHeader, CardBody} from "@nextui-org/react"
import { users } from "../../mock/userData"
import { useState } from "react"

interface ChildProps {
    rootUserId: (value: number) => void;
}

export default function UserList({rootUserId}: ChildProps) {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

    const handleUserChange = (newValue: number) => {
        setSelectedUserId(newValue)
        rootUserId(newValue)
    }

    const  TopContent = () => {
        const user = users.find((user) => user.id === selectedUserId)
        return (
            <Card>
                <CardHeader>
                    <div>{user?.name}</div>
                </CardHeader>
                <CardBody>
                    <div>{user?.age}</div>
                    <div>{user?.club}</div>
                </CardBody>
            </Card>
        )
    };

    return (
        <Listbox
        items={users}
        topContent = {<TopContent/>}
        onAction={(key) => handleUserChange(Number(key))}
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