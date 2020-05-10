const express = require('express');
const router = express.Router();
const { signUpController } = require('../../../controllers/v1/auth-controller');

/* GET users listing. */
router.post('/sign-up', signUpController);

module.exports = router;
