import { NextApiRequest, NextApiResponse } from "next";
import nukeHook from "../../../../lib/db/nukeHook";

export default async function createUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { request } = req.headers;
  const { name, email, nuked } = req.body;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }

  const data = await nukeHook({
    name: name,
    email: email,
    nuked: Boolean(nuked)
  });

  res.status(200).json(data);
}
