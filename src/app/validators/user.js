const User = require('../models/Users')
const Recipe = require("../models/Recipes")

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

            const {email, id} = req.body

            const fillAllfields = checkAllFields(req.body)

            if(fillAllfields) return res.render("admin/user/edit", fillAllfields)


            const userExists = await User.findOne({WHERE: {email}})
          
            if(userExists && userExists.id != id && userExists.email == email) return res.render("admin/user/edit", {
                user: req.body,
                error: "Este email ja esta cadastrado."
            })


            next()

        } catch (err) {
            console.error(err)

            return res.render("admin/user/edit", {
                user: req.body,
                error: "Algum erro aconteceu. Tente novamente."
            })
        }


    },

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



            const userExists = await User.findOne({WHERE: {email}})
           
            if(userExists && userExists.email == email) return res.render("admin/user/edit", {
                user: req.body,
                error: "Este email ja esta cadastrado."
            })


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

        

    },

    async isFromUser(req, res, next){//se a receita nao for criada pelo usuario

        const id = req.params.id

        console.log(id)

        const recipe = await Recipe.findOne({WHERE: {id} })
        
        if(req.session.userId != recipe.user_id) return res.redirect("/admin/recipes")

        next()

        
    },

    
    async adminPreventDelete(req, res, next){ 

        const id = req.params.id

        try {
        
            const user = await User.findOne({WHERE: {id}})

            if(req.session.userId == user.id){

                return res.render("admin/user/edit", {
                    user: req.body,
                    error:" Voce não pode deletar sua conta."
                })

            }
/* */
            if(user.is_admin){

                return res.render("admin/user/edit", {
                    user: req.body,
                    error:" Voce não pode deletar uma conta de administrador."
                })

            }

            req.user = user

            next()
    
        } catch (err) {
            console.error(err)

            return res.render("admin/user/edit", {
                user: req.body,
                error:"Um erro ocorreu tente novamente."
            })
        }


    }




}

