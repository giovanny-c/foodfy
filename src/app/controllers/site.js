
const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")



//pagina inicial
exports.index = async function(req, res){

    let results = await Recipes.all()
    const recipes = results.rows

    return res.render("site/index", {recipes})
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

    if(recipes == ""){//se a busca nao achar nada 
        
        return res.render("site/recipes", {recipes, filter}) 

    }else{

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        return res.render("site/recipes", {recipes, pagination, filter})

    }

    

   
}

//1 receita
exports.recipe = async function(req, res){

    const id = req.params.id

    let results = await Recipes.find(id)
    const recipe = results.rows[0]

    return res.render("site/recipe", {recipe})

    

}

exports.chefs = async function(req, res){

    let results = await Chefs.all()
    const chefs = results.rows

        return res.render("site/chefs", {chefs})

    

    

}