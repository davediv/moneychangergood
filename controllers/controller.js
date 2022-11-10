const {User, Inventory, Currency, Transaction} = require('../models')
const Bcrypt = require('Bcrypt')
class Controller {

    // INDEX
    static index(req, res) {

        Currency.findAll()
            .then(data => res.render("index", {data}))
            .catch(err => res.send(err))

    }

    // SIGNUP - GET
    static signup(req, res) {

        User.findAll()
            .then(data => res.render("signup", {data}))
            .catch(err => res.send(err))

    }

    // SIGNUP - POST
    static postSignup(req, res) {
        let {name, email, password, role} = req.body
        let obj = {name, email, password, role}

        User.create(obj, {returning:["*"]})
        .then(data => {
            
            Inventory.create({UserId:data.id})
                res.redirect("/signup")
            })
            .catch(err => res.send(err))
    }


    // SIGNIN - GET
    static signin(req, res) {
        let error = req.query.error

        res.render("signin", {error}) // TEST
    }

    // SIGNIN - POST
    static postSignin(req, res) {
        let {email, password} = req.body

        User.findOne({ where: { email: email } })
            // .then(data => res.redirect("/signup"))
            .then(data => {

                if (data) {
                    let isPassword = Bcrypt.compareSync( password,data.password)
                    // console.log(isPassword);
                    // console.log(password, data.password);
                    if (isPassword) {
                        req.session.userId = data.id // call session
                        req.session.role = data.role
                        // res.send("Berhasil Login!")
                        // res.send(data)

                        res.redirect('/home')
                    } else {
                        res.send("Password SALAH!")
                    }
                    
                } else {
                    res.send("Account Tidak Ditemukan!")
                }

            })
            .catch(err => res.send(err))
    }


    // HOME - isLogin
    static viewHome(req, res){
        // console.log(req.session.userId);
        // res.send(req.session.userId)
        User.findByPk(req.session.userId,{include: [Inventory]})
        .then(data => {
            // res.send(data)
            let adminAccess = req.session.adminAccess
            res.render("home", {data, adminAccess})
        })
    }





}

module.exports = Controller