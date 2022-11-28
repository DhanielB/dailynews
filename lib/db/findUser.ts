import { PrismaClient } from "@prisma/client";
import filterObject from "../hooks/filterObject";

export default async function findUser({
  name,
  email,
  nuked
}: {
  name?: string;
  email?: string;
  nuked?: boolean;
}, othersConfigs: { limit: number, page: number }) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  function formatOthersConfigs(othersConfigs: { page?: any; limit?: any }) {
    let othersConfigsChanged: { skip?: any, take?: any } = {};

    if (othersConfigs?.limit && othersConfigs?.page) {
      othersConfigsChanged.take = othersConfigs.limit;
      othersConfigsChanged.skip = othersConfigs.page * othersConfigs.limit;
    }

    return othersConfigsChanged;
  }

  const formatedOthersConfigs = formatOthersConfigs(othersConfigs)

  const users = await prisma.users.findMany({
    //@ts-ignore
    where: filterObject({
      name: name,
      email: email,
      nuked: nuked
    }),
    ...formatedOthersConfigs
  });

  await prisma.$disconnect();

  return {
    status: 200,
    message: "Success",
    count: users.length,
    data: users,
  };
}
