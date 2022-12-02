import { getLoginSession } from "../../../../lib/auth/auth";

export default async function user(req, res) {
  const { request } = req.headers;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }
  
  const session = await getLoginSession(req);
  
  res.status(200).json({ user: session || null });
}
