
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

    return res.render("site/index", {recipes: MostViewsRecipes})
}

//sobre
exports.about = function(req, res){

    return res.render("site/about")

}

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

//1 receita
exports.recipe = async function(req, res){

    const id = req.params.id

    let results = await Recipes.find(id)
    const recipe = results.rows[0]

    if(!recipe) return res.send("product not found")

    results = await Recipes.files(recipe.id)
    const files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))


    return res.render("admin/recipes/recipe", {recipe, files})

    

}

exports.chefs = async function(req, res){

    let results = await Chefs.all()
    const chefs = results.rows

    if(!chefs) return res.send("chefs not found")

    async function getImage(chefId){

        let results = await Chefs.file(chefId)
        const files = results.rows.map(file => `
            ${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        )
        
        return files[0]
    }


    const chefsPromise = chefs.map( async chef => {
        chef.image = await getImage(chef.file_id)
        return chef
    })

    const chefsList = await Promise.all(chefsPromise)

    


    return res.render("site/chefs", {chefs: chefsList})

    

    

}