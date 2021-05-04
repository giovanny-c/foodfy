const User = require("../models/Users")

const mailer = require("../../lib/mailer")

const {hash} = require("bcryptjs")

const crypto = require('crypto')//para criar o token

module.exports = {


    showLoginForm(req, res){

        return res.render('session/login')

    },  

    showForgotForm(req, res){

        return res.render('session/forgot')

    },

    showResetForm(req, res){

        return res.render('session/reset-password.njk', {token: req.query.token})
    },

    login(req, res){

        req.session.userId = req.user.id

        req.session.isAdmin = req.user.is_admin

        

        return res.redirect("/admin")

    },

    logout(req, res){

        req.session.destroy()

        return res.redirect("/")
    },

    async recoveryPassword(req, res){

        const user = req.user

        try {
            
            const token = crypto.randomBytes(20).toString('hex')

            let now = new Date()

            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: "Recuperação de senha",
                html: `<h2>Esqueceu a senha.</h2>
                    <p>Não se preocupe, clique no link abaixo para redefini-la</p>

                    <p>
                    <a href="http://localhost:3000/reset-password?token=${token}" target="_blank">
                            RECUPERAR SENHA
                    </a>
                    </p>
                `

            })

            return res.render("session/forgot", {
                success: "O email com o link para recuperação de senha foi enviado para o seu inbox"
            })

        } catch (err) {
            console.error(err)

            return res.render("session/forgot", {
                error: "Algum erro aconteceu, tente novamente"
            })
        }
        

        

    },

    async resetPassword(req, res){

        const {user} = req

        const {password, token} = req.body

        try {

            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""

            })

            return res.render("session/login", {
                user: req.body,
                success: "Senha atualizada com sucesso!"
            })


            
        } catch (err) {
            console.error(err)

            return res.render("session/reset-password", {
                user: req.body,
                token,
                error: "Algum erro aconteceu, tente novamente"
            })
        }

        
    }

}