'use server';

import { prisma } from './prisma';

export async function toggleContact(currentUserId: number, profileId: number) {
  const user = await prisma.user.findUnique({
    where: { id: currentUserId },
    include: { contacts: true },
  });

  const alreadyContact = user?.contacts.some(c => c.id === profileId);

  if (alreadyContact) {
    await prisma.user.update({
      where: { id: currentUserId },
      data: { contacts: { disconnect: { id: profileId } } },
    });
    return false;
  } else {
    await prisma.user.update({
      where: { id: currentUserId },
      data: { contacts: { connect: { id: profileId } } },
    });
    return true;
  }
}
