const express = require('express');
const router = express.Router();

//#region
//#endregion

//#region IMPORT DAS CONTROLLES
const associadoController = require('../controller/associadoController');
//#endregion

//#region ROTAS DAS REQUISIÇÕES REGISTROS
router.get('/associados', associadoController.getAllAssociados);
router.post('/associados', associadoController.createAssociado);
router.get('/associados/:id', associadoController.getAssociadoById);
router.put('/associados/:id', associadoController.updateAssociado);
router.delete('/associados/:id', associadoController.deleteAssociado);
//#endregion


module.exports = router;
