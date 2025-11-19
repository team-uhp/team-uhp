import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

async function keyGen(length: number = 8): Promise<string> {
  let token;
  do {
    token = crypto.randomBytes(Math.ceil((length * 3) / 4))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .slice(0, length);
  // eslint-disable-next-line no-await-in-loop
  } while (await prisma.user.findFirst({ where: { validcheck: token } }));

  return token;
}

export default keyGen;
