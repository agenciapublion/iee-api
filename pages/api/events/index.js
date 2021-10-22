import auth from '../../../lib/auth';
import prisma from '../../../lib/prisma';

/**
 * @swagger
 * /api/events:
 *   get:
 *     description: Get All Events
 *     parameters:
 *        - name: x-access-token
 *          in: header
 *          required: true
 *        - name: offset
 *          in: query
 *          required: false
 *        - name: limit
 *          in: query
 *          required: false
 *     responses:
 *       200:
 *         description: return array of events
 */
const handler = async (req, res) => {
  const { method } = req;
  if (method !== "GET") return res.status(400).json({
    error: "REQUEST METHOD NOT VALID only GET",
    success: false
  });
  auth(req, async function () {
    const query = req.query;
    const skip = query?.offset ? parseInt(query.offset) : 0;
    const take = query?.limit ? parseInt(query.limit) : 20;
    const events = await prisma.eventos.findMany({
      skip,
      take,
    });
    res.status(200).json({data: events, offset: skip, limit: take} );
  }, async function (err) {
    res.status(400).json(err);
  })
};

export default handler;
