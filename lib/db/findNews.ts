import { PrismaClient } from "@prisma/client";
import filterObject from "../hooks/filterObject";

const prisma = new PrismaClient();

export default async function findNews(
  {
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
  },
  othersConfigs: { limit?: number; page?: number }
) {
  function formatOthersConfigs(othersConfigs: { page?: any; limit?: any }) {
    let othersConfigsChanged: { skip?: any, take?: any } = {};

    if (othersConfigs?.limit && othersConfigs?.page) {
      othersConfigsChanged.take = othersConfigs.limit;
      othersConfigsChanged.skip = othersConfigs.page * othersConfigs.limit;
    }

    return othersConfigsChanged;
  }

  const formatedOthersConfigs = formatOthersConfigs(othersConfigs);

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
    ...formatedOthersConfigs,
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    count: news.length,
    data: news,
  };
}
