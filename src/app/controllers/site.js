const data = require("../../../data.json")
const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")



//pagina inicial
exports.index = function(req, res){

    Recipes.all(function(recipes){

        return res.render("site/index", {recipes})

    })

            


}

//sobre
exports.about = function(req, res){

    return res.render("site/about")

}

//lista de receitas
exports.recipes = function(req, res){

    let {filter, page, limit} = req.query

    page = page || 1
    limit = limit || 6
    let offset = limit * (page - 1)

    const params = {
        filter,
        page,
        limit,
        offset,
        callback(recipes){

            if(recipes == ""){
                
                return res.render("site/recipes", {recipes, filter})

            }else{

                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render("site/recipes", {recipes, pagination, filter})

            }

            

        }

    }

    Recipes.paginate(params)

}

//1 receita
exports.recipe = function(req, res){

    const id = req.params.id

    Recipes.find(id, function(recipe){

        return res.render("site/recipe", {recipe})
    })

    

}

exports.chefs = function(req, res){

    Chefs.all(function(chefs){

        return res.render("site/chefs", {chefs})

    })

    

}