require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

import prisma from '../../lib/prisma';
import CryptoJS from "crypto-js";
import Base64 from 'crypto-js/enc-base64';
/**
 * @swagger
 * /api/users:
 *   get:
 *     description: User Login
 *     parameters:
 *        - name: x-access-token
 *          in: header
 *          required: true
 *     responses:
 *       200:
 *         description: return array of users
 */
const handler = async (req, res) => {
  const credentials = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: credentials.username,
    },
  })
  let result;
  if (user) {
    const passw = Base64.stringify(CryptoJS.HmacSHA1(credentials.password, "CHAVE"))
    if (user.password == passw) {
      const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });
      delete user.password;
      result = {
        user,
        token: token,
        success: true
      }
      res.status(200).json(result);
    }
  } else {
    res.status(400).json({
      error: "username or password invalid",
      success: false
    });
  }
};

export default handler;
