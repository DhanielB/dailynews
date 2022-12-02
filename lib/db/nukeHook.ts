import { PrismaClient } from "@prisma/client";
import formatText from "../hooks/formatText";

interface IAuth {
  name: string;
  email: string;
}

export default async function nukeHook({
  name,
  email,
  nuked
}: {
  name: string;
  email: string;
  nuked: boolean;
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const news = await prisma.users.update({
    where: {
      name: name,
      email: email,
    },
    data: {
      nuked: nuked
    }
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    data: news,
  };
}
