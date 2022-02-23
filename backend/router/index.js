const Router = require('express');
const userControler = require('../controllers/user-controler')

const router = new Router()

router.post('/registration', userControler.registration)
router.post('/login', userControler.login)
router.post('/logout', userControler.logout)
router.get('/activate/:link', userControler.activate)
router.get('/refresh', userControler.refresh)
router.get('/users', userControler.getUsers)

module.exports = router