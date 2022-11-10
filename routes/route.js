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

// router.use((req, res, next) => {

//     if (req.session.userId) {
//         next()
//     } else {
//         let error = "Login first!"
//         res.redirect(`/signin?error=${error}`)
//     }
// })


// isLogin
// router.post('/test123', Controller.udahLogin);




module.exports = router