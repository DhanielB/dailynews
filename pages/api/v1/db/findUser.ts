import { NextApiRequest, NextApiResponse } from "next";
import findUser from "../../../../lib/db/findUser";

export default async function findUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, nuked, page, limit } = req.body;

  const data = await findUser({
    name: name,
    email: email,
    nuked: Boolean(nuked),
    page: page,
    limit: limit
  });

  res.status(200).json(data);
}
