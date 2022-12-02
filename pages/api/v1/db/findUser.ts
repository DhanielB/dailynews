import { NextApiRequest, NextApiResponse } from "next";
import findUser from "../../../../lib/db/findUser";
import filterObject from "../../../../lib/hooks/filterObject";

export default async function findUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { request } = req.headers;
  const { name, email, nuked, role, page, limit } = req.body;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }

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
