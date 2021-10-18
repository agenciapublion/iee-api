import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Adapters from "next-auth/adapters";
import prisma from '../../../lib/prisma';
import CryptoJS from "crypto-js";
import Base64 from 'crypto-js/enc-base64';
const secret = process.env.SECRET
const authHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.username,
          },
        })
        if (user) {
          const passw = Base64.stringify(CryptoJS.HmacSHA1(credentials.password, "CHAVE"))
          if(user.password == passw){
            return user
          }
        }
        return null
      }
    })
  ],
  session: {
    jwt: true
  },
  jwt: {
    secret: 'MEUSECRETO',
  },
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.SECRET,
};