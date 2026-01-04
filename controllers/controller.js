const { User, Inventory, Currency, Transaction } = require("../models");
const { Op } = require("sequelize");
const Bcrypt = require("Bcrypt");
const addSymbol = require("../helpers/symbolAdder");

function greet(name, hour) {
  const period = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return `Good ${period}, ${name}!`;
}

class Controller {
  // INDEX
  static index(req, res) {
    let adminAccess = req.session.adminAccess;

    Currency.findAll()
      .then((data) => res.render("index", { data, adminAccess, addSymbol }))
      .catch((err) => res.send(err));
  }

  // SIGNUP - GET
  static signup(req, res) {
    let errors;
    if (req.query.error) {
      errors = req.query.error.split(",");
    }
    console.log(errors);
    User.findAll()
      .then((data) => res.render("signup", { data, errors }))
      .catch((err) => res.send(err));
  }

  // SIGNUP - POST
  static postSignup(req, res) {
    let { name, email, password, role } = req.body;
    let obj = { name, email, password, role };

    User.create(obj, { returning: ["*"] })
      .then((data) => {
        Inventory.create({ UserId: data.id });
        res.redirect("/signin");
      })
      .catch((err) => {
        if (err.name == "SequelizeValidationError") {
          let errors = err.errors.map((el) => {
            return el.message;
          });
          // res.send(errors)
          res.redirect(`/signup?error=${errors}`);
        } else {
          res.send(err);
        }
      });
  }

  // SIGNIN - GET
  static signin(req, res) {
    let error = req.query.error;

    if (req.session.adminAccess === false) {
      res.redirect("/home");
    } else if (req.session.adminAccess === true) {
      res.redirect("/userslist");
    }

    res.render("signin", { error }); // TEST
  }

  // SIGNIN - POST
  static postSignin(req, res) {
    let { email, password } = req.body;

    User.findOne({ where: { email: email } })
      // .then(data => res.redirect("/signup"))
      .then((data) => {
        if (data) {
          let isPassword = Bcrypt.compareSync(password, data.password);
          // console.log(isPassword);
          // console.log(password, data.password);
          if (isPassword) {
            req.session.userId = data.id; // call session
            req.session.role = data.role;
            // res.send("Berhasil Login!")
            // res.send(data)

            res.redirect("/home");
          } else {
            res.redirect("/signin?error=Password SALAH");
          }
        } else {
          res.redirect("/signin?error=Failed");
        }
      })
      .catch((err) => res.send(err));
  }

  // ADMIN - GET
  static admin(req, res) {
    let error = req.query.error;
    if (req.session.adminAccess === false) {
      res.redirect("/home");
    } else if (req.session.adminAccess === true) {
      res.redirect("/userslist");
    }
    res.render("admin", { error }); // TEST
  }

  // ADMIN - POST
  static postAdmin(req, res) {
    let { email, password } = req.body;

    User.findOne({ where: { email: email } })
      .then((data) => {
        if (data) {
          let isPassword = Bcrypt.compareSync(password, data.password);
          if (isPassword) {
            req.session.userId = data.id; // call session
            req.session.role = data.role;
            res.redirect("/userslist");
          } else {
            res.redirect("/signin?error=Password SALAH");
          }
        } else {
          res.redirect("/signin?error=Failed");
        }
      })
      .catch((err) => res.send(err));
  }

  // HOME - isLogin
  static viewHome(req, res) {
    let transaction = req.query.transaction;

    const hour = new Date().getHours();

    User.findByPk(req.session.userId, { include: [Inventory, Transaction] })
      .then((data) => {
        let adminAccess = req.session.adminAccess;
        let greeting = greet(data.name, hour);
        res.render("home", {
          data,
          adminAccess,
          greeting,
          transaction,
          addSymbol,
        });
      })
      .catch((err) => res.send(err));
  }

  // EDIT PROFILE - isLogin
  static editProfile(req, res) {
    let notif = req.query.success;

    User.findByPk(req.session.userId)
      .then((data) => {
        let adminAccess = req.session.adminAccess;
        res.render("editprofile", { data, adminAccess, notif });
      })
      .catch((err) => res.send(err));
  }

  // POST EDIT PROFILE - isLogin
  static postEditProfile(req, res) {
    let { name, email, balance, id } = req.body;
    // res.send(req.body)

    User.update({ name: name, email: email }, { where: { id: id } })
      .then((data) => {
        // res.send(data)
        let notif = `Edit successfully!`;
        res.redirect(`/editprofile?success=${notif}`);
      })
      .catch((err) => res.send(err));
  }

  // USER LIST
  static userlist(req, res) {
    if (req.session.adminAccess == false) {
      res.redirect("/home");
    }
    User.findAll()
      // .then(data => res.send(data))
      .then((data) => res.render("userslist", { data, addSymbol }))
      .catch((err) => res.send(err));
  }

