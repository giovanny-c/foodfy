

module.exports = {

    onlyUsers(req, res, next){

        if(!req.session.userId){  

            return res.redirect("/")

            
        }

        next()
    },

    onlyAdmin(req, res, next){

        if(!req.session.isAdmin){

            
            return res.redirect("/admin")
        
        }

        next()

    }

    


    //ADMIN
    /*
    //OK ----- NAO PODE DELETAR suA CONTA

    */

    //USER
    /*
    //OK ----- NAO PODE DELETAR suA CONTA
    //OK ----- NAO PODE CRIAR EDITAR OU DELETAR: chefs, user
    //OK ----- SO PODE EDITAR E DELETA: RECEITAS PROPRIAS(listagem de receitas só pega as receitas dele)

    //MENSAGEMS

    //TUDO

    //TRYCATCH 
    //TUDO

    */

}