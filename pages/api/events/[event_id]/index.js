import auth from '../../../../shared/libs/auth';
import prisma from '../../../../shared/libs/prisma';

/**
 * @swagger
 * /api/events/{event_id}:
 *   get:
 *     description: Get One Event by event_id
 *     parameters:
 *        - name: event_id
 *          in: path
 *          required: true
 *        - name: x-access-token
 *          in: header
 *          required: true
 *     responses:
 *       200:
 *         description: return object of one events
 */
const handler = async (req, res) => {
  const { method } = req;
  if (method !== "GET") return res.status(400).json({
    error: "REQUEST METHOD NOT VALID only GET",
    success: false
  });
  auth(req, async function () {
    const {event_id} = req.query;
    if(event_id){
      const event = await prisma.eventos.findUnique({ where: { evento_id: parseInt(event_id) }});
      res.status(200).json({ data: event });
    }else{
      res.status(400).json({error: true, message: "event_id not found"});
    }
  }, async function (err) {
    res.status(400).json(err);
  })
};

export default handler;
