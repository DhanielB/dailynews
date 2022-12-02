import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function createUser({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const user = await prisma.users.create({
    data: {
      name: name,
      email: email,
      nuked: false,
      role: 'USER',
      createdAt: Date.now(),
    },
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    data: user,
  };
}
