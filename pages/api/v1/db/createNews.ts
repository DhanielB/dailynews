import { NextApiRequest, NextApiResponse } from "next";
import createNewsHook from "../../../../lib/db/createNews";

export default async function createNews(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { request } = req.headers;
  const { title, by, slug, sourceUrl, content, auth } = req.body;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }

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
