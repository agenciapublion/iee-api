require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

import prisma from '../../lib/prisma';
import CryptoJS from "crypto-js";
import Base64 from 'crypto-js/enc-base64';
/**
 * @swagger
 * /api/login:
 *   post:
 *     description: User Login 
 *     parameters: 
 *      - name: "username"
 *        in: "formData"
 *        description: "Username for user"
 *        required: true
 *        type: "string"
 *      - name: "password"
 *        in: "formData"
 *        description: "Password for user"
 *        required: true
 *        type: "password"
 *     responses:
 *       200:
 *         description: {
 *          user,
 *          token: token,
 *          success: true
 *        }
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
      result =  { 
        user,
        token: token,
        success: true
      }
      res.status(200).json(result);
    }
  }else{
    res.status(400).json({
      error: "username or password invalid",
      success: false
    });
  }
};

export default handler;
