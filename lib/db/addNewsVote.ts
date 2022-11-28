import { PrismaClient } from "@prisma/client";
import formatText from "../hooks/formatText";

interface IAuth {
  name: string;
  email: string;
}

export default async function addNewsVote({
  title,
  votes
}: {
  title: string;
  votes: number
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const news = await prisma.news.update({
    where: {
      title: title,
      titleSlug: formatText(title)
    },
    data: {
      votes: votes
    }
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    data: news,
  };
}
