'use client'

import { signup } from './actions';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FaEnvelope, FaLock, FaUserShield } from "react-icons/fa6";
import { useState } from 'react';

function SubmitButton({ isDisabled }: { isDisabled: boolean }) {
  return (
    <Button 
      type="submit" 
      color="primary" 
      size="lg" 
      fullWidth
      isDisabled={isDisabled}
    >
      登録
    </Button>
  );
}

export default function SignupPage() {
  const [formError, setFormError] = useState<string>('');
  
  const handleSubmit = async (formData: FormData) => {
    setFormError('');
    
    try {
      await signup(formData);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('登録中にエラーが発生しました');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">管理者として登録</h1>
        </CardHeader>
        <CardBody>
          <form className="space-y-4" action={handleSubmit}>
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                label="メールアドレス"
                labelPlacement="outside"
                autoComplete="email"
                required
                placeholder="your@email.com"
                startContent={<FaEnvelope />}
                className="pb-4"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                label="パスワード"
                labelPlacement="outside"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                startContent={<FaLock />}
              />
            </div>
            <div>
              <Input
                id="adminPassword"
                name="adminPassword"
                type="password"
                label="管理者パスワード"
                labelPlacement="outside"
                required
                placeholder="管理者パスワードを入力"
                startContent={<FaUserShield />}
              />
            </div>
            {formError && (
              <div className="text-red-500 text-sm">{formError}</div>
            )}
            <SubmitButton isDisabled={!!formError} />
          </form>
        </CardBody>
      </Card>
    </div>
  );
}