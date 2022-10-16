import { PrismaClient } from "@prisma/client";
import filterObject from "../filterObject";

export default async function findMessage({
  from,
  to,
  content,
}: {
  from?: string;
  to?: string;
  content?: string;
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();
  
  const messages = await prisma.messages.findMany({
    where: filterObject({
      from: from,
      to: to,
      content: content,
    }),
  });


  await prisma.$disconnect();
  
  return {
    status: 200,
    message: "Success",
    data: messages,
  };
}
