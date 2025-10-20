/**
 * @swagger
 * tags:
 *   name: Associados
 *   description: Endpoints relacionados aos associados
 */

/**
 * @swagger
 * /api/associados:
 *   get:
 *     summary: Lista todos os associados
 *     tags: [Associados]
 *     responses:
 *       200:
 *         description: Lista de associados retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "d9a7c2e0-9f4b-11ef-8b2d-0242ac120003"
 *                   nome:
 *                     type: string
 *                     example: João Silva
 *                   email:
 *                     type: string
 *                     example: joao@email.com
 *                   cidadeTransporte:
 *                     type: string
 *                     example: Franca
 *                   modalidadeTransporte:
 *                     type: string
 *                     example: Mensalista
 *                   turno:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Matutino", "Noturno"]
 */

/**
 * @swagger
 * /api/associados:
 *   post:
 *     summary: Cadastra um novo associado
 *     tags: [Associados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Associado criado com sucesso e e-mail de verificação enviado
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/associados/login:
 *   post:
 *     summary: Realiza login do associado
 *     tags: [Associados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso!
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Email ou senha inválidos
 *       403:
 *         description: Conta não validada
 */

/**
 * @swagger
 * /api/associados/verify/{token}:
 *   get:
 *     summary: Confirma o e-mail do associado
 *     tags: [Associados]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de verificação enviado por e-mail
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: E-mail confirmado com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */

/**
 * @swagger
 * /api/associados/{id}:
 *   get:
 *     summary: Retorna os dados detalhados de um associado
 *     security:
 *       - bearerAuth: []
 *     tags: [Associados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do associado
 *     responses:
 *       200:
 *         description: Dados do associado retornados com sucesso
 *       404:
 *         description: Associado não encontrado
 */

/**
 * @swagger
 * /api/fullacess/associados/{id}:
 *   get:
 *     summary: Retorna todos os dados brutos de um associado (modo administrativo)
 *     security:
 *       - bearerAuth: []
 *     tags: [Associados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do associado
 *     responses:
 *       200:
 *         description: Dados completos do associado retornados com sucesso
 *       404:
 *         description: Associado não encontrado
 */

/**
 * @swagger
 * /api/associados/{id}:
 *   put:
 *     summary: Atualiza os dados do associado
 *     security:
 *       - bearerAuth: []
 *     tags: [Associados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do associado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Atualizado
 *               telefone:
 *                 type: string
 *                 example: "(16) 99999-9999"
 *               turno:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Noturno"]
 *     responses:
 *       200:
 *         description: Associado atualizado com sucesso
 *       404:
 *         description: Associado não encontrado
 */

/**
 * @swagger
 * /api/associados/first-time/{id}:
 *   put:
 *     summary: Atualiza os dados do primeiro cadastro do associado
 *     security:
 *       - bearerAuth: []
 *     tags: [Associados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do associado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               faculdade:
 *                 type: string
 *                 example: UNIFRAN
 *               curso:
 *                 type: string
 *                 example: Direito
 *               cidadeTransporte:
 *                 type: string
 *                 example: Franca
 *               modalidadeTransporte:
 *                 type: string
 *                 example: Mensalista
 *               turno:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Matutino"]
 *     responses:
 *       200:
 *         description: Associado atualizado com sucesso
 *       404:
 *         description: Associado não encontrado
 */

/**
 * @swagger
 * /api/associados/{id}:
 *   delete:
 *     summary: Remove um associado
 *     tags: [Associados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do associado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Associado removido com sucesso
 *       404:
 *         description: Associado não encontrado
 */

/**
 * @swagger
 * /api/associados/quantidade/cidade:
 *   get:
 *     summary: Retorna a quantidade de associados por cidade
 *     security:
 *       - bearerAuth: []
 *     tags: [Associados]
 *     responses:
 *       200:
 *         description: Quantidade de associados retornada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Franca:
 *                   type: integer
 *                   example: 120
 *                 Passos:
 *                   type: integer
 *                   example: 80
 *                 Batatais:
 *                   type: integer
 *                   example: 50
 *                 Total:
 *                   type: integer
 *                   example: 250
 */

/**
 * @swagger
 * /api/associados/quantidade/modalidade:
 *   get:
 *     summary: Retorna a quantidade de associados por modalidade
 *     security:
 *       - bearerAuth: []
 *     tags: [Associados]
 *     responses:
 *       200:
 *         description: Quantidade de associados por modalidade
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Mensal:
 *                   type: integer
 *                   example: 200
 *                 Diaria:
 *                   type: integer
 *                   example: 50
 */

/**
 * @swagger
 * /api/associados/quantidade/situacao:
 *   get:
 *     summary: Retorna a quantidade de associados por situação
 *     security:
 *       - bearerAuth: []
 *     tags: [Associados]
 *     responses:
 *       200:
 *         description: Quantidade de associados por situação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Pendente:
 *                   type: integer
 *                   example: 10
 *                 Ativo:
 *                   type: integer
 *                   example: 230
 *                 Inativo:
 *                   type: integer
 *                   example: 15
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
