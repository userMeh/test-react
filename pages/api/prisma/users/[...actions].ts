import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

type UserData = {
  email: string;
  denomination?: string;
  ape?: string;
  firstName?: string;
  lastName?: string;
  password: string;
  phoneNumber: string;
  profileType: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const actions = Array.isArray(req.query.actions) ? req.query.actions : [];
  const [action, ...params] = actions;

  switch (action) {
    // GET
    case 'read':
      if (req.method !== 'GET') {
        res.status(405).json({ message: 'Methode non autorisée' });
        return;
      }

      await readUser(req, res);
      break;

    // POST
    case 'create':
      if (req.method !== 'POST') {
        res.status(405).json({ message: 'Méthode non autorisée' });
        return;
      }

      await createUser(req, res);
      break;

    // PATCH
    case 'regenerate-token':
      if (req.method !== 'PATCH') {
        res.status(405).json({ message: 'Méthode non autorisée' });
        return;
      }

      await regenerateUserToken(req, res);
      break;

    // ERROR
    default:
      res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

// METHODS

async function readUser(req: NextApiRequest, res: NextApiResponse) {
  const email: string = req.query.email as string;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    res.status(404).json({ message: 'Utilisateur non trouvé' });
    return;
  }

  res.status(200).json(user);
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const data: UserData = req.body;

  const userExists = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (userExists) {
    return res.status(422).json({ message: 'Utilisateur déjà existant' });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        denomination: data.profileType === 1 ? data.denomination : null,
        ape: data.profileType === 1 ? data.ape : null,
        firstName: data.profileType === 0 ? data.firstName : null,
        lastName: data.profileType === 0 ? data.lastName : null,
        password: data.password,
        phoneNumber: data.phoneNumber,
        profileType: data.profileType,
      },
    });
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(500).json({
      message:
        "Erreur lors de la création de l'utilisateur: \n" + error.message,
    });
  }
}

async function regenerateUserToken(req: NextApiRequest, res: NextApiResponse) {
  const id: number = req.body.id;

  const userExists = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  if (!userExists) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      token: uuid(),
    },
  });

  res.status(200).json({ token: user.token });
}
