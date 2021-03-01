const data = require("../../../data.json")
const Recipes = require("../models/Recipes")

const fs = require("fs")



exports.indexRecipes = function(req, res){

    Recipes.all(function(recipes){

        return res.render("admin/index", {recipes})

    })


},

exports.showRecipe = function(req, res){
    
    const id = req.params.id

    Recipes.find(id, function(recipe){

        return res.render("admin/recipes/recipe", {recipe})
    })


    

},

exports.createRecipe = function(req, res){

    Recipes.chefsSelectedOptions(function(chefs){

        return res.render("admin/recipes/create", {chefs})

    })

    

},

exports.postRecipe = function(req, res){

    filteredIngredients = req.body.ingredients.filter(function(ingredient){

        return ingredient != ""
        
    })

    filteredPreparation = req.body.preparation.filter(function(procedure){

        return procedure != ""
        
    })

    req.body.ingredients = filteredIngredients
    req.body.preparation = filteredPreparation
    

    Recipes.create(req.body, function(recipe){

        return res.redirect(`/admin/recipes/${recipe.id}`)

    })  

},


exports.editRecipe = function(req, res){

    Recipes.find(req.params.id, function(recipe){

        if(!recipe) return res.send("recipe not found")

        Recipes.chefsSelectedOptions(function(chefs){

            return res.render("admin/recipes/edit", {recipe, chefs})

        })

    })



    

},

exports.putRecipe = function(req, res){


    const filteredIngredients  = req.body.ingredients.filter(function(ingredient){

        return ingredient != ""
        
    })

    const filteredPreparation = req.body.preparation.filter(function(procedure){

        return procedure != ""
        
    })


    req.body.ingredients = filteredIngredients
    req.body.preparation = filteredPreparation

     
    Recipes.update(req.body, function(){

        return res.redirect(`/admin/recipes/${req.body.id}`)

    })


        


    

},

exports.deleteRecipe = function(req, res){

    Recipes.delete(req.body.id, function(){

        return res.redirect("/admin/recipes")

    })

}