import { NextApiRequest, NextApiResponse } from "next";
import findUser from "../../../../lib/db/findUser";
import filterObject from "../../../../lib/hooks/filterObject";

export default async function findUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, nuked, role, page, limit } = req.body;

  const data = await findUser({
    name: name,
    email: email,
    nuked: Boolean(nuked),
    role: role
  }, filterObject({
    page: page,
    limit: limit
  }));

  res.status(200).json(data);
}
