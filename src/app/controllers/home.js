const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")



//pagina inicial
exports.index = async function(req, res){

    

    let results = await Recipes.all()
    const recipes = results.rows

    if(!recipes) return res.send("recipes not found")

    async function getImage(recipeId){

        let results = await Recipes.files(recipeId)
        const files = results.rows.map(file => `
            ${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        )

        return files[0]
    }

    const recipesPromise = recipes.map( async recipe => {
        recipe.image = await getImage(recipe.id)
        return recipe
    })

    const MostViewsRecipes = await Promise.all(recipesPromise)

    if(req.session.error){

        res.render("site/index", {
            recipes: MostViewsRecipes,
            error: req.session.error
        })
        
        req.session.error = ''       
        return 
    }
    
    return res.render("site/index", {recipes: MostViewsRecipes})
}

//sobre
exports.about = function(req, res){

    return res.render("site/about")

}