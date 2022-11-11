const {User, Inventory, Currency, Transaction} = require('../models')
const Bcrypt = require('Bcrypt')
const greet = require('greet-by-time')

class Controller {

    // INDEX
    static index(req, res) {

        let adminAccess = req.session.adminAccess

        Currency.findAll()
            .then(data => res.render("index", {data, adminAccess}))
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










    // ADMIN - GET
    static admin(req, res) {
        let error = req.query.error
        res.render("admin", {error}) // TEST
    }

    // ADMIN - POST
    static postAdmin(req, res) {
        let {email, password} = req.body

        User.findOne({ where: { email: email } })
            .then(data => {
                if (data) {
                    let isPassword = Bcrypt.compareSync( password,data.password)
                    if (isPassword) {
                        req.session.userId = data.id // call session
                        req.session.role = data.role
                        res.redirect('/userslist')
                    } else {
                        res.send("Password SALAH!")
                    }
                    
                } else {
                    res.send("Account Admin Tidak Ditemukan!")
                }

            })
            .catch(err => res.send(err))
    }


    // HOME - isLogin
    static viewHome(req, res){
        const hour = new Date().getHours();

        User.findByPk(req.session.userId,{include: [Inventory, Transaction]})
        .then(data => {
            let adminAccess = req.session.adminAccess
            let greeting = greet(data.name, hour)
            res.render("home", {data, adminAccess, greeting})
        })
        .catch(err => res.send(err))
    }


    // EDIT PROFILE - isLogin
    static editProfile(req, res){
        let notif = req.query.success

        User.findByPk(req.session.userId)
        .then(data => {
            let adminAccess = req.session.adminAccess
            res.render("editprofile", {data, adminAccess, notif})
        })
        .catch(err => res.send(err))
    }

    // POST EDIT PROFILE - isLogin
    static postEditProfile(req, res){
        let {name, email, balance, id} = req.body
        // res.send(req.body)

        User.update({name: name, email: email}, {where: {id: id}})
        .then(data => {
            // res.send(data)
            let notif = `Edit successfully!`
            res.redirect(`/editprofile?success=${notif}`)
        })
        .catch(err => res.send(err))
    }


    // USER LIST
    static userlist(req, res) {
    
        User.findAll()
            // .then(data => res.send(data))
            .then(data => res.render("userslist", {data}))
            .catch(err => res.send(err))
    }


    // DELETE USER
    static deleteUser(req, res) {
        let id = req.params.id
    
        User.destroy({where: {id: id}})
            .then(data => res.redirect('/userslist'))
            .catch(err => res.send(err))
    }



    // LOGOUT
    static logout(req, res) {
    
            if (req.session) {

              req.session.destroy(err => {
                if (err) {
                  res.status(400).send('Unable to log out')
                } else {
                //   res.send('Logout successful')
                  res.redirect("/")
                }
              });

            } else {
              res.end()
            }

    }





}

module.exports = Controller