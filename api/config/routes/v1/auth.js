const express = require('express');
const router = express.Router();
const { signUpController, authEmailProviderController } = require('../../../controllers/v1/auth-controller');

router.post('/sign-up', signUpController);
router.post('/sign-in', authEmailProviderController);

module.exports = router;
