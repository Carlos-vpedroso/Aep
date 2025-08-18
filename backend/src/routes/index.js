const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware')

//#region
//#endregion

//#region IMPORT DAS CONTROLLES
const associadoController = require('../controller/associadoController');
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


module.exports = router;
