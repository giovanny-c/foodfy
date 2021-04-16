const express = require('express')
const routes = express.Router()

//===imports===
//controllers
const recipes = require("../app/controllers/recipes")
const chefs = require("../app/controllers/chefs")
const home = require("../app/controllers/home")
const search = require("../app/controllers/search")
const session = require("../app/controllers/session")

//rotas site

routes.get("/", home.index)
routes.get("/about", home.about)


routes.get("/recipes", search.recipes)
routes.get("/recipes/:id", recipes.recipe)
routes.get("/chefs", chefs.chefs)


//rotas de login
routes.get("/login", session.showLoginForm)
routes.post("/login", session.login)

routes.get("/forgot", session.showForgotForm)
routes.post("/forgot", session.recoveryPassword)

routes.get("/reset-password", session.showResetForm)
routes.post("/reset-password", session.resetPassword)


module.exports = routes