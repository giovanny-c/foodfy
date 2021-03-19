
const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")
const Files = require("../models/Files")



//=====recipes======

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

exports.postRecipe = async function(req, res){

    filteredIngredients = req.body.ingredients.filter(function(ingredient){

        return ingredient != ""
        
    })

    filteredPreparation = req.body.preparation.filter(function(procedure){

        return procedure != ""
        
    })
    



    if(req.files.length == 0){
        return res.send("Please send at least one image")
    }


    req.body.ingredients = filteredIngredients
    req.body.preparation = filteredPreparation
    

    let results = await Recipes.create(req.body)
    const recipeId = results.rows[0].id


    const filesPromise = req.files.map(file => Files.createRecipeFiles({...file, recipe_id: recipeId}))
    await Promise.all(filesPromise)

    return res.redirect(`/admin/recipes/${recipeId}`)

   

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


//====chefs=======

exports.indexChefs = function(req, res){

    Chefs.all(function(chefs){

        return res.render("admin/chefs/chefs", {chefs})

    })

},

exports.showChef = function(req, res){
    
    

    Chefs.find(req.params.id, function(chef){

        Chefs.findRecipes(req.params.id, function(recipes){

            return res.render("admin/chefs/chef", {chef, recipes})

        })

        
    })
    

},

exports.createChef = function(req, res){


    return res.render("admin/chefs/create")

},


exports.postChef = function(req, res){

    Chefs.create(req.body, function(chef){

        return res.redirect(`/admin/chefs/${chef.id}`)

        
    })

},

exports.editChef = function(req, res){

    Chefs.find(req.params.id, function(chef){

        return res.render("admin/chefs/edit", {chef})

    })


},


exports.putChef = function(req, res){

    Chefs.update(req.body, function(){

        return res.redirect(`/admin/chefs/${req.body.id}`)

    })


    

},

exports.deleteChef = function(req, res){

    Chefs.delete(req.body.id, function(){

        return res.redirect("/admin/chefs")
    })

    

} 