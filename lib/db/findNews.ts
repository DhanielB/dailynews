import { PrismaClient } from "@prisma/client";
import filterObject from "../hooks/filterObject";

export default async function findUser({
  title,
  by,
  slug,
  sourceUrl,
  content,
}: {
  title: string;
  by: string;
  slug: string;
  sourceUrl: string;
  content: string;
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const news = await prisma.news.findMany({
    //@ts-ignore
    where: filterObject({
      title: title,
      by: by,
      slug: slug,
      sourceUrl: sourceUrl,
      content: content,
    }),
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    count: news.length,
    data: news,
  };
}
