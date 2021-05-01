const User = require('../models/Users')

const {compare} = require('bcryptjs')
const { login } = require('../controllers/session')

module.exports = {

    async login(req, res, next){

        const{email, password} = req.body
        
        try {
            
            //pesquisa se existe o user
            const user = await User.findOne({WHERE: {email} })

            if(!user) return res.render("session/login", {
                user: req.body,
                error: "Usuário nao cadastrado"
            })

            //compara as senhas
            const confirmPassword = await compare(password, user.password)

            if(!confirmPassword) return res.render('session/login', {
                user: req.body,
                error: "Senha incorreta"
            })

            req.user = user

            next()

        } catch (err) {
            console.error(err)
        }

    }

}