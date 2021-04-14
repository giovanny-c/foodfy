const express = require('express')
const routes = express.Router()

//===imports===
//controllers
const recipes = require("../app/controllers/recipes")
const chefs = require("../app/controllers/chefs")
const home = require("../app/controllers/home")
const search = require("../app/controllers/search")

//rotas site

routes.get("/", home.index)
routes.get("/about", home.about)


routes.get("/recipes", search.recipes)
routes.get("/recipes/:id", recipes.recipe)
routes.get("/chefs",chefs.chefs)



module.exports = routes