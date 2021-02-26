const data = require("../../../data.json")


//pagina inicial
exports.index = function(req, res){


    return res.render("site/index", {recipes: data.recipes})

}

//sobre
exports.about = function(req, res){

    return res.render("site/about")

}

//lista de receitas
exports.recipes = function(req, res){

    return res.render("site/recipes", {recipes: data.recipes})

}

//1 receita
exports.recipe = function(req, res){

    const id = req.params.id

    const recipe = data.recipes.find(rcp => rcp.id == id)

    

    return res.render("site/recipe", {recipe})

}