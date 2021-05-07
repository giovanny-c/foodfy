const fs= require("fs")




module.exports = {

    post(req, res, next){

        

            
            if(!req.body.name){

               // remove as imagens do app que foram enviadas
               
               if(req.file) fs.unlinkSync(req.file.path)
                
                req.session.error = 'Preencha os campos obrigatórios'
                req.session.reqBody = req.body
                req.session.inputError = "name"

                return res.redirect("/admin/chefs/create")

            } 



            next()
    },
    
    put(req, res, next){


        if(!req.body.name){

            if(req.file) fs.unlinkSync(req.file.path)

            

            req.session.error = "Preencha os campos obrigatórios"
            req.session.reqBody = req.body
            req.session.inputError = "name"

            return res.redirect(`/admin/chefs/${req.body.id}/edit`)
        }

        next()

    }
}