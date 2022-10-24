import { PrismaClient } from "@prisma/client";
import filterObject from "../hooks/filterObject";

export default async function findNews({
  title,
  titleSlug,
  by,
  slug,
  sourceUrl,
  content,
}: {
  title: string;
  titleSlug: string;
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
      titleSlug: titleSlug,
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
