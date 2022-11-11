const router = require("express").Router();
const Controller = require("../controllers/controller");
const { isLogin, isAdmin } = require("../middlewares/middleware");

// HOMEPAGE
router.get("/", Controller.index);

// REGISTER - FORM
router.get("/signup", Controller.signup);

// REGISTER - POST
router.post("/signup", Controller.postSignup);

// LOGIN - FORM
router.get("/signin", Controller.signin);

// LOGIN - POST
router.post("/signin", Controller.postSignin);

// LOGIN ADMIN - FORM
router.get("/admin", Controller.admin);

// LOGIN ADMIN - POST
router.post("/admin", Controller.postAdmin);

// HOME - AFTER LOGIN
router.get("/home", isLogin, isAdmin, Controller.viewHome);

// GET - EDIT PROFILE
router.get("/editprofile", isLogin, isAdmin, Controller.editProfile);

// POST - EDIT PROFILE
router.post("/editprofile", isLogin, isAdmin, Controller.postEditProfile);

// USERS LIST
router.get("/userslist", isLogin, isAdmin, Controller.userlist);

// DELETE USER
router.get("/user/:id/delete", isLogin, isAdmin, Controller.deleteUser);

// LOGOUT USER
router.get("/logout", Controller.logout);

// CURRENCIES - GET
router.get("/currencies", isLogin, isAdmin, Controller.viewCurrencies);

// CURRENCY BUY
router.post("/transactionBuy/:id", isLogin, Controller.transactionBuy);

// CURRENCY SELL
router.post("/transactionSell/:id", isLogin, Controller.transactionSell);

// CURRENCY EDIT
router.post("/modifycurrency/:id", isLogin, isAdmin, Controller.modifyCurrency);

module.exports = router;
