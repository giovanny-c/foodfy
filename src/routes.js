const express = require("express")

const routes = express.Router()

const admin = require("./app/controllers/admin")
const site = require("./app/controllers/site")


//====ROTAS DO SITE=========

routes.get("/", site.index)
routes.get("/about", site.about)
routes.get("/recipes", site.recipes)
routes.get("/recipes/:id", site.recipe)

//rotas site/chefs

//===========================

//=====ROTAS DO ADMIN========

routes.get("/admin", function(req, res){

    return res.redirect("/admin/recipes")

})
routes.get("/admin/recipes", admin.indexRecipes)

routes.get("/admin/recipes/create", admin.createRecipe) // Mostrar formulário de nova receita

routes.get("/admin/recipes/:id", admin.showRecipe) // Exibir detalhes de uma receita

routes.get("/admin/recipes/:id/edit", admin.editRecipe) // Mostrar formulário de edição de receita

routes.post("/admin/recipes", admin.postRecipe) // Cadastrar nova receita

routes.put("/admin/recipes", admin.putRecipe) // Editar uma receita

routes.delete("/admin/recipes", admin.deleteRecipe) // Deletar uma receita

//rotas admin/chefs


module.exports = routes

