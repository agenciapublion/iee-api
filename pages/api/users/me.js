import auth from '../../../shared/libs/auth';
import prisma from '../../../shared/libs/prisma';

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     description: Authed User
 *     parameters:
 *        - name: x-access-token
 *          in: header
 *          required: true
 *     responses:
 *       200:
 *         description: return data of user
 */
const handler = async (req, res) => {
  const { method } = req;
  if (method !== "GET") return res.status(400).json({
    error: "REQUEST METHOD NOT VALID only GET",
    success: false
  });
  auth(req, async function (decoded) {
    const user = await prisma.associados.findUnique({ where: { associado_id: decoded.id }});
    if(user){
      delete user.password
      res.status(200).json(user);
    }else{
      res.status(404).json({error: true, message: "User not found"});
    }
  }, function(err){
    res.status(400).json(err);
  })
};

export default handler;
