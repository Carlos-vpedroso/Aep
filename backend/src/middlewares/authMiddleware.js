const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Pega o token do cabeçalho Authorization ou do cookie
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Salva os dados do usuário no request para usar nas rotas
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = authenticateToken;
