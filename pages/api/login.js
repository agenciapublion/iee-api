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
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 password: 
 *                   type: string
 *               required:
 *                 - name
 *                 - password
 *
 *     responses:
 *       200:
 *         description: {
 *          user,
 *          token: token,
 *          success: true
 *        }
 */
const handler = async (req, res) => {
 const {method} = req
 const credentials = req.body;

if (method !== "POST") return res.status(400).json({
  error: "REQUEST METHOD NOT VALID only POST",
  success: false
});
 if(credentials.username && credentials.password){

   const user = await prisma.usuarios.findFirst({
     where: {
       login: credentials.username,
     },
   })
   let result;
   if (user) {
     //const passw = Base64.stringify(CryptoJS.HmacSHA1(credentials.password, "CHAVE"))
     //if (user.password == passw) {
    if("master_password"){ 
      const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, process.env.SECRET, {
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
       error: "password invalid",
       success: false
     });
   }
 }else{
   res.status(400).json({
     error: "username or password invalid",
     success: false
   });
 }

};

export default handler;