  // DELETE USER
  static deleteUser(req, res) {
    let id = req.params.id;
    Transaction.destroy({ where: { UserId: id } })
      .then((data) => {
        Inventory.destroy({ where: { UserId: id } });
        return User.destroy({ where: { id: id } });
      })
      .then((data) => res.redirect("/userslist"))
      .catch((err) => res.send(err));
  }

  // LOGOUT
  static logout(req, res) {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.status(400).send("Unable to log out");
        } else {
          //   res.send('Logout successful')
          res.redirect("/");
        }
      });
    } else {
      res.end();
    }
  }

  static viewCurrencies(req, res) {
    let invalidMsg = {};
    let option = {};
    // console.log(req.query.min, req.query.max);
    if (req.query.filterby) {
      let filterBy = req.query;
      let minValue = +req.query.min;
      let maxValue = +req.query.max;
      if (minValue > 0 && maxValue > 0) {
        if (minValue >= maxValue) {
          invalidMsg.failedFilter = `minimum value must be lower than max value`;
        }
        console.log(filterBy.filterby, minValue, maxValue);
        option.where = {
          [filterBy.filterby]: { [Op.between]: [minValue, maxValue] },
        };
      } else {
        invalidMsg.failedFilter = `all input is required when filter is used`;
      }
    }
    if (req.query.sort) {
      option.order = [[req.query.sort, "DESC"]];
    }
    if (req.query.invalidinput) {
      invalidMsg.msg = req.query.invalidinput;
    }
    let currencies;
    Currency.findAll(option)
      .then((data) => {
        currencies = data;
        let id = req.session.userId;
        return User.findByPk(id, {
          include: [Inventory],
        });
      })
      .then((data) => {
        let adminAccess = req.session.adminAccess;
        res.render("currencies", {
          currencies,
          data,
          adminAccess,
          addSymbol,
          invalidMsg,
        });
      })
      .catch((error) => {
        res.send(error);
      });
  }

  static transactionBuy(req, res) {
    let { transactionAmount } = req.body;
    let { id } = req.params;
    let { userId } = req.session;
    let userData;
    if (+transactionAmount < 1) {
      res.redirect(
        `/currencies?invalidinput=Input value must be greater than zero`
      );
      return;
    }
    // console.log(transactionAmount);
    User.findByPk(userId, { include: [Inventory] })
      .then((data) => {
        userData = data;
        return Currency.findByPk(id);
      })
      .then((data) => {
        // console.log(data);
        return Transaction.transactionBuy(data, transactionAmount, userData);
      })
      .then((result) => {
        if (result == false) {
          res.redirect(`/home?transaction=transaction failed`);
          return;
        }
        User.update({ balance: result[0] }, { where: { id: userId } });
        let currencyName = result[1];
        Inventory.update(
          { [currencyName]: result[2] },
          { where: { UserId: userId } }
        );
        // console.log;
        Transaction.create({
          transactionAmount,
          transactionType: "Buy",
          CurrencyId: id,
          UserId: userId,
        });
        res.redirect("/home?transaction=success");
      })
      .catch((error) => {
        res.send(error);
      });
  }

  static transactionSell(req, res) {
    let { transactionAmount } = req.body;
    let { id } = req.params;
    let { userId } = req.session;
    let userData;
    if (+transactionAmount < 1) {
      res.redirect(
        `/currencies?invalidinput=Input value must be greater than zero`
      );
      return;
    }
    // console.log(transactionAmount);
    User.findByPk(userId, { include: [Inventory] })
      .then((data) => {
        userData = data;
        return Currency.findByPk(id);
      })
      .then((data) => {
        // console.log(data);
        return Transaction.transactionSell(data, transactionAmount, userData);
      })
      .then((result) => {
        if (result == false) {
          res.redirect(`/home?transaction=transaction failed`);
          return;
        }
        User.update({ balance: result[0] }, { where: { id: userId } });
        let currencyName = result[1];
        Inventory.update(
          { [currencyName]: result[2] },
          { where: { UserId: userId } }
        );
        // console.log;
        Transaction.create({
          transactionAmount,
          transactionType: "Sell",
          CurrencyId: id,
          UserId: userId,
        });
        res.redirect("/home?transaction=success");
      })
      .catch((error) => {
        res.send(error);
      });
  }

  static modifyCurrency(req, res) {
    let { valueSell, valueBuy } = req.body;
    let { id } = req.params;
    // console.log(valueSell, valueBuy);

    if (+valueSell <= 0 || +valueBuy <= 0) {
      // console.log(`test`);
      res.redirect(
        "/currencies?invalidinput=Input value must be greater than zero"
      );
      return;
    }
    if (req.session.adminAccess == true) {
      Currency.update({ valueSell, valueBuy }, { where: { id } })
        .then((_) => {
          res.redirect("/currencies");
        })
        .catch((error) => {
          res.send(error);
        });
    }
  }
}

module.exports = Controller;
