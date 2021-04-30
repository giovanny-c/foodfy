const User = require('../models/Users')

const {compare} = require('bcryptjs')//compara senhas

function checkAllFields(body){
        //checkar se tem todos os campos
        
        const keys = Object.keys(body)

        for(key of keys){
            
            if(body[key] == ""){
                return {
                    user: body,
                    error:'Preencha todos os campos'
                }
            }
        }

}

module.exports = {

    
    async showRecipe(req, res, next){
        next()
    },

    async post(req, res, next){

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
            error:'Usuário ja cadastrado'
        })

        next()
    }



}

