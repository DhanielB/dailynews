import { PrismaClient } from "@prisma/client";
import formatText from "../hooks/formatText";

interface IAuth {
  name: string;
  email: string;
}

const prisma = new PrismaClient();

export default async function editVoteNews({
  title,
  votes
}: {
  title: string;
  votes: number
}) {
  const news = await prisma.news.update({
    where: {
      title: title
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
