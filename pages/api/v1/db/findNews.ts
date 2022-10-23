import { NextApiRequest, NextApiResponse } from "next";
import findNewsUse from "../../../../lib/db/findNews";

export default async function findNews(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, commentCount, slug, source, by } = req.body;

  const data = await findNewsUse({
    title: title,
    commentCount: commentCount,
    slug: slug,
    source: source,
    by: by,
  });

  res.status(200).json(data);
}
