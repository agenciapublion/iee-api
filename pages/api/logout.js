import auth from '../../lib/auth';
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
  auth(req, function(){
    res.status(200).json({
      token: null,
      success: true
    });
  }, function(err){
    return res.status(500).json(err);
  })
};

export default handler;
