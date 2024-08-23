/*
    Rutas de usuarios / Auth
    host + /api/auth
*/
const { Router }= require('express');
const { check }= require('express-validator');
const { validateFields } = require('../middlewares/validators-fields');
const { createUser, loginUser, revalidToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validators-jwt');

const router = Router();

router.post(
    '/register',
    [//middleware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({min: 6}),
        validateFields
    ],
    createUser
);



router.post(
    '/',
    [//middleware
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({min: 6}),
        validateFields
    ],
    loginUser
);

router.get('/renew', validateJWT ,revalidToken);


module.exports = router;