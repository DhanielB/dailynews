import { magic } from "../../../../lib/auth/magic";
import { removeTokenCookie } from "../../../../lib/auth/auth-cookies";
import { getLoginSession } from "../../../../lib/auth/auth";

export default async function logout(req, res) {
  const { request } = req.headers;

  if(request == process.env.NEXT_SECRET_API_KEY) {
    return res.status(401).json({
      status: 401,
      message: "Not authorized"
    })
  }
  
  try {
    const session = await getLoginSession(req);

    if (session) {
      await magic.users.logoutByIssuer(session.issuer);
      removeTokenCookie(res);
    }
  } catch (error) {
    console.error(error);
  }

  res.writeHead(302, { Location: "/" });
  res.end();
}
