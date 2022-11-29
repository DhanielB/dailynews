import { NextApiRequest, NextApiResponse } from "next";
import editVoteNews from "../../../../lib/db/editVoteNews";

export default async function createNews(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, votes=0 } = req.body;

  const data = await editVoteNews({
    title: title,
    votes: votes + 1
  })

  res.status(200).json(data);
}
