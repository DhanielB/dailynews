import { NextApiRequest, NextApiResponse } from "next";
import createNewsHook from "../../../../lib/db/createNews";

export default async function createNews(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, by, slug, sourceUrl, content, auth } = req.body;

  const data = await createNewsHook({
    title: title,
    by: by,
    slug: slug,
    sourceUrl: sourceUrl,
    content: content,
    auth: auth
  });

  res.status(200).json(data);
}
