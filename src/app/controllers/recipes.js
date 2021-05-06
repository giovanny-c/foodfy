const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")
const Files = require("../models/Files")
const fs = require('fs')

//=====site-recipes=======

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
    


    return res.render("site/recipe", {recipe, files})

    

}


//=====admin-recipes======

exports.indexRecipes = async function(req, res){

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

    const allRecipes = await Promise.all(recipesPromise)


    if(req.session.error) {

        res.render('admin/index', {
          recipes: allRecipes,
          error: req.session.error
        })

        req.session.error = ''
        return
    }

    return res.render("admin/index", {recipes: allRecipes})

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

    if(req.session.success) {

        res.render('admin/recipes/recipe', {
          recipe: recipe,
          files: files,
          success: req.session.success
        })

        req.session.success = ''
        return
    }


    if(req.session.error) {

        res.render('admin/recipes/recipe', {
          recipe: recipe,
          files: files,
          error: req.session.error,
          error2: req.session.error2
        })

        req.session.error = ''
        return
    }

    return res.render("admin/recipes/recipe", {recipe, files})

},

exports.createRecipe = async function(req, res){

    results = await Recipes.chefsSelectedOptions()
    const chefs = results.rows

    if(req.session.error) {

        res.render('admin/recipes/create', {
          chefs,
          recipe: req.session.reqBody,
          error: req.session.error
        })

        req.session.error = ''
        req.session.reqBody = ''
        return
    }

    
    return res.render("admin/recipes/create", {chefs})

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

    if(req.session.error) {

        res.render('admin/recipes/edit', {
          recipe: recipe,
          files: files,
          chefs: chefs,
          error: req.session.error
        })

        req.session.error = ''
        return
    }

    return res.render("admin/recipes/edit", {recipe, chefs, files})

},



exports.postRecipe = async function(req, res){

    
    try {

        filteredIngredients = req.body.ingredients.filter(function(ingredient){

            return ingredient != ""
            
        })

        filteredPreparation = req.body.preparation.filter(function(procedure){

            return procedure != ""
            
        })
        

        if(req.files.length == 0){


            req.session.error = "Envie pelo menos uma imagem."
            req.session.reqBody = req.body

            return res.redirect("/admin/recipes/create")

        }


        req.body.ingredients = filteredIngredients
        req.body.preparation = filteredPreparation
        
        const userId = req.session.userId

        let results = await Recipes.create(req.body, userId)
        const recipeId = results.rows[0].id

        try {

            const filesPromise = req.files.map(file => Files.createRecipeFiles({...file, recipe_id: recipeId}))
            await Promise.all(filesPromise)

            

        } catch (err) {
            console.error(err)
            //unlinksnc as imgs ficam salvas na aplicação

            req.session.error = "Receita criada. Não foi possível salvar as imagens"

            return res.redirect(`/admin/recipes/${recipeId}`)
        }
        

        req.session.success = "Receita criada com sucesso"

        return res.redirect(`/admin/recipes/${recipeId}`)

    } catch (err) {
        console.error(err)
//--
        req.session.error = "Algum erro aconteceu, tente novamente."
        req.session.reqBody = req.body


        return res.redirect("/admin/recipes/create")

    }

   

},

exports.putRecipe = async function(req, res){
    
   try {
       
        const recipeId = req.body.id

        let error

        if(req.body.removed_files){//deletando fotos    

            try {
            
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                

                const removedFilesPromise = removedFiles.map(fileId => Files.deleteRecipefiles(recipeId, fileId))              
                
                await Promise.all(removedFilesPromise)

                
        
            } catch (err) {
                console.error(err)

                error = "Erro ao deletar"

            }

        }


        if(req.files.length != 0){//criando fotos

            let updateError

            try {
                
                const oldFiles = await Recipes.files(recipeId)
                const totalFiles = oldFiles.rows.length + req.files.length

                if(totalFiles <= 6){

                    const newFilesPromise = req.files.map(file => {
                        try {
                            
                            Files.createRecipeFiles({
                                ...file, recipe_id: recipeId
                            })

                        } catch (err) {
                            console.error(err)

                            fs.unlinkSync(file.path)
                           
                            updateError = "Erro ao salvar imagens."
                        }
  
                    })

                    await Promise.all(newFilesPromise)
                }

               
                if (updateError){

                    if(error) error += " e salvar"

                    if(!error) error = "Erro ao salvarr"
                } 
                 

                
            } catch (err) {
                console.error(err)

                for(file in files){
                    fs.unlinkSync(file.path)
                }

                if(error) error += " e salvar"

                if(!error) error = "Erro ao salvar"
                
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


        req.session.success = "Receita atualizada com sucesso!"

        if(error){

            error += " imagens."

            req.session.error = error

            req.session.success = ''
        }

        return res.redirect(`/admin/recipes/${req.body.id}`)


    } catch (err) {
        console.error(err)

            req.session.error = "Erro inesperado. Tente novamente."
        
        return res.redirect(`/admin/recipes/${req.body.id}/edit`)
        
    }


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
        console.error(err)
        
    
    }

    return res.redirect("/admin/recipes")

    

}


