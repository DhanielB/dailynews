import { NextApiRequest, NextApiResponse } from "next";
import deleteNewsHook from "../../../../lib/db/deleteNews";

export default async function deleteNews(
  req: NextApiRequest,
  res: NextApiResponse
) {
const { request } = req.headers;
  const { title, titleSlug, by, slug, sourceUrl, content } = req.body;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }

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
