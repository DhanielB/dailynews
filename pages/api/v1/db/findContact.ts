import { NextApiRequest, NextApiResponse } from "next";
import findContact from "../../../../lib/db/findContact";

export default async function findContacts(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, ownerEmail } = req.body

  const data = await findContact({
    name: name,
    email: email,
    ownerEmail: ownerEmail,
  })

  res.status(200).json(data)
}