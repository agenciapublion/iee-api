import auth from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

/**
 * @swagger
 * /api/events/{event_id}/comment:
 *   post:
 *     description: POST User Comment to Event
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
 *                  comment:
 *                    type: string
 *                    description: Comentário ao evento
 *                  file:
 *                    type: string
 *                    description: Caminho do arquivo
 *                  file_title:
 *                    type: string
 *                    description: Título para o arquvo
 *                required:
 *                  - comment
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
    const { comment, file_title, file} = body;

    const event = await prisma.eventos.findUnique({ where: { evento_id: parseInt(event_id) } });
    if (decoded.id) {
      const result = await prisma.comentarios_evento.create({
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
          comentario: comment ? comment : "",
          arquivo: file ? file : "",
          arquivo_titulo: file_title ? file_title : "",
        },
      })
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: true, message: "User not found" });
    }
  }, function (err) {
    res.status(400).json(err);
  })
};

export default handler;
