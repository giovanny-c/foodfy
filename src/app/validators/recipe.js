const fs= require("fs")

function checkAllFields(body){
    //checkar se tem todos os campos

    let fields, name

    const keys = Object.keys(body)

    for(key of keys){          
        
        if(body[key] == ""){

            if(key == "name") name = key
                     
            fields = "vazio"
        }
           
        
    }

    if(fields) return{

        name
        
    }

    

}


module.exports = {
    post(req, res, next){

            //check se os campos foram preechidos
            const fillAllfields = checkAllFields(req.body)

            if(fillAllfields) {

               // remove as imagens do app que foram enviadas
                req.files.map( file => {fs.unlinkSync(file.path)})
                
                req.session.error = 'Preencha os campos obrigatórios'
                req.session.reqBody = req.body
                req.session.inputError = fillAllfields

                return res.redirect("/admin/recipes/create")

            }
            
            if(req.files.length == 0){


                req.session.error = "Envie pelo menos uma imagem."
                req.session.reqBody = req.body
    
                return res.redirect("/admin/recipes/create")
    
            }



            next()
    },
    
    put(req, res, next){


        if(!req.body.name){

            req.files.map( file => {fs.unlinkSync(file.path)})

            req.session.error = "Preencha os campos obrigatórios"
            req.session.reqBody = req.body
            req.session.inputError = "name"

            return res.redirect(`/admin/recipes/${req.body.id}/edit`)
        }

        if(req.body.removed_files && req.files.length == 0){

            req.session.error = "Deve haver pelo menos uma imagem da receita."
            req.session.reqBody = req.body

            return res.redirect(`/admin/recipes/${req.body.id}/edit`)

        }

        next()

    }
    
}