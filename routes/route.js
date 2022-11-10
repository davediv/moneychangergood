const router = require('express').Router()
const Controller = require('../controllers/controller')
const {isLogin,isAdmin} = require('../middlewares/middleware')

// HOMEPAGE
router.get('/', Controller.index);

// REGISTER - FORM
router.get('/signup', Controller.signup);

// REGISTER - POST
router.post('/signup', Controller.postSignup);

// LOGIN - FORM
router.get('/signin', Controller.signin);

// LOGIN - POST
router.post('/signin', Controller.postSignin);

router.get("/home",isLogin,isAdmin ,Controller.viewHome)

//CURRENCIES - GET
router.get("/currencies",isLogin, isAdmin, Controller.viewCurrencies)

//CURRENCY BUY - SELL - EDIT
router.post('/transactionBuy/:id', isLogin, Controller.transactionBuy)
router.post('/transactionSell/:id', isLogin, Controller.transactionSell)
router.post('/modifycurrency/:id', isLogin, isAdmin, Controller.modifyCurrency)




module.exports = router