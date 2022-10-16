import { NextApiRequest, NextApiResponse } from "next";
import findMessage from "../../../../lib/db/findMessage";

export default async function findMessages(req: NextApiRequest, res: NextApiResponse) {
  const { from, to, content } = req.body

  const data = await findMessage({
    from: from,
    to: to,
    content: content
  })

  res.status(200).json(data)
}