require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
export default function auth(req, success, error){
  const token = req.headers['x-access-token'];
  if (!token) return error({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return error({ auth: false, message: 'Failed to authenticate token.' });

    // se tudo estiver ok, salva no request para uso posterior
    success(decoded);
  });
}