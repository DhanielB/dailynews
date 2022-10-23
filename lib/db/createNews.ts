import { PrismaClient } from "@prisma/client";

export default async function createNews({
  title,
  by,
  slug,
  sourceUrl,
  content
}: {
  title: string;
  by: string;
  slug: string;
  sourceUrl: string;
  content: string;
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const news = await prisma.news.create({
    data: {
      title: title,
      commentCount: 0,
      by: by,
      slug: slug,
      sourceUrl: sourceUrl,
      content: content,
      editedAt: Date.now(),
      createdAt: Date.now()
    }
  });

  
  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    data: news,
  };
}