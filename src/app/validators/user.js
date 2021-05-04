const User = require('../models/Users')

const {compare} = require('bcryptjs')//compara senhas


function checkAllFields(body){
        //checkar se tem todos os campos

        let fields, name, email

        const keys = Object.keys(body)

        for(key of keys){          
            
            if(body[key] == ""){

                if(key == "name") name = key

                if(key == "email") email = key
                         
                fields = "vazio"
            }
               
            
        }

        if(fields) return{
            user: body,
            name,
            email,
            error:'Preencha todos os campos'
        }
    
        

}

module.exports = {

    
    async showRecipe(req, res, next){
        next()
    },

    async post(req, res, next){

        try {
            
        
            let {email} = req.body

            //check se os campos foram preechidos
            const fillAllfields = checkAllFields(req.body)

            if(fillAllfields) return res.render("admin/user/create", fillAllfields)

            //procura se ja existe esse email no bd
            const user = await User.findOne({
                WHERE: {email}
            })


            if(user) return res.render("admin/user/create", {
                user: req.body,
                error:'Usuário ja cadastrado.'
            })

            next()
        
    
        } catch (err) {
            console.error(err)
            return res.render("admin/user/create", {
                user: req.body,
                error:'Algum erro aconteceu. Tente novamente.'
            })
        }

    },

    async edit(req, res, next){
        

        try {

            const fillAllfields = checkAllFields(req.body)

            if(fillAllfields) return res.render("admin/user/edit", fillAllfields)

            next()

        } catch (err) {
            console.error(err)

            return res.render("admin/user/edit", {
                user: req.body,
                error: "Algum erro aconteceu. Tente novamente."
            })
        }


    },

    //validar delete(mensagem de confirmaçao, deseja deletar?)

    async profilePut(req, res, next){

        const {password, email, name} = req.body

        const body = {
            name,
            email
        }

        try {

            const id = req.session.userId

            const fillAllfields = checkAllFields(body)

            if(fillAllfields) return res.render("admin/user/profile", fillAllfields)


            if(!password) return res.render("admin/user/profile", {
                user: req.body,
                password: "senha incorreta",
                error: "Coloque a sua senha para atualizar seu cadastro."
            })


            const user = await User.findOne({WHERE: {id} })
            
            const confirmPassword = await compare(password, user.password)

            if(!confirmPassword) return res.render("admin/user/profile", {
                user: req.body,
                password: "senha incorreta",
                error: "Senha incorreta."
            })

            req.user = user

            next()

        } catch (err) {
            console.error

            return res.render("admin/user/profile", {
                user: req.body,
                error: "Algum erro aconteceu. Tente novamente."
            })
        }

        

    }



}

