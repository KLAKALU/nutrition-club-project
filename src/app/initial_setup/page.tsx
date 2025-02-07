'use client'

import { saveSettings } from './actions';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

function SubmitButton() {
  return (
    <Button 
      type="submit"
      color="primary"
      size="lg"
      fullWidth
    >
      設定を保存
    </Button>
  );
}

export default function InitialSettingsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">初期設定</h1>
        </CardHeader>
        <CardBody>
          <form className="space-y-4" action={saveSettings}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  label="姓"
                  labelPlacement="outside"
                  required
                  placeholder="龍谷"
                  className="pb-4"
                />
              </div>
              <div>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  label="名"
                  labelPlacement="outside"
                  required
                  placeholder="太郎"
                  className="pb-4"
                />
              </div>
            </div>
            <div>
              <Input
                id="age"
                name="age"
                type="number"
                label="年齢"
                labelPlacement="outside"
                required
                placeholder="18"
                min="1"
                max="100"
                className="pb-4"
              />
            </div>
            <div>
              <Input
                id="club"
                name="club"
                type="text"
                label="所属クラブ"
                labelPlacement="outside"
                required
                placeholder="例：サッカー"
                className="pb-4"
              />
            </div>
            <SubmitButton />
          </form>
        </CardBody>
      </Card>
    </div>
  );
}