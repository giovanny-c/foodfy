const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")
const Files = require("../models/Files")
const fs = require('fs')



//====site-chefs========

exports.chefs = async function(req, res){

    let results = await Chefs.all()
    const chefs = results.rows

    

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



//====admin-chefs=======

exports.indexChefs = async function(req, res){

    let results = await Chefs.all()
    const chefs = results.rows



    async function getImage(chefId){//func para pegar a imagem

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

    
    if(req.session.success) {
        
        res.render('admin/chefs/chefs', {
            chefs: chefsList,
            success: req.session.success
        })
        
        req.session.success = ''
        return
    }
    
    if(req.session.error) {

        res.render('admin/chefs/chefs', {
          chefs: chefsList,
          error: req.session.error
        })

        req.session.error = ''
        return
    }


    return res.render("admin/chefs/chefs", {chefs: chefsList})
    

},

exports.showChef = async function(req, res){

    let results = await Chefs.find(req.params.id)
    const chef = results.rows[0]


    if(!chef){
        req.session.error = "Chef não encontrado."
        return res.redirect("/admin/chefs")
    }


    results = await Chefs.file(chef.file_id)
    const image = results.rows[0]

    if(image) image.src = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
    

    results = await Chefs.findRecipes(req.params.id)
    const recipes = results.rows

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


    if(req.session.success) {

        res.render('admin/chefs/chef', {
          chef,
          recipes: allRecipes,
          image,
          success: req.session.success
        })

        req.session.success = ''
        return
    }

    if(req.session.error) {

        res.render('admin/chefs/chef', {
          chef,
          recipes: allRecipes,
          image,
          error: req.session.error
        })

        req.session.error = ''
        return
    }

    return res.render("admin/chefs/chef", {chef, recipes: allRecipes, image})


},

exports.createChef = function(req, res){


    if(req.session.error) {

        res.render('admin/chefs/create', {
          chef: req.session.reqBody,
          error: req.session.error
        })

        req.session.error = ''
        req.session.reqBody = ''
        return
    }

    return res.render("admin/chefs/create")

},

exports.editChef = async function(req, res){



    let results = await Chefs.find(req.params.id)
    const chef = results.rows[0]

    if(!chef){
        req.session.error = "Chef não encontrado."
        return res.redirect("/admin/chefs")
    }

    if(req.session.error) {

        res.render('admin/chefs/edit', {
          chef,
          error: req.session.error
        })

        req.session.error = ''
        return
    }

    return res.render("admin/chefs/edit", {chef})

},


exports.postChef = async function(req, res){

    try {     

    if(!req.file){

        req.session.error = "Envie uma imagem."
        req.session.reqBody = req.body

        return res.redirect("/admin/chefs/create")
    }

    
    let results

    try {
        
        results = await Files.createChefFile(req.file)
        

    } catch (err) {
        console.error(err)

        fs.unlinkSync(req.file.path)

        req.session.error = "A imagem nao pode ser salva. Tente novamente."
    
        req.session.reqBody = req.body

        return res.redirect(`/admin/chefs/create`)
    }

    const file_id = results.rows[0].id || ""

    results = await Chefs.create(req.body, file_id)
    const chef = results.rows[0].id

    req.session.success = "Chef cadastrado com sucesso!"

    
    return res.redirect(`/admin/chefs/${chef}`)

    } catch (err) {
        console.error(err)
//--
        req.session.error = "Algum erro aconteceu, Tente novamente."
        req.session.reqBody = req.body


        return res.redirect("/admin/chefs/create")
    }    
    
    
},

exports.putChef = async function(req, res){

    try {

    if(req.body.file_id){//se tiver uma imagem no bd

        const result = await Chefs.file(req.body.file_id)
        const oldPath = result.rows[0].path 
   

        if(req.file){ 
            //atualiza a file que ta no banco 
            try {
                await Files.updateChefFile({...req.file, file_id: req.body.file_id, oldPath})
            
            } catch (err) {
                console.error(err)

                fs.unlinkSync(req.file.path)

                req.session.error = "A imagem nao pode ser salva. tente novamente"
            
                req.session.reqBody = req.body

                return res.redirect(`/admin/chefs/${req.body.id}/edit`)
            }
        
        }
        
        await Chefs.update(req.body, req.body.file_id )

        

    } else { //se nao tiver uma imagem no bd

        if(!req.file){

            req.session.error = "Envie uma imagem."
            req.session.reqBody = req.body
    
            return res.redirect(`/admin/chefs/${req.body.id}/edit`)
        }
    
        
        if(req.file){
            //cria um file novo

            let results

        try {
            
            results = await Files.createChefFile(req.file)
            

        } catch (err) {
            console.error(err)

            fs.unlinkSync(req.file.path)

            req.session.error = "A imagem nao pode ser salva. Tente novamente."
        
            req.session.reqBody = req.body

            return res.redirect(`/admin/chefs/${req.body.id}/edit`)
        }

        const fileId = results.rows[0].id || ""

            
        
            await Chefs.update(req.body, fileId)
    
        }
        
    }


    req.session.success = "Chef atualizado com sucesso!"

    return res.redirect(`/admin/chefs/${req.body.id}`)


    } catch (err) {
        console.error(err)

        req.session.error = "Algum erro aconteceu, Tente novamente."
        return res.redirect(`/admin/chefs/${req.body.id}`)
    }

},

exports.deleteChef = async function(req, res){

    try {
        
        if(req.body.recipes > 0){

            req.session.error = "Você não pode deletar um chef com receitas."
            req.session.reqBody = req.body
    
            return res.redirect(`/admin/chefs/${req.body.id}/edit`)
        }

        const result = await Chefs.file(req.body.file_id)
        const file = result.rows[0]
        
        await Chefs.delete(req.body.id)
            
        try {

            Files.deleteChefFiles(file.id)
            fs.unlinkSync(file.path)
        } catch (err) {
            console.error(err)
        }

        req.session.success = "Chef deletado com sucesso!"

        return res.redirect("/admin/chefs")

    
    } catch (err) {
        console.error(err)

        req.session.error = "Não foi possivel deletar o chef. Tente novamente."
        return res.redirect(`/admin/chefs/${req.body.id}`)
    }
    

} 