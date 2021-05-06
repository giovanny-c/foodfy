const express = require('express')
const routes = express.Router()

//===imports===
//controllers
const recipes = require("../app/controllers/recipes")
const chefs = require("../app/controllers/chefs")
const user = require("../app/controllers/user")
const profile = require("../app/controllers/profile")


//middlewares
const multer = require("../app/middlewares/multer")

//validators
const userValidator = require("../app/validators/user")
const session = require("../app/middlewares/session")



//rotas admin/recipes

routes.get("/", function(req, res){

    return res.redirect("admin/recipes")

})
routes.get("/recipes", session.onlyUsers, recipes.indexRecipes)

routes.get("/recipes/create", session.onlyUsers, recipes.createRecipe) // Mostrar formulário de nova receita

routes.get("/recipes/:id", session.onlyUsers, recipes.showRecipe) // Exibir detalhes de uma receita

routes.get("/recipes/:id/edit", session.onlyUsers, userValidator.isFromUser, recipes.editRecipe) // Mostrar formulário de edição de receita

routes.post("/recipes", session.onlyUsers, multer.array("photos", 5), recipes.postRecipe) // Cadastrar nova receita

routes.put("/recipes", session.onlyUsers, multer.array("photos", 5), userValidator.isFromUser , recipes.putRecipe) // Editar uma receita

routes.delete("/recipes", session.onlyUsers, userValidator.isFromUser, recipes.deleteRecipe) // Deletar uma receita

//rotas admin/chefs

routes.get("/chefs", session.onlyUsers, chefs.indexChefs)

routes.get("/chefs/create", session.onlyAdmin, chefs.createChef) // Mostrar formulário de novo chef

routes.get("/chefs/:id", session.onlyUsers, chefs.showChef) // Exibir detalhes de uma chef

routes.get("/chefs/:id/edit", session.onlyAdmin, chefs.editChef) // Mostrar formulário de edição de chef

routes.post("/chefs", session.onlyAdmin, multer.single("photo"), chefs.postChef) // Cadastrar novo chef

routes.put("/chefs", session.onlyAdmin, multer.single("photo"), chefs.putChef) // Editar um chef

routes.delete("/chefs", session.onlyAdmin, chefs.deleteChef)

//rotas admin/users

// Rotas de perfil de um usuário logado
routes.get('/users/profile', session.onlyUsers, profile.index) // Mostrar o formulário com dados do usuário logado
routes.put('/users/profile', session.onlyUsers, userValidator.profilePut, profile.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', session.onlyAdmin, user.listUsers) // Mostrar a lista de usuários cadastrados
routes.post('/users', session.onlyAdmin, userValidator.post, user.post) // Cadastrar um usuário
routes.get('/users/create', session.onlyAdmin,  user.createUser) // Mostrar o formulário de criação de um usuário

routes.put('/users/:id', session.onlyAdmin, userValidator.edit, user.put) // Editar um usuário

routes.get('/users/:id/edit', session.onlyAdmin, user.editUser) // Mostrar o formulário de edição de um usuário
routes.delete('/users/:id', session.onlyAdmin, userValidator.adminPreventDelete, user.delete) // Deletar um usuário


module.exports = routes