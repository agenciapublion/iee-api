import auth from '../../../../shared/libs/auth';
import prisma from '../../../../shared/libs/prisma';

/**
 * @swagger
 * /api/events/{event_id}/present:
 *   post:
 *     description: Set Authed User Present on Event
 *     parameters:
 *        - name: x-access-token
 *          in: header
 *          required: true
 *        - name: event_id
 *          in: path
 *          required: true
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  presenca_confirmada:
 *                    type: integer
 *                    enum: [2, 3, 4]
 *                    default: 0
 *                    description: 3 Não Vai, 2 Vai Presencialmente, 4 Vai Online.
 *                  presente:
 *                    type: integer
 *                    enum: [0, 1]
 *                    default: 0
 *                    description: 0 Não presente, 1 Presente.
 *                required:
 *                  - presenca_confirmada
 *     responses:
 *       200:
 *         description: return inscription data
 */
const handler = async (req, res) => {
  const { method, body, query } = req;
  console.log(req.query)
  if (method !== "POST") return res.status(400).json({
    error: "REQUEST METHOD NOT VALID only POST",
    success: false
  });
  auth(req, async function (decoded) {
    const { event_id } = query;
    const { presenca_confirmada, presente, pontuar, pontos, old_pontos } = body;
    
    const event = await prisma.eventos.findUnique({ where: { evento_id: parseInt(event_id) } });
    if (decoded.id) {
      const result = await prisma.associados_eventos.create({
        data: {
          associados: {
            connect: {
              associado_id: decoded.id
            }
          },
          eventos: {
            connect: {
              evento_id: parseInt(event_id)
            }
          },
          presenca_confirmada: presenca_confirmada ? parseInt(presenca_confirmada) : null,
          presente: presente ? parseInt(presente) : null,
          pontuar: pontuar ? parseInt(pontuar) : null,
          pontos: pontos ? parseInt(pontos) : null,
          old_pontos: old_pontos ? parseInt(old_pontos) : null,
        },
      })
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: true, message: "User not found" });
    }
  }, function(err){
    res.status(400).json(err);
  })
};

export default handler;
