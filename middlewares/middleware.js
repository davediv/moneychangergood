 const isLogin = (req, res, next) => {

        if (req.session.userId) {
            next()
        } else {
            let error = "Login first!"
            res.redirect(`/signin?error=${error}`)
        }
}


const isAdmin = (req, res, next) => {
    if (req.session.role == "admin" && req.session.userId){
        req.session.adminAccess = true
        next()
    } else{
        req.session.adminAccess = false
        next()
    }
}


module.exports = {isLogin, isAdmin}