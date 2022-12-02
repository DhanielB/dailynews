import { PrismaClient } from "@prisma/client";
import formatText from "../hooks/formatText";

interface IAuth {
  name: string;
  email: string;
}

export default async function editRoleUser({
  name,
  email,
  role
}: {
  name: string;
  email: string;
  role: string;
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const news = await prisma.users.update({
    where: {
      name: name,
      email: email,
    },
    data: {
      role: role
    }
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    data: news,
  };
}
