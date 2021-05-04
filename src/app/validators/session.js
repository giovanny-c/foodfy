const User = require('../models/Users')

const {compare} = require('bcryptjs')
const { login } = require('../controllers/session')


function checkAllFields(body){
    //checkar se tem todos os campos

    let fields, name, email, password, passwordRepeat

    const keys = Object.keys(body)

    for(key of keys){          
        
        if(body[key] == ""){

            if(key == "name") name = key

            if(key == "email") email = key

            if(key == "password") password = key

            if(key == "passwordRepeat") passwordRepeat = key
                     
            fields = "vazio"
        }
           
        
    }

    if(fields) return{
        user: body,
        name,
        email,
        password,
        passwordRepeat,
        token: body.token,
        error:'Preencha todos os campos'
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

    },

    async forgot(req, res, next){

        const {email} = req.body

        try {

            const fillAllfields = checkAllFields(req.body)

            if(fillAllfields) return res.render("session/forgot", fillAllfields)
            
            let user = await User.findOne({WHERE: {email} })

            if(!user) return res.render("session/forgot", {
                user: req.body,
                email: "email nao cadastrado",
                error: "Email não cadastrado."
            })

            req.user = user

            next()

        } catch (err) {
            console.error(err)

        }


    },

    async reset(req, res, next){

        const {email, password, passwordRepeat, token} = req.body

        try {

            const fillAllfields = checkAllFields(req.body)

            if(fillAllfields) return res.render("session/reset-password", fillAllfields)

            const user = await User.findOne({WHERE: {email} })

            if(!user) return res.render("session/reset-password", {
                user: req.body,
                token, 
                email: "email invalido",
                error: "Usuário nao cadastrado."
            })
            

            if(password != passwordRepeat) return res.render("session/reset-password", {
                user: req.body,
                token,
                password: "A repetição esta incorreta" ,
                error: "A repetição de senha esta incorreta."
            })

            
            if(token != user.reset_token) return res.render('session/reset-password', {
                user: req.body,
                token,
                error:'Token invalido, solicite uma nova recuperação de senha.'
            })

            let now = new Date()

            now = now.setHours(now.getHours())

            if(now > user.reset_token_expires) return res.render('session/reset-password', {
                user: req.body,
                token,
                error:'Token expirado, solicite uma nova recuperação de senha.'
            })

            req.user = user

            next()
            
        }catch(err) {
            console.error(err)
        }



    }

}