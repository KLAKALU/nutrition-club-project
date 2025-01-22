'use client'

import { login } from './actions';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FaEnvelope } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import Link from "next/link";
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
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">アカウントをお持ちでない方は</span>{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              新規登録
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}