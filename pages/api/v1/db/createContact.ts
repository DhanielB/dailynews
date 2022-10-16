import { NextApiRequest, NextApiResponse } from "next";
import createContact from "../../../../lib/db/createContact";

export default async function createContacts(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, ownerEmail } = req.body

  const data = await createContact({
    name: name,
    email: email,
    ownerEmail: ownerEmail
  })

  res.status(200).json(data)
}