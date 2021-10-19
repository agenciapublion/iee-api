require("dotenv-safe").config();
const jwt = require('jsonwebtoken');


/**
 * @swagger
 * /api/logout:
 *   post:
 *     description: User Logout
 *     parameters:
 *        - name: x-access-token
 *          in: header
 *          required: true
 *     responses:
 *       200:
 *         description: {
 *          token: null,
 *          success: true
 *        }
 */
const handler = async (req, res) => {
  const token = req.headers['x-access-token'];

  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

    // se tudo estiver ok, salva no request para uso posterior
    res.status(200).json({
      tokne: null,
      success: true
    });
  });
};

export default handler;
