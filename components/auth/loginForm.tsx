import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';

export function LoginForm() {
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [apiMessageType, setApiMessageType] = useState<'error' | 'success'>(
    'error'
  );

  const formSchema = z.object({
    email: z.string().email({ message: 'Email invalide' }),

    password: z.string().min(4, {
      message: 'Veuillez saisir votre mot de passe',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.get('/api/prisma/users/read/', {
        params: {
          email: values.email,
        },
      });

      const bcrypt = require('bcryptjs');

      const isPasswordMatch: boolean = await bcrypt.compare(
        values.password,
        response.data.password
      );

      if (isPasswordMatch) {
        handleSession(response.data.id);
      } else {
        setApiMessage('Mot de passe incorrect');
        setApiMessageType('error');
      }
    } catch (error) {
      const e = error as AxiosError;
      if (e.response?.status === 404) {
        setApiMessage("Cette adresse email n'existe pas");
        setApiMessageType('error');
      } else {
        setApiMessage('Erreur lors de la connexion: ' + e);
        setApiMessageType('error');
      }
    }
  }

  async function handleSession(id: number) {
    try {
      const response = await axios.patch(
        '/api/prisma/users/regenerate-token/',
        {
          id: id,
        }
      );
      Cookies.set('token', response.data.token, {
        expires: 1,
        secure: true,
        httpOnly: true,
      });
      console.log(Cookies.get('token'));
      Router.push('/');
    } catch (error) {
      setApiMessage('Erreur lors de la connexion: ' + error);
      setApiMessageType('error');
    }
  }

  useEffect(() => {
    if (apiMessage) {
      const messageElement = document.getElementById('apiMessage');
      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  }, [apiMessage]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {apiMessage && (
          <>
            <Alert
              className={
                apiMessageType === 'success' ? 'bg-green-500' : 'bg-red-500'
              }
              id='apiMessage'>
              <AlertTitle className='text-white text-lg'>
                {apiMessageType === 'success'
                  ? 'Succès'
                  : 'Information incorrecte'}
              </AlertTitle>
              <AlertDescription className='text-white'>
                {apiMessage}
              </AlertDescription>
            </Alert>
          </>
        )}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold text-white text-lg'>
                Votre email
              </FormLabel>
              <FormControl>
                <Input placeholder='Email' {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold text-white text-lg'>
                Votre mot de passe
              </FormLabel>
              <FormControl>
                <Input placeholder='Mot de passe' type='password' {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-center'>
          <Button variant={'validate'} className='w-1/3' type='submit'>
            Valider
          </Button>
        </div>
      </form>
    </Form>
  );
}
