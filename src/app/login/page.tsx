'use client'

import { login } from './actions';
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
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
      ログイン
    </Button>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">ログイン</h1>
        </CardHeader>
        <CardBody>
          <form className="space-y-4" action={login}>
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