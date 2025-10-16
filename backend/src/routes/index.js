const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const authenticateAdmin = require("../middlewares/adminAuthMiddleware");

//#region
//#endregion

//#region IMPORT DAS CONTROLLES
const associadoController = require("../controller/associadoController");
const diretoriaController = require("../controller/diretoriaController");
const listaViagemAlunoController = require("../controller/listaViagemAlunoController");
const pagamentosController = require("../controller/pagamentosController");
//#endregion

//#region ROTAS DAS REQUISIÇÕES ASSOCIADO
router.get("/associados", associadoController.getAllAssociados);
router.get(
  "/associados/quantidade/cidade",
  authenticateToken,
  associadoController.getAssociadosQuantidade
);
router.get(
  "/associados/quantidade/modalidade",
  authenticateToken,
  associadoController.getAssociadosPorModalidade
);
router.get(
  "/associados/quantidade/situacao",
  authenticateToken,
  associadoController.getAssociadosPorSituacao
);
router.get(
  "/fullacess/associados/:id",
  authenticateToken,
  associadoController.getAssociadoById
);
router.get(
  "/associados/:id",
  authenticateToken,
  associadoController.getDadosAssociadoID
);
router.get("/associados/verify/:token", associadoController.verifyEmail);
router.post("/associados", associadoController.createAssociado);
router.post("/associados/login", associadoController.loginAssociado);
router.put(
  "/associados/:id",
  authenticateToken,
  associadoController.updateAssociado
);
router.put(
  "/associados/first-time/:id",
  authenticateToken,
  associadoController.updateFirstTimeAssociado
);
router.delete("/associados/:id", associadoController.deleteAssociado);
//#endregion

//#region ROTAS ALUNO_LISTAS
router.get(
  "/listas/:cidade/:turno/:data/alunos",
  authenticateToken,
  listaViagemAlunoController.getListaViagemAlunosPorRotaData
);
router.post(
  "/listas/adicionar-associado/:idAssociado",
  authenticateToken,
  listaViagemAlunoController.adicionarAssociadoNaLista
);
router.post(
  "/listas/visualizar-passagem/:idAssociado",
  authenticateToken,
  listaViagemAlunoController.visualizarPassagemAssociado
);
router.delete(
  "/listas/cancelar-passagem/:idPassagem",
  authenticateToken,
  listaViagemAlunoController.deletePassagem
);
//#endregion

//#region ROTAS DIRETORIA
router.post("/diretoria/login", diretoriaController.loginDiretoria);
router.post(
  "/diretoria",
  authenticateAdmin,
  diretoriaController.createDiretoria
);
//#endregion

//#region ROTAS PAGAMENTOS
router.get("/get-token-simulacao", pagamentosController.tokenSimulacao);
router.post(
  "/criar/cobranca-pix/diarista",
  pagamentosController.criarCobrancaPixDiaria
);
//#endregion

module.exports = router;
