const Recipes = require("../models/Recipes")
const Chefs = require("../models/Chefs")
const Files = require("../models/Files")

//====site-chefs========

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



//====admin-chefs=======

exports.indexChefs = async function(req, res){

    let results = await Chefs.all()
    const chefs = results.rows

    if(!chefs) return res.send("chefs not found")


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

    return res.render("admin/chefs/create")

},

exports.editChef = async function(req, res){

    let results = await Chefs.find(req.params.id)
    const chef = results.rows[0]

    return res.render("admin/chefs/edit", {chef})

},


exports.postChef = async function(req, res){

    try {     

    if(!req.file){

        return res.render("admin/chefs/create", {
            chef: req.body,
            error: "Envie uma imagem."
        })
    }

    let results = await Files.createChefFile(req.file)
    const file_id = results.rows[0].id

    results = await Chefs.create(req.body, file_id)
    const chef = results.rows[0].id

    

    //fazer como feito no session.onlyAdmins e profile.index
    return res.redirect(`/admin/chefs/${chef}`)

    } catch (err) {
        return res.render("admin/chefs/create", {
            chef: req.body,
            error: "Algum erro ocorreu tente novamente"
        })
    }    
    
    
},

exports.putChef = async function(req, res){

    if(req.body.file_id){//se tiver uma imagem no bd

        const result = await Chefs.file(req.body.file_id)
        const oldPath = result.rows[0].path 
   

        if(req.file){ 
            //atualiza a file que ta no banco 
            await Files.updateChefFile({...req.file, file_id: req.body.file_id, oldPath})
        
        }
        
        await Chefs.update(req.body, req.body.file_id )

        

    } else { //se nao tiver uma imagem no bd

        if(!req.file){

            return res.send("send a image")
        }
        
        if(req.file){
            //cria um file novo
            let result = await Files.createChefFile({...req.file})
            const fileId = result.rows[0].id

            
        
            await Chefs.update(req.body, fileId)
    
        }
        
    }

        
    return res.redirect(`/admin/chefs/${req.body.id}`)


},

exports.deleteChef = async function(req, res){

    const result = await Chefs.file(req.body.file_id)
    const path = result.rows[0].path 

    await Chefs.delete(req.body.id)

    await Files.deleteChefFiles(req.body.file_id, path)

    return res.redirect("/admin/chefs")
    

    

} 