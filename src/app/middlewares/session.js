

module.exports = {

    onlyUsers(req, res, next){

        if(!req.session.userId){  

            return res.redirect("/")

            
        }

        next()
    },

    onlyAdmin(req, res, next){

        if(!req.session.isAdmin){

            req.session.error = 'Você não tem permissao para acessar esta página '
            //cria uma var na sessão


            return res.redirect("/admin/users/profile")//redireciona
            //procurar um jeito dele voltar para a pagina que estava
            //fazer em todas as rotas
        
        }

        next()

    }


    //MENSAGEMS

    //fazer como no onlyAdmin

    //pagina nao permitida
    //nao é admin
    //sucesso apos criar, atualizar ou deleter


    //TRYCATCH 
    //TUDO 

    //ENVIO DE EMAIL FUNCIONAL(real)

    

}