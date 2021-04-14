const express = require('express')
const routes = express.Router()

//===imports===
//controllers
const recipes = require("../app/controllers/recipes")
const chefs = require("../app/controllers/chefs")

//middlewares
const multer = require("../app/middlewares/multer")



//rotas admin/recipes

routes.get("/", function(req, res){

    return res.redirect("/recipes")

})
routes.get("/recipes", recipes.indexRecipes)

routes.get("/recipes/create", recipes.createRecipe) // Mostrar formulário de nova receita

routes.get("/recipes/:id", recipes.showRecipe) // Exibir detalhes de uma receita

routes.get("/recipes/:id/edit", recipes.editRecipe) // Mostrar formulário de edição de receita

routes.post("/recipes", multer.array("photos", 5), recipes.postRecipe) // Cadastrar nova receita

routes.put("/recipes", multer.array("photos", 5), recipes.putRecipe) // Editar uma receita

routes.delete("/recipes", recipes.deleteRecipe) // Deletar uma receita

//rotas admin/chefs

routes.get("/chefs", chefs.indexChefs)

routes.get("/chefs/create", chefs.createChef) // Mostrar formulário de novo chef

routes.get("/chefs/:id", chefs.showChef) // Exibir detalhes de uma chef

routes.get("/chefs/:id/edit", chefs.editChef) // Mostrar formulário de edição de chef

routes.post("/chefs", multer.single("photo"), chefs.postChef) // Cadastrar novo chef

routes.put("/chefs", multer.single("photo"), chefs.putChef) // Editar um chef

routes.delete("/chefs", chefs.deleteChef)


module.exports = routes