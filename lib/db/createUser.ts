import { PrismaClient } from "@prisma/client";

export default async function createUser({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const user = await prisma.users.create({
    data: {
      name: name,
      email: email,
      nuked: false,
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
