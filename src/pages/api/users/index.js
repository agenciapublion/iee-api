import prisma from '../../../lib/prisma'
// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"
const secret = "MEUSECRETO"

// GET /api/users/
export default async function handle(req, res) {
  const token = await getToken({ req, secret })
  if (token) {
    if (req.method === "GET") {
      // console.log("JSON Web Token", JSON.stringify(token, null, 2))
      const users = await prisma.user.findMany({});
      res.json(users);
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } else {
  //   // Not Signed in
    res.status(401)
    res.json({error: "unauthenticated", status: 401 });
  }

  
}