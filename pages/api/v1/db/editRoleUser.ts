import { NextApiRequest, NextApiResponse } from "next";
import editRoleUser from "../../../../lib/db/editRoleUser";

export default async function createUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, role } = req.body;

  const data = await editRoleUser({
    name: name,
    email: email,
    role: role
  });

  res.status(200).json(data);
}
