import { PrismaClient } from "@prisma/client";
import filterObject from "../hooks/filterObject";

export default async function findUser({
  name,
  email,
  nuked,
  page,
  limit
}: {
  name?: string;
  email?: string;
  nuked?: boolean;
  page: number;
  limit: number;
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const users = await prisma.users.findMany({
    //@ts-ignore
    where: filterObject({
      name: name,
      email: email,
      nuked: nuked
    }),
    skip: (page * limit),
    take: limit
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    count: users.length,
    data: users,
  };
}
