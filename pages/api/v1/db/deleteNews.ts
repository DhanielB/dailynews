import { NextApiRequest, NextApiResponse } from "next";
import deleteNewsHook from "../../../../lib/db/deleteNews";

export default async function deleteNews(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, titleSlug, by, slug, sourceUrl, content } = req.body;

  const data = await deleteNewsHook({
    title: title,
    titleSlug: titleSlug,
    by: by,
    slug: slug,
    sourceUrl: sourceUrl,
    content: content,
  });

  res.status(200).json(data);
}
