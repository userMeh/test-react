'use client';

import { LoginForm } from '@/components/auth/loginForm';
import '@/app/globals.css';

export default function Login() {
  return (
    <div className='flex flex-row justify-center'>
      <div className='md:w-1/2 sm:w-full'>
        <div className='my-12 p-12 bg-blue-900 rounded-lg'>
          <div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
