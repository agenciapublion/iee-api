import auth from '../../../lib/auth';
import prisma from '../../../lib/prisma';

/**
 * @swagger
 * /api/events/present:
 *   post:
 *     description: Set Authed User Present on Event
 *     parameters:
 *        - name: x-access-token
 *          in: header
 *          required: true
 *     responses:
 *       200:
 *         description: return inscription data
 */
const handler = async (req, res) => {
  const { method } = req;
  if (method !== "POST") return res.status(400).json({
    error: "REQUEST METHOD NOT VALID only GET",
    success: false
  });
  auth(req, async function () {
    const users = await prisma.user.findMany({});
    res.status(200).json(users);
  }, function(err){
    res.status(400).json(err);
  })
};

export default handler;
