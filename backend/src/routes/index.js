const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware')

//#region
//#endregion

//#region IMPORT DAS CONTROLLES
const associadoController = require('../controller/associadoController');
const controllerAlunosLista = require('../controller/listaCidadeTurnoAlunoController')
// const listaBatataisAlunosController = require('../controller/listaBatataisAlunosController');
// const listaFrancaMatutinoAlunosController = require('../controller/listaFrancaMatutinoAlunosController');
// const listaFrancaNoturnoAlunosController = require('../controller/listaFrancaNoturnoAlunosController');
// const listaPassosMatutinoAlunosController = require('../controller/listaPassosMatutinoAlunosController');
// const listaPassosNoturnoAlunosController = require('../controller/listaPassosNoturnoAlunosController');
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

//#region ROTAS ALUNO_LISTAS
// Adicionar aluno à lista
router.post('/associados/:cidade/:turno/:id', authenticateToken, controllerAlunosLista.adicionarAlunoLista);

// Remover aluno da lista
router.delete('/associados/:cidade/:turno/:id', authenticateToken, controllerAlunosLista.removerAlunoLista);

// Verificar se aluno está na lista
router.get('/associados/:cidade/:turno/:id', authenticateToken, controllerAlunosLista.verificarAlunoNaLista);
//#endregion


module.exports = router;
