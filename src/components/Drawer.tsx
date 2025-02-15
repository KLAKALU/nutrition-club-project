import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Textarea } from "@heroui/react";
import { uploadBodyComposition } from '@/app/admin/clientActions';
import { useState } from 'react';

type DrawerProps = {
  userID: string;
  currentDate: Date
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function PlayerDrawer({ userID, currentDate, isOpen, onOpenChange }: DrawerProps) {

  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');

  return (

    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">体組成入力</DrawerHeader>
            <DrawerBody>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    体重 (kg)
                  </label>
                  <Textarea
                    className="max-w-xs"
                    labelPlacement="outside"
                    placeholder="75.0"
                    variant="bordered"
                    description="現在の体重を入力してください"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    体脂肪率 (%)
                  </label>
                  <Textarea
                    className="max-w-xs"
                    labelPlacement="outside"
                    placeholder="20.0"
                    variant="bordered"
                    description="体脂肪率を入力してください"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    筋肉量 (kg)
                  </label>
                  <Textarea
                    className="max-w-xs"
                    labelPlacement="outside"
                    placeholder="60.0"
                    variant="bordered"
                    description="筋肉量を入力してください"
                    value={muscleMass}
                    onChange={(e) => setMuscleMass(e.target.value)}
                  />
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                閉じる
              </Button>
              <Button color="primary" onPress={() => { onClose(); uploadBodyComposition(userID, currentDate, weight, bodyFat, muscleMass); }}>
                保存
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}