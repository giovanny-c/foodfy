const fs= require("fs")
const { files } = require("../models/Recipes")


module.exports = {
    post(req, res, next){

            
            if(!req.body.name){

               // remove as imagens do app que foram enviadas
                req.files.map( file => {fs.unlinkSync(file.path)})
                
                req.session.error = 'Preencha os campos obrigatórios'
                req.session.reqBody = req.body
                req.session.inputError = "name"

                return res.redirect("/admin/recipes/create")

            }
            
            if(req.files.length == 0){


                req.session.error = "Envie pelo menos uma imagem."
                req.session.reqBody = req.body
    
                return res.redirect("/admin/recipes/create")
    
            }



            next()
    },
    
    async put(req, res, next){


            const recipeId = req.body.id    

            const results = await files(recipeId)

        if(!req.body.name){

            req.files.map( file => {fs.unlinkSync(file.path)})

            req.session.error = "Preencha os campos obrigatórios"
            req.session.reqBody = req.body
            req.session.inputError = "name"

            return res.redirect(`/admin/recipes/${req.body.id}/edit`)
        }


        if(req.body.removed_files == 0 && req.files.length == 0 && results.rowCount == 0){

            

            req.session.error = "Deve haver pelo menos uma imagem da receita."
            req.session.reqBody = req.body

            return res.redirect(`/admin/recipes/${req.body.id}/edit`)

        }

        next()

    }
    
}