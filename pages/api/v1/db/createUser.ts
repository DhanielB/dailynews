import { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../../lib/db/createUser";

export default async function createUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email } = req.body;

  const data = await createUser({
    name: name,
    email: email,
  });

  res.status(200).json(data);
}
