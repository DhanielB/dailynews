import { PrismaClient } from "@prisma/client";
import filterObject from "../../aflito/lib/filterObject";

export default async function findContact({
  name,
  email,
}: {
  name?: string;
  email?: string;
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const users = await prisma.users.findMany({
    where: filterObject({
      name: name,
      email: email,
      createdAt: Date.now(),
    }),
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    data: users,
  };
}
