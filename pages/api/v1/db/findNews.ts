import { NextApiRequest, NextApiResponse } from "next";
import findNewsHook from "../../../../lib/db/findNews";

export default async function findNews(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, titleSlug, by, slug, sourceUrl, content, page=0, limit=10 } = req.body;

  const data = await findNewsHook({
    title: title,
    titleSlug: titleSlug,
    by: by,
    slug: slug,
    sourceUrl: sourceUrl,
    content: content,
    page: page,
    limit: limit
  });

  res.status(200).json(data);
}
