import { NextApiRequest, NextApiResponse } from "next";
import editRoleUser from "../../../../lib/db/editRoleUser";

export default async function createUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { request } = req.headers;
  const { name, email, role } = req.body;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }

  const data = await editRoleUser({
    name: name,
    email: email,
    role: role
  });

  res.status(200).json(data);
}
