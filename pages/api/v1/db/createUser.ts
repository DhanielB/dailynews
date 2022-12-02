import { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../../lib/db/createUser";

export default async function createUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { request } = req.headers;
  const { name, email } = req.body;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }

  const data = await createUser({
    name: name,
    email: email,
  });

  res.status(200).json(data);
}
