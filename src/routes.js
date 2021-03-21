const express = require("express")

const routes = express.Router()

const admin = require("./app/controllers/admin")
const site = require("./app/controllers/site")

const multer = require("./app/middlewares/multer")


//====ROTAS DO SITE=========

routes.get("/", site.index)
routes.get("/about", site.about)
routes.get("/recipes", site.recipes)
routes.get("/recipes/:id", site.recipe)
routes.get("/chefs",site.chefs)
//rotas site/chefs

//===========================

//=====ROTAS DO ADMIN========

//rotas admin/recipes

routes.get("/admin", function(req, res){

    return res.redirect("/admin/recipes")

})
routes.get("/admin/recipes", admin.indexRecipes)

routes.get("/admin/recipes/create", admin.createRecipe) // Mostrar formulário de nova receita

routes.get("/admin/recipes/:id", admin.showRecipe) // Exibir detalhes de uma receita

routes.get("/admin/recipes/:id/edit", admin.editRecipe) // Mostrar formulário de edição de receita

routes.post("/admin/recipes", multer.array("photos", 5), admin.postRecipe) // Cadastrar nova receita

routes.put("/admin/recipes", multer.array("photos", 5), admin.putRecipe) // Editar uma receita

routes.delete("/admin/recipes", admin.deleteRecipe) // Deletar uma receita

//rotas admin/chefs

routes.get("/admin/chefs", admin.indexChefs)

routes.get("/admin/chefs/create", admin.createChef) // Mostrar formulário de novo chef

routes.get("/admin/chefs/:id", admin.showChef) // Exibir detalhes de uma chef

routes.get("/admin/chefs/:id/edit", admin.editChef) // Mostrar formulário de edição de chef

routes.post("/admin/chefs", multer.single("photo"), admin.postChef) // Cadastrar novo chef

routes.put("/admin/chefs", multer.single("photo"), admin.putChef) // Editar um chef

routes.delete("/admin/chefs", admin.deleteChef)




module.exports = routes

