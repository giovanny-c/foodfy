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
               
               if(req.file) fs.unlinkSync(req.file.path)
                
                req.session.error = 'Preencha os campos obrigatórios'
                req.session.reqBody = req.body
                req.session.inputError = fillAllfields

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