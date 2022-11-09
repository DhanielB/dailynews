import { PrismaClient } from "@prisma/client";
import formatText from "../hooks/formatText";

interface IAuth {
  name: string;
  email: string;
}

export default async function createNews({
  title,
  by,
  slug,
  sourceUrl,
  content,
  auth
}: {
  title: string;
  by: string;
  slug: string;
  sourceUrl: string;
  content: string;
  auth: IAuth
}) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const news = await prisma.users.update({
    where: auth,
    data: {
      News: {
        create: {
          title: title,
          titleSlug: formatText(title),
          commentCount: 0,
          by: by,
          slug: slug,
          sourceUrl: sourceUrl,
          content: content,
          editedAt: Date.now(),
          createdAt: Date.now(),
        }
      }
    }
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    data: news,
  };
}
