import { NextApiRequest, NextApiResponse } from "next";
import createMessage from "../../../../lib/db/createMessage";

export default async function createMessages(req: NextApiRequest, res: NextApiResponse) {
  const { from, to, content } = req.body

  const data = await createMessage({
    from: from,
    to: to,
    content: content
  })

  res.status(200).json(data)
}