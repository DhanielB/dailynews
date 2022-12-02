import { NextApiRequest, NextApiResponse } from "next";
import nukeHook from "../../../../lib/db/nukeHook";

export default async function createUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, nuked } = req.body;

  const data = await nukeHook({
    name: name,
    email: email,
    nuked: Boolean(nuked)
  });

  res.status(200).json(data);
}
