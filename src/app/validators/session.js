const User = require('../models/Users')

const {compare} = require('bcryptjs')
const { login } = require('../controllers/session')


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

    async login(req, res, next){

        const{email, password} = req.body
        
        try {

            const fillAllfields = checkAllFields(req.body)

            if(fillAllfields) return res.render("session/login", fillAllfields)
            
            //pesquisa se existe o user
            const user = await User.findOne({WHERE: {email} })

            if(!user) return res.render("session/login", {
                user: req.body,
                error: "Usuário nao cadastrado",
                email: "Este email nao existe"
            })

            //compara as senhas
            const confirmPassword = await compare(password, user.password)

            if(!confirmPassword) return res.render('session/login', {
                user: req.body,
                error: "Senha incorreta",
                password: "Senha incorreta"
            })

            req.user = user

            next()

        } catch (err) {
            console.error(err)

            return res.render('session/login', {
                user: req.body,
                error: "Algum erro ocorreu tente novamente"
                
            })
        }

    }

}