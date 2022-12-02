import { PrismaClient } from "@prisma/client";
import filterObject from "../hooks/filterObject";

const prisma = new PrismaClient();

export default async function findUser({
  name,
  email,
  nuked,
  role
}: {
  name?: string;
  email?: string;
  nuked?: boolean;
  role?: string;
}, othersConfigs: { limit: number, page: number }) {
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
      nuked: nuked,
      role: role
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
