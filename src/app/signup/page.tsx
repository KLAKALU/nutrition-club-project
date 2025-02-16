'use client'

import { signup } from './actions';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FaEnvelope } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
// import { useFormStatus } from 'react-dom';

function SubmitButton() {
  //const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      color="primary"
      size="lg"
      //isLoading={pending}
      fullWidth
    >
      登録
    </Button>
  );
}

export default function signupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">登録</h1>
        </CardHeader>
        <CardBody>
          <form className="space-y-4" action={signup}>
            <div className="">
              <Input
                id="email"
                name="email"
                type="email"
                label="メールアドレス"
                labelPlacement='outside'
                autoComplete="email"
                required
                placeholder="your@email.com"
                startContent={<FaEnvelope />}
                className='pb-4'
              />
            </div>

            <div className="">
              <Input
                id="password"
                name="password"
                type="password"
                label="パスワード"
                labelPlacement='outside'
                autoComplete="current-password"
                required
                placeholder="••••••••"
                startContent={<FaLock />}
              />
            </div>
            <SubmitButton />
          </form>
        </CardBody>
      </Card>
    </div>
  );
}