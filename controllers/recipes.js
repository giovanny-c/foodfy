const data = require("../data.json")

const fs = require("fs")



exports.index = function(req, res){

    return res.render("admin/index", {recipes: data.recipes})


}


exports.show = function(req, res){
    
    const id = req.params.id

    const recipe = data.recipes.find( rcp => rcp.id == id)

    return res.render("admin/recipe", {recipe})

}


exports.create = function(req, res){

    return res.render("admin/create")

}

exports.edit = function(req, res){

    const id = req.params.id

    const recipe = data.recipes.find( rcp => rcp.id == id) 
    
    
   /* if(!recipe){
        return res.send("not")
    }
*/


    return res.render("admin/edit", {recipe})

}


exports.post = function(req, res){

    
    let id = 1

    const lastRecipe = data.recipes[data.recipes.length - 1]

    if(lastRecipe){

        id = lastRecipe.id + 1

    }


    const filteredIngredients  = req.body.ingredients.filter(function(ingredient){

        return ingredient != "";
        
    });

    const filteredPreparation = req.body.preparation.filter(function(procedure){

        return procedure != "";
        
    });


    req.body.ingredients = filteredIngredients
    req.body.preparation = filteredPreparation

    

    data.recipes.push({
        id,
        ...req.body,
        ingredients: filteredIngredients,
        preparation: filteredPreparation
        


    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){

        if(err) return res.send("write file error")

        return res.redirect("/admin/recipes")

    })
    
    

    

}



exports.put = function(req, res){

    const {id} = req.body

    let index = 0

    const foundRecipe = data.recipes.find( function(recipe, foundIndex){

        if(id == recipe.id){

            index = foundIndex
            return true

        }


    })

    const filteredIngredients  = req.body.ingredients.filter(function(ingredient){

        return ingredient != "";
        
    });

    const filteredPreparation = req.body.preparation.filter(function(procedure){

        return procedure != "";
        
    });


    req.body.ingredients = filteredIngredients
    req.body.preparation = filteredPreparation

    

    if(!foundRecipe) return res.send("Recipe not found")

    const recipe = {
        id: Number(req.body.id),
        ...foundRecipe,
        ...req.body,
        ingredients: filteredIngredients,
        preparation: filteredPreparation

    }

    data.recipes[index] = recipe

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){

        if(err) return res.send("write file error")

        return res.redirect(`/admin/recipes/${id}`)


    })

}

exports.delete = function(req, res){

    const {id} = req.body

    const filterdRecipes = data.recipes.filter(function(recipe){

        return recipe.id != id

    })

    data.recipes = filterdRecipes

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){

        if(err) return res.send("write file error")

        return res.redirect("/admin/recipes")

    })

}