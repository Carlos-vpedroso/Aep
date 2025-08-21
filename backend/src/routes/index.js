const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware')

//#region
//#endregion

//#region IMPORT DAS CONTROLLES
const associadoController = require('../controller/associadoController');
const listaBatataisAlunosController = require('../controller/listaBatataisAlunosController');
const listaFrancaMatutinoAlunosController = require('../controller/listaFrancaMatutinoAlunosController');
const listaFrancaNoturnoAlunosController = require('../controller/listaFrancaNoturnoAlunosController');
const listaPassosMatutinoAlunosController = require('../controller/listaPassosMatutinoAlunosController');
const listaPassosNoturnoAlunosController = require('../controller/listaPassosNoturnoAlunosController');
//#endregion

//#region ROTAS DAS REQUISIÇÕES ASSOCIADO
router.get('/associados', associadoController.getAllAssociados);
router.get('/fullacess/associados/:id', authenticateToken, associadoController.getAssociadoById);
router.get('/associados/:id', authenticateToken, associadoController.getDadosAssociadoID);
router.get('/associados/verify/:token', associadoController.verifyEmail);
router.post('/associados', associadoController.createAssociado);
router.post('/associados/login', associadoController.loginAssociado);
router.put('/associados/:id', associadoController.updateAssociado);
router.delete('/associados/:id', associadoController.deleteAssociado);
//#endregion

//#region ROTAS DAS REQUISIÇÕES ALUNO_LISTAS
router.post('associado/Batatais/:id', authenticateToken, listaBatataisAlunosController.adicionarAlunoLista);
router.post('associado/Franca/Matutino/:id', authenticateToken, listaFrancaMatutinoAlunosController.adicionarAlunoLista);
router.post('associado/Franca/Noturno/:id', authenticateToken, listaFrancaNoturnoAlunosController.adicionarAlunoLista);
router.post('associado/Passos/Matutino/:id', authenticateToken, listaPassosMatutinoAlunosController.adicionarAlunoLista);
router.post('associado/Passos/Noturno/:id', authenticateToken, listaPassosNoturnoAlunosController.adicionarAlunoLista);
//#endregion


module.exports = router;
