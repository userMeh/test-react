'use client';

import { RegisterForm } from '@/components/auth/registerForm';
import '@/app/globals.css';

export default function Register() {
  return (
    <div className='flex flex-row justify-center'>
      <div className='md:w-1/2 sm:w-full'>
        <div className='my-12 p-12 bg-blue-900 rounded-lg'>
          <div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
