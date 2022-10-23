import { NextApiRequest, NextApiResponse } from "next";
import createNews from "../../../../lib/db/createNews";

export default async function createUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, slug, content, source, by } = req.body;

  const data = await createNews({
    title: title,
    slug: slug,
    source: source,
    content: content,
    by: by,
  });

  res.status(200).json(data);
}
