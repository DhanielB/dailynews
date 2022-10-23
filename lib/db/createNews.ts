import { PrismaClient } from "@prisma/client";

export default async function createNews({
  title,
  by,
  slug,
  source,
  content
}: {
  title: string;
  by: string;
  slug: string;
  source: string;
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
      
      content: content,
      editedAt: Date.now(),
      createdAt: Date.now()
    }
  });

  await prisma.news.create({
    data: {
      
    }
  })

  
  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    data: news,
  };
}
