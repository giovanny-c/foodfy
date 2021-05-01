const User = require("../models/Users")

const mailer = require("../../lib/mailer")

const crypto = require('crypto')

module.exports = {

    listUsers(req, res){

        return res.render("admin/user/users")

    },

    createUser(req, res){

        return res.render("admin/user/create")

        //ver se ja existe um admin, se sim nao mostra o checkbox
    },


    async post(req, res){
    
        const user = req.body
        
        try {

            //se o admin nao for marcado/nao existir
            if(!req.body.is_admin) req.body.is_admin = 0

            //criando a senha

            const password = crypto.randomBytes(5).toString('hex')
            
            const data = {
                ...req.body,
                password
            }
            
            User.create(data)


            try {

                //enviando a senha por email
                await mailer.sendMail({
                to: data.email,
                from:'no-reply@foodfy.com.br',
                subject: "Senha de acesso foodfy",
                html:`
                
                <p>Sua senha é:</p>
                <h2> ${data.password} </h2>
                <p>clique 
                <a href="http://localhost:3000/login" target="_blank">
                        AQUI
                </a> para fazer o login
                </p>
                
                `
    
                })
                
                //res.redirect("/admin") 
    
                return res.render('admin/user/create', {
                    success: "Conta cadastrada! A senha de acesso foi enviada para o email cadastrado."
                })
    
    
            } catch (err) {
                console.error(err)
    
                return res.render('admin/user/create', {
                    error: "Conta cadastrada! Não foi possivel enviar a senha para o email cadastrado, solicite uma redefinição de senha"
                })
            }
        
        } catch (err) {
            console.error(err)

            return res.render("admin/user/create", {
                user: user,
                error: "Algum erro ocorreu, tente novamente"
            })
        }


    }


}