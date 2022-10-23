import { NextApiRequest, NextApiResponse } from "next";
import findUser from "../../../../lib/db/findUser";

export default async function findUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email } = req.body;

  const data = await findUser({
    name: name,
    email: email,
  });

  res.status(200).json(data);
}
