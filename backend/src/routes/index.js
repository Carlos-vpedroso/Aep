const express = require('express');
const router = express.Router();

//#region
//#endregion

//#region IMPORT DAS CONTROLLES
const userController = require('../controller/userController');
//#endregion

//#region ROTAS DAS REQUISIÇÕES REGISTROS
router.get('/users', userController.index);
router.post('/users', userController.store);
router.get('/users/:id', userController.show);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.destroy);
//#endregion


module.exports = router;
