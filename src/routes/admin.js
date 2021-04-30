const express = require('express')
const routes = express.Router()

//===imports===
//controllers
const recipes = require("../app/controllers/recipes")
const chefs = require("../app/controllers/chefs")
const user = require("../app/controllers/user")

//middlewares
const multer = require("../app/middlewares/multer")

//validators

const userValidator = require("../app/validators/user")



//rotas admin/recipes

routes.get("/", function(req, res){

    return res.redirect("admin/recipes")

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

//rotas admin/users

// Rotas de perfil de um usuário logado
//routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
//routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', user.listUsers) // Mostrar a lista de usuários cadastrados
routes.post('/users', userValidator.post, user.post) // Cadastrar um usuário
routes.get('/users/create',  user.createUser) // Mostrar o formulário de criação de um usuário
//routes.put('/admin/users/:id', UserController.put) // Editar um usuário
//routes.get('/admin/users/:id/edit', UserController.edit) // Mostrar o formulário de edição de um usuário
//routes.delete('/admin/users/:id', UserController.delete) // Deletar um usuário


module.exports = routes