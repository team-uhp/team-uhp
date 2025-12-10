'use server';

import { prisma } from './prisma';

// Toggle bookmark for a user
export async function toggleBookmark(userId: number, projectId: number) {
  if (!userId || !projectId) throw new Error("Missing userId or projectId");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { savedProjects: true },
  });

  if (!user) throw new Error('User not found');

  const alreadySaved = user.savedProjects.some(p => p.id === projectId);

  if (alreadySaved) {
    await prisma.user.update({
      where: { id: userId },
      data: { savedProjects: { disconnect: { id: projectId } } },
    });
    return false; // unsaved
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { savedProjects: { connect: { id: projectId } } },
    });
    return true; // saved
  }
}
