const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Verifica se o header existe e começa com "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Chave de admin não fornecida" });
  }

  const key = authHeader.split(" ")[1]; // pega só a key depois do Bearer

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Chave de admin inválida" });
  }

  // Se chegou aqui, está autorizado
  next();
};

module.exports = adminAuthMiddleware;
