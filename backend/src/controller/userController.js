const userViewModel = require("../view/managerView");

module.exports = {
  // GET /users
  async index(req, res) {
    try {
      const users = await userViewModel.findAll();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  },

  // POST /users
  async store(req, res) {
    try {
      const { name, email } = req.body;

      const user = await userViewModel.create({ name, email });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar usuário" });
    }
  },

  // GET /users/:id
  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await userViewModel.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  },

  // PUT /users/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const user = await userViewModel.findByPk(id);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      await user.update({ name, email });
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar usuário" });
    }
  },

  // DELETE /users/:id
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const user = await userViewModel.findByPk(id);

      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      await user.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  },
};
