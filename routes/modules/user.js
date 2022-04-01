const express = require('express');
const yup = require('yup');

const validate = require('../../middleware/validate');
const userController = require('../../controllers/user-controller');

const router = express.Router();

const signUpSchema = yup.object({
  body: yup.object({
    email: yup.string().email(),
    user: yup.string(),
    password: yup.string().min(8).max(30),
  }),
});

router.post('/', validate(signUpSchema), userController.signUp);

module.exports = router;
