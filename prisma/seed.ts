import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: 'test@gmail.com',
    },
    update: {},
    create: {
      id: 1,
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      denomination: 'Test Enterprise',
      ape: '12345A',
      phoneNumber: '1234567890',
      profileType: 0,
      password:
        '95c1600d47cbb9c946bf76db69014e6420f53c60c2cb93c357832e430f99ded879ca00cbfca2c4bd9e8840767c70b67e092f61928e1b0443c6c43bb58de9dc4c',
    },
  });
  console.log({ user });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
