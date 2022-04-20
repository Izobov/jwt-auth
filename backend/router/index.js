const Router = require('express');
const userControler = require('../controllers/user-controler');
const {body} = require('express-validator');
const authMidleware = require('../midleware/auth-midleware');

const router = new Router()

router.post('/registration',body("email").isEmail(), body("password").isLength({min: 3, max: 32}), userControler.registration)
router.post('/login', userControler.login)
router.post('/logout', userControler.logout)
router.get('/activate/:link', userControler.activate)
router.get('/refresh', userControler.refresh)
router.get('/users', authMidleware, userControler.getUsers)

module.exports = router