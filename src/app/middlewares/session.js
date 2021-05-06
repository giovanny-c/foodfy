

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
            //procurar um jeito dele voltar para a pagina que estava
            //fazer em todas as rotas
        
        }

        next()

    }


    //MENSAGEMS

    
    //sucesso apos criar, atualizar ou deleter
    //OK recipes
    //OK users
    //chefs


    //TRYCATCH 
    //TUDO 

    //ENVIO DE EMAIL FUNCIONAL(real)

    

}