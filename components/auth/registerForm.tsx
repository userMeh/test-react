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

export function RegisterForm() {
  const [profileStatus, setProfileStatus] = useState(0);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [apiMessageType, setApiMessageType] = useState<'error' | 'success'>(
    'error'
  );

  const formSchema = z
    .object({
      email: z.string().email({ message: 'Email invalide' }),

      ape:
        profileStatus === 1
          ? z
              .string()
              .min(5)
              .max(5)
              .regex(/^[0-9]{4}[A-Z]$/, { message: 'Code APE invalide' })
          : z.string().optional(),

      denomination:
        profileStatus === 1
          ? z.string().min(2, {
              message: 'La dénomination doit avoir au moins 2 caractères',
            })
          : z.string().optional(),

      firstName:
        profileStatus === 0
          ? z
              .string()
              .min(2, { message: 'Le nom doit faire au moins 2 caractères' })
          : z.string().optional(),

      lastName:
        profileStatus === 0
          ? z
              .string()
              .min(2, { message: 'Le prénom doit faire au moins 2 caractères' })
          : z.string().optional(),

      phoneNumber: z
        .string()
        .min(10, { message: 'Numéro de téléphone invalide' })
        .max(10, { message: 'Numéro de téléphone invalide' })
        .regex(/^[0-9]{10}$/, { message: 'Numéro de téléphone invalide' }),

      password: z.string().min(4, {
        message: 'Le mot de passe doit faire au moins 4 caractères',
      }),

      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      ape: '',
      denomination: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const bcrypt = require('bcryptjs');

  async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      values.password = await hashPassword(values.password);
      // const response = await axios.get('/api/prisma/users/read/', {
      //   params: {
      //     email: values.email,
      //   },
      // });

      const response = await axios.post('/api/prisma/users/create', {
        ...values,
        profileType: profileStatus,
      });

      console.log(response);

      if (response.status === 201) {
        setApiMessage('Votre profil a bien été créé');
        setApiMessageType('success');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 422) {
          setApiMessage('Un utilisateur avec cet email existe déjà');
          setApiMessageType('error');
          return;
        } else if (axiosError.response?.status === 405) {
          setApiMessage('Méthode non autorisée');
          setApiMessageType('error');
          return;
        }
      }
      setApiMessage('Erreur lors de la création du compte: \n' + error);
      setApiMessageType('error');
    }
  }

  function handleStatusChange(status: number) {
    form.reset();
    setProfileStatus(status);
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
                {apiMessageType === 'success' ? 'Succès' : 'Erreur'}
              </AlertTitle>
              <AlertDescription className='text-white'>
                {apiMessage}
              </AlertDescription>
            </Alert>
          </>
        )}
        <div className='mb-10 flex justify-center space-x-5'>
          <Button
            variant={profileStatus === 0 ? 'default' : 'outline'}
            className={'w-full'}
            onClick={(event) => {
              event.preventDefault();
              handleStatusChange(0);
            }}>
            Particulier
          </Button>
          <Button
            variant={profileStatus === 1 ? 'default' : 'outline'}
            className={'w-full'}
            onClick={(event) => {
              event.preventDefault();
              handleStatusChange(1);
            }}>
            Professionnel
          </Button>
        </div>
        {profileStatus === 0 && (
          <>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-white text-lg'>
                    Votre prénom
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Prénom' {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-white text-lg'>
                    Votre nom
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Nom' {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {profileStatus === 1 && (
          <>
            <FormField
              control={form.control}
              name='denomination'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-white text-lg'>
                    Votre dénomination
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Dénomination' {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ape'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-white text-lg'>
                    Votre code APE
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Code APE' {...field} />
                  </FormControl>
                  <FormDescription className='text-gray-300 text-sm'>
                    Exemple: 1234Z
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold text-white text-lg'>
                Votre numéro de téléphone
              </FormLabel>
              <FormControl>
                <Input placeholder='Numéro de téléphone' {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold text-white text-lg'>
                Confirmation du mot de passe
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Confirmation du mot de passe'
                  type='password'
                  {...field}
                />
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
