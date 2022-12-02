import { NextApiRequest, NextApiResponse } from "next";
import editVoteNews from "../../../../lib/db/editVoteNews";

export default async function createNews(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { request } = req.headers;
  const { title, votes=0 } = req.body;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }

  const data = await editVoteNews({
    title: title,
    votes: votes + 1
  })

  res.status(200).json(data);
}
