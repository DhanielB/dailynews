import { NextApiRequest, NextApiResponse } from "next";
import findNewsHook from "../../../../lib/db/findNews";
import filterObject from "../../../../lib/hooks/filterObject";

export default async function findNews(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { request } = req.headers;
  const { title, titleSlug, by, slug, sourceUrl, content, page=0, limit=10 } = req.body;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }

  const data = await findNewsHook({
    title: title,
    titleSlug: titleSlug,
    by: by,
    slug: slug,
    sourceUrl: sourceUrl,
    content: content,
  }, filterObject({
    page: page,
    limit: limit
  }));

  res.status(200).json(data);
}
