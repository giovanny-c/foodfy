const express = require("express")

const routes = express.Router()

const recipes = require("./app/controllers/recipes")
const site = require("./app/controllers/site")


//====ROTAS DO SITE=========

routes.get("/", site.index)
routes.get("/about", site.about)
routes.get("/recipes", site.recipes)
routes.get("/recipes/:id", site.recipe)

//===========================

//=====ROTAS DO ADMIN========

routes.get("/admin", function(req, res){

    return res.redirect("/admin/recipes")

})
routes.get("/admin/recipes", recipes.index)

routes.get("/admin/recipes/create", recipes.create) // Mostrar formulário de nova receita

routes.get("/admin/recipes/:id", recipes.show) // Exibir detalhes de uma receita

routes.get("/admin/recipes/:id/edit", recipes.edit) // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipes.post) // Cadastrar nova receita

routes.put("/admin/recipes", recipes.put) // Editar uma receita

routes.delete("/admin/recipes", recipes.delete) // Deletar uma receita


module.exports = routes

