
const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")
const Files = require("../models/Files")




//=====recipes======

exports.indexRecipes = async function(req, res){

    let results = await Recipes.all()
    const recipes = results.rows
    
    return res.render("admin/index", {recipes})

    


},

exports.showRecipe = async function(req, res){
    
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

},

exports.createRecipe = async function(req, res){

    results = await Recipes.chefsSelectedOptions()
    const chefs = results.rows

    return res.render("admin/recipes/create", {chefs})

    

    

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


exports.editRecipe = async function(req, res){

    let results = await Recipes.find(req.params.id)
    const recipe = results.rows[0]

    if(!recipe) return res.send("recipe not found")

    results = await Recipes.chefsSelectedOptions()
    const chefs = results.rows

    results = await Recipes.files(recipe.id)
    let files = results.rows

    /**/
    files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    return res.render("admin/recipes/edit", {recipe, chefs, files})

},

exports.putRecipe = async function(req, res){
    
   

    const recipeId = req.body.id

    if(req.body.removed_files){//deletando fotos

        const removedFiles = req.body.removed_files.split(",")
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        

        const removedFilesPromise = removedFiles.map(fileId => Files.deleteRecipefiles(recipeId, fileId))
        
        
        await Promise.all(removedFilesPromise)
    }


    if(req.files.length != 0){//criando fotos

        const oldFiles = await Recipes.files(recipeId)
        const totalFiles = oldFiles.rows.length + req.files.length

        if(totalFiles <= 6){

            const newFilesPromise = req.files.map(file => {
                Files.createRecipeFiles({
                    ...file, recipe_id: recipeId
                })
            })

            await Promise.all(newFilesPromise)

        }


    }

    const filteredIngredients  = req.body.ingredients.filter(function(ingredient){
        return ingredient != ""    
    })

    const filteredPreparation = req.body.preparation.filter(function(procedure){
        return procedure != ""
    })

    req.body.ingredients = filteredIngredients
    req.body.preparation = filteredPreparation
     
    await Recipes.update(req.body) 

    return res.redirect(`/admin/recipes/${req.body.id}`)

},

exports.deleteRecipe = async function(req, res){


    let results = await Recipes.find(req.body.id)
    const recipe = results.rows[0]

    results =  await Recipes.files(recipe.id)
    let files = results.rows

    files = files.map(file => file.id)

    try {
        // removendo arquivos
        const removeFiles = files.map( id => Files.deleteRecipefiles(recipe.id, id))

        await Promise.all(removeFiles)

        // removendo receita        
        await Recipes.delete(req.body.id)
        
    } catch (err) {
        //new alert(`Nao foi possível deletar`)
        throw console.log(err)
        
    
    }

    return res.redirect("/admin/recipes")

    

}//ARRUMAR O DELETE PARA DELETAR AS IMAGENS TBM


//====chefs=======

exports.indexChefs = async function(req, res){

    let results = await Chefs.all()
    const chefs = results.rows

    return res.render("admin/chefs/chefs", {chefs})

    

},

exports.showChef = async function(req, res){

    let results = await Chefs.find(req.params.id)
    const chef = results.rows[0]

    

    results = await Chefs.file(chef.file_id)
    const image = results.rows[0]

    if(image) image.src = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
    
    results = await Chefs.findRecipes(req.params.id)
    const recipes = results.rows

    return res.render("admin/chefs/chef", {chef, recipes, image})


},

exports.createChef = function(req, res){


    return res.render("admin/chefs/create")

},


exports.postChef = async function(req, res){

    if(!req.file){

        return res.send("Envie uma imagem")
    }

    let results = await Files.createChefFile(req.file)
    const file_id = results.rows[0].id

    results = await Chefs.create(req.body, file_id)
    const chef = results.rows[0].id


    return res.redirect(`/admin/chefs/${chef}`)

        
    

},

exports.editChef = async function(req, res){

    let results = await Chefs.find(req.params.id)
    const chef = results.rows[0]

    return res.render("admin/chefs/edit", {chef})

},


exports.putChef = async function(req, res){
    
    const result = await Chefs.file(req.body.file_id)
    const oldPath = result.rows[0].path 

    console.log(req.file)
    console.log(req.body.file_id)


    if(req.file){ //atualiza a file que ta no banco 
       
        await Files.updateChefFile({...req.file, file_id: req.body.file_id, oldPath})
    
    }

    //faz o update
    await Chefs.update(req.body)

    return res.redirect(`/admin/chefs/${req.body.id}`)


},

exports.deleteChef = async function(req, res){

    const result = await Chefs.file(req.body.file_id)
    const path = result.rows[0].path 

    await Chefs.delete(req.body.id)

    await Files.deleteChefFiles(req.body.file_id, path)

    return res.redirect("/admin/chefs")
    

    

} 