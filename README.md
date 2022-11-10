### PROJECT NAME : money_changerApp

### databasename : money_changerDB

## Page:

- landing page:
  Login v
  register v

- user page:
  Inventory/home page (required table Inventories & Users) v
  Edit name page & password & (email ?) (required table Users)
  Show currency page to shop/sell (required table Users & Currencies & (Inventories?))

- admin page:
  Edit currencies page <<<<<<<<< exists on currency page ripple:admin
  Users list to delete user <<<< exists on home page role :admin

## feature client :

-update inventory
-create transaction
-update name
-update balance

## feature admin :

-delete user
-update currencies

## package :

- bcryptjs v
- express v
- ejs v
- pg v
- sequelize v
- currency.js
- iplocation

## helper:

## hooks:

- password hashed

## chaining-method:

- viewProfile and viewCurrencies

## sort:

- sort by valueSell
- sort by valueBuy

## filter:

- min value
- max value

## static method:

- transactionBuy
- transactionSell

## instance method:

- symbolAdder (custom)
