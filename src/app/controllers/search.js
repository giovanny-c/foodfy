const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")
const Files = require("../models/Files")

//lista de receitas
exports.recipes = async function(req, res){

    let {filter, page, limit} = req.query

    page = page || 1
    limit = limit || 6
    let offset = limit * (page - 1)

    const params = {
        filter,
        page,
        limit,
        offset,
    }

    let results = await Recipes.paginate(params)
    const recipes = results.rows

    async function getImage(recipeId){
        let results = await Recipes.files(recipeId)
        const files = results.rows.map( file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
        
        return files[0]
    }

    const recipesPromise = recipes.map(async recipe => {
        recipe.image = await getImage(recipe.id)
        
        return recipe
    })

    const foundRecipes = await Promise.all(recipesPromise)

     


    if(recipes == ""){//se a busca nao achar nada 
        
        return res.render("site/recipes", {recipes, filter}) 

    }else{

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        return res.render("site/recipes", {recipes: foundRecipes, pagination, filter})

    }

    
}
