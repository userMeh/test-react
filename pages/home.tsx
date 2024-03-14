import { prisma } from '@/lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import '@/app/globals.css';

type userProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export const getServerSideProps: GetServerSideProps = async () => {
  const user = await prisma.user.findFirst({
    where: {
      email: 'test@gmail.com',
    },
  });
  return {
    props: {
      user,
    },
  };
};

export default function Home({ user }: userProps) {
  return (
    <div>
      Hello {user?.firstName} {user?.lastName}
    </div>
  );
}
