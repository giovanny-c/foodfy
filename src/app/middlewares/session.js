

module.exports = {

    onlyUsers(req, res, next){

        if(!req.session.userId){ 
            
            req.session.error = 'Apenas usúarios cadastrados tem permissão para acessar esta página'

            let back

            if(req.headers.referer){

                back = req.headers.referer
            }
            
            if(!req.headers.referer){

                back = "/"
            }

            return res.redirect(back)

            
        }

        next()
    },

    onlyAdmin(req, res, next){
                

        if(!req.session.isAdmin){

            req.session.error = 'Apenas administradores podem acessar esta página.'
            //cria uma var na sessão

            let back

 
            if(req.headers.referer){

                back = req.headers.referer
            }
            
            if(!req.headers.referer){

                back = "/admin"
            }

            return res.redirect(back)
            
        
        }

        next()

    }

    



    

    

    

    

}