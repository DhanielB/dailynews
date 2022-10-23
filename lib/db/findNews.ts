import { PrismaClient } from "@prisma/client";
import filterObject from "../../lib/filterObject";

export default async function findUser({
  title,
  commentCount,
  slug,
  source,
  by,
}: {
  title: string;
  commentCount: number;
  slug: string;
  source: string;
  by: string;
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const users = await prisma.users.findMany({
    where: filterObject({
      title: title,
      commentCount: commentCount,
      by: by,
      slug: slug,
      source: source,
      editedAt: Date.now(),
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
